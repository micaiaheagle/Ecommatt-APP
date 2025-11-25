
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// Safe initialization that won't crash if process is undefined
const getApiKey = () => {
  let key = '';
  try {
    // Try process.env first (injected by Vite define)
    if (typeof process !== 'undefined' && process.env) {
        key = process.env.API_KEY || '';
    }
  } catch (e) {
    // ignore error accessing process
  }

  // Try import.meta.env fallback
  if (!key) {
      try {
        // @ts-ignore
        key = import.meta.env?.VITE_API_KEY || '';
      } catch(e) {
          // ignore
      }
  }

  // CRITICAL: Return a dummy key if no key is found.
  // Passing empty string/undefined to GoogleGenAI constructor throws an error 
  // and crashes the entire React app (White Screen).
  if (!key || key === 'undefined') {
      console.warn("Gemini API Key not found. Using dummy key to prevent crash.");
      return "DUMMY_KEY_TO_PREVENT_CRASH"; 
  }
  return key;
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const analyzePigImage = async (base64Image: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Analyze this pig image for a farm management system. 
            1. Estimate the weight in kg (provide a range).
            2. Estimate the Body Condition Score (BCS) on a scale of 1-5.
            3. Identify any visible signs of distress or health issues.
            4. Suggest if it looks ready for market based on standard finisher sizes.
            
            Return the response in a clear, concise format suitable for a mobile screen.`
          }
        ]
      }
    });
    return response.text || "Could not analyze image.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "Error analyzing image. Please try again or check API Key.";
  }
};

export const getFarmingAdvice = async (query: string, contextData: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert Agronomist and Veterinarian for Ecomatt Farm (Pig production).
      
      Current Farm Context:
      ${contextData}
      
      User Query: ${query}
      
      Provide a helpful, practical, and concise answer. Focus on pig production best practices, biosecurity, and efficiency.`
    });
    return response.text || "No advice generated.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Error generating advice. Please check your connection.";
  }
};

export const generateSmartAlerts = async (metrics: any): Promise<any[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze these farm metrics and generate 3 critical alerts or recommendations if needed.
            Metrics: ${JSON.stringify(metrics)}
            
            Return strictly valid JSON format: { "alerts": [{ "title": "...", "severity": "High"|"Medium"|"Low", "message": "..." }] }
            Do not include markdown formatting. Keep text brief.`,
            config: {
                responseMimeType: "application/json"
            }
        });
        
        let text = response.text;
        if (!text) return [];

        // Aggressive Cleanup
        text = text.trim();
        text = text.replace(/```json/g, "").replace(/```/g, "");

        // Defensive: Find the last closing brace to handle truncated responses
        const lastBrace = text.lastIndexOf('}');
        if (lastBrace !== -1) {
            text = text.substring(0, lastBrace + 1);
        }
        
        try {
            const data = JSON.parse(text);
            return data.alerts || [];
        } catch (parseError) {
            console.warn("JSON Parse Failed:", parseError);
            return [{
                title: "System Update",
                severity: "Low",
                message: "Insights are refreshing. Please check back."
            }];
        }
    } catch (e) {
        console.error("Smart Alert Generation Error", e);
        return [];
    }
}

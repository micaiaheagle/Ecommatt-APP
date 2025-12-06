
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// Safe initialization that prioritizes LocalStorage for user configurability
const getApiKey = () => {
  let key = '';

  // 1. Try LocalStorage (User Configured in Settings)
  if (typeof window !== 'undefined' && window.localStorage) {
    const localKey = localStorage.getItem('ECO_GEMINI_API_KEY');
    if (localKey) return localKey;
  }

  try {
    // 2. Try process.env first (injected by Vite define)
    if (typeof process !== 'undefined' && process.env) {
      key = process.env.API_KEY || '';
    }
  } catch (e) {
    // ignore error accessing process
  }

  // 3. Try import.meta.env fallback
  if (!key) {
    try {
      // @ts-ignore
      key = import.meta.env?.VITE_API_KEY || '';
    } catch (e) {
      // ignore
    }
  }

  // CRITICAL: Return a dummy key if no key is found.
  // Passing empty string/undefined to GoogleGenAI constructor throws an error 
  // and crashes the entire React app (White Screen).
  if (!key || key === 'undefined') {
    console.warn("Gemini API Key not found. Please configure it in Chitsano AI Settings.");
    return "DUMMY_KEY_TO_PREVENT_CRASH";
  }
  return key;
};

// Initialize with dynamic key getter? 
// GoogleGenAI instance caches the key. 
// We need a wrapper to ensure we use the latest key if user updates it.
const getAI = () => new GoogleGenAI({ apiKey: getApiKey() });

export const analyzePigImage = async (base64Image: string): Promise<string> => {
  try {
    const ai = getAI();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Analyze this livestock/crop image for Ecomatt Farm. 
            1. Identify the subject (Pig, Crop, etc).
            2. If Pig: Estimate weight (kg) and Body Condition Score (1-5).
            3. If Crop: Identify disease or deficiency if any.
            4. Provide a quick practical recommendation.
            
            Keep response concise and mobile-friendly.`
          }
        ]
      }
    });
    return response.text || "Could not analyze image.";
  } catch (error: any) {
    console.error("Gemini Vision Error:", error);
    if (error.message?.includes("API key")) {
      return "Broadcasting Error: Invalid API Key. Please update it in Settings.";
    }
    return "Analysis failed. Please check your internet or API Key.";
  }
};

export const getFarmingAdvice = async (query: string, contextData: string): Promise<string> => {
  try {
    const ai = getAI();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `You are Chitsano AI, an expert Agronomist and Veterinarian for Ecomatt Farm.
      
      Current Farm Context:
      ${contextData}
      
      User Query: ${query}
      
      Provide a helpful, practical, and concise answer. Focus on local Zimbabwe context if applicable.`
    });
    return response.text || "No advice generated.";
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    if (error.message?.includes("API key")) {
      return "Broadcasting Error: Invalid API Key. Please update it in Settings.";
    }
    return "Connection error. Please check your internet or API Key.";
  }
};

export const generateSmartAlerts = async (metrics: any): Promise<any[]> => {
  try {
    const key = getApiKey();
    if (key === "DUMMY_KEY_TO_PREVENT_CRASH") return [];

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
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
      return [];
    }
  } catch (e) {
    console.error("Smart Alert Generation Error", e);
    return [];
  }
}

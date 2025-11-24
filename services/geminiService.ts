import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    return "Error analyzing image. Please try again.";
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
            
            Return JSON format: { "alerts": [{ "title": "...", "severity": "High"|"Medium"|"Low", "message": "..." }] }`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    alerts: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          severity: { type: Type.STRING },
                          message: { type: Type.STRING }
                        }
                      }
                    }
                  }
                }
            }
        });
        
        const text = response.text;
        if (!text) return [];
        const data = JSON.parse(text);
        return data.alerts || [];
    } catch (e) {
        console.error("Smart Alert Error", e);
        return [];
    }
}
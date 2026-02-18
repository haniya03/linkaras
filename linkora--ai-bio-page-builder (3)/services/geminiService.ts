
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBio = async (keywords: string, persona: string) => {
  const prompt = `Generate 3 catchy, engaging social media bio options (max 150 characters each) based on these keywords: "${keywords}" and this persona: "${persona}". Return them in a JSON array of strings.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
};

export const optimizeLinkTitle = async (url: string) => {
  const prompt = `Given this URL: "${url}", suggest a short, punchy, call-to-action title (max 20 characters) for a bio link. Examples: "Join the Club", "Latest Beats", "Shop Collection". Return only the title as a plain string.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });

  return response.text?.replace(/"/g, '').trim() || "Click here";
};

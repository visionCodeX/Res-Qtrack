import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeSignal(signalData: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this rescue sensor data: ${JSON.stringify(signalData)}. 
      Provide a brief tactical assessment (max 15 words).`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Analysis failed", error);
    return "AI_OFFLINE: Standard processing active.";
  }
}


import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini API client following the official guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTransaction = async (description: string, amount: number) => {
  // Use ai.models.generateContent to query the model with structured output
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyse cette transaction de tontine au Tchad pour suspicion de fraude : "${description}" d'un montant de ${amount} FCFA. Réponds au format JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSuspicious: {
              type: Type.BOOLEAN,
              description: "Indique si la transaction est suspecte.",
            },
            reason: {
              type: Type.STRING,
              description: "La raison du marquage comme suspect ou non.",
            },
          },
          required: ["isSuspicious", "reason"],
        },
      },
    });

    // Directly access .text property from the response
    const jsonStr = response.text || "{}";
    const result = JSON.parse(jsonStr.trim());
    
    return {
      isSuspicious: result.isSuspicious ?? false,
      reason: result.reason ?? 'Analyse effectuée par l\'IA'
    };
  } catch (e) {
    console.warn("Gemini API error during transaction analysis:", e);
    return { isSuspicious: false, reason: 'Analyse IA indisponible pour le moment' };
  }
};

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Lazy initialization or safe check to prevent immediate crash if key is missing in demo
let genAI: GoogleGenAI | null = null;
try {
    if (apiKey) {
        genAI = new GoogleGenAI({ apiKey });
    }
} catch (e) {
    console.warn("Gemini API not initialized:", e);
}

export const analyzeTransaction = async (description: string, amount: number) => {
  // Placeholder implementation since we don't have the API key available in the browser securely without a backend proxy usually.
  // In a real implementation, this would call Cloud Functions which then calls Gemini.
  if (!genAI) {
      return { isSuspicious: false, reason: 'AI Service unavailable (Demo)' };
  }
  return { isSuspicious: false, reason: 'Analysis skipped in demo mode' };
};
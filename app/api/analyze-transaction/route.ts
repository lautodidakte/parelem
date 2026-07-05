import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

// Route serveur : la clé Gemini reste côté serveur (jamais exposée au
// navigateur). C'est l'un des gains clés de la migration vers Next.js — un SPA
// pur ne pourrait pas garder ce secret.
export const runtime = "nodejs";

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  let description = "";
  let amount = 0;
  try {
    const body = await req.json();
    description = String(body?.description ?? "");
    amount = Number(body?.amount ?? 0);
  } catch {
    return NextResponse.json(
      { isSuspicious: false, reason: "Requête invalide" },
      { status: 400 },
    );
  }

  if (!apiKey) {
    return NextResponse.json({
      isSuspicious: false,
      reason: "Analyse IA non configurée (GEMINI_API_KEY absente)",
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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

    const jsonStr = response.text || "{}";
    const result = JSON.parse(jsonStr.trim());

    return NextResponse.json({
      isSuspicious: result.isSuspicious ?? false,
      reason: result.reason ?? "Analyse effectuée par l'IA",
    });
  } catch (e) {
    console.warn("Gemini API error during transaction analysis:", e);
    return NextResponse.json({
      isSuspicious: false,
      reason: "Analyse IA indisponible pour le moment",
    });
  }
}

// Appelle la route serveur /api/analyze-transaction.
// La clé Gemini n'est plus jamais présente dans le bundle navigateur.

export interface TransactionAnalysis {
  isSuspicious: boolean;
  reason: string;
}

export const analyzeTransaction = async (
  description: string,
  amount: number,
): Promise<TransactionAnalysis> => {
  try {
    const res = await fetch("/api/analyze-transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, amount }),
    });

    if (!res.ok) {
      return { isSuspicious: false, reason: "Analyse IA indisponible" };
    }

    const data = await res.json();
    return {
      isSuspicious: data.isSuspicious ?? false,
      reason: data.reason ?? "Analyse effectuée par l'IA",
    };
  } catch (e) {
    console.warn("Erreur lors de l'analyse de transaction:", e);
    return { isSuspicious: false, reason: "Analyse IA indisponible pour le moment" };
  }
};

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Client Supabase côté navigateur.
// Renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans
// .env.local (et dans les variables d'environnement Vercel) pour l'activer.
//
// Étape suivante de la migration : remplacer les données fictives de
// constants.ts / des contextes par des requêtes vers ce client, et brancher
// l'authentification OTP par téléphone (Supabase Auth).

let browserClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Non configuré : l'app continue de fonctionner en mode démo (mock).
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(url, anonKey);
  }
  return browserClient;
}

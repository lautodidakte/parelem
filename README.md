# Parelem — Tontine & Impact

Plateforme sociale de gestion de tontines et de suivi d'impact au Tchad.

Application **Next.js 15** (App Router) + **React 19** + **TypeScript** + **Tailwind CSS**, déployée sur **Vercel**. Migration depuis l'ancienne base Vite/SPA (les écrans historiques tournent côté client via `react-router-dom`, encapsulés dans Next.js).

## Stack

| Couche          | Techno                                              |
| --------------- | --------------------------------------------------- |
| Framework       | Next.js 15 (App Router), déploiement natif Vercel   |
| UI              | React 19, Tailwind CSS, lucide-react, recharts      |
| IA              | Google Gemini (via route serveur `/api/...`)        |
| Base / Auth     | Supabase (schéma prêt — voir `supabase/migrations`) |
| Paiements       | Mobile Money (Airtel Money / Moov) — à intégrer     |

## Démarrer en local

**Prérequis :** Node.js 18+

```bash
npm install
cp .env.example .env.local   # puis renseigner les clés
npm run dev                  # http://localhost:3000
```

## Structure

- `app/` — App Router (layout, page d'entrée, routes API serveur)
- `components/`, `contexts/`, `services/` — écrans et logique (repris de l'existant)
- `lib/supabase/` — client Supabase (à brancher)
- `supabase/migrations/` — schéma SQL initial (Postgres + RLS)

## Feuille de route

1. ✅ Migration Next.js + déploiement Vercel
2. ✅ IA Gemini déplacée côté serveur (clé protégée)
3. ⏳ Brancher Supabase (auth OTP téléphone + remplacer les données mock)
4. ⏳ Paiements Mobile Money (Airtel Money API / agrégateur pan-africain)
5. ⏳ PWA offline complète (service worker + file de synchronisation)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Les composants historiques (react-router-dom) tournent côté client.
  // Cette base Next.js ajoute : rendu serveur possible, routes API sécurisées
  // (paiements/webhooks Mobile Money, Gemini) et déploiement natif Vercel.
};

export default nextConfig;

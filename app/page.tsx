"use client";

import dynamic from "next/dynamic";

// L'application historique repose sur react-router-dom (HashRouter) et sur
// window/localStorage : elle doit tourner uniquement côté client. On la charge
// donc en dynamique avec ssr:false (autorisé ici car ce fichier est un Client
// Component). Le reste de la base Next.js (routes API, layout, PWA) est, lui,
// bien rendu côté serveur.
const App = dynamic(() => import("@/App"), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  ),
});

export default function Page() {
  return <App />;
}

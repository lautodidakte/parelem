"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface BalanceCardProps {
  label: string;
  amount: number;
  currency?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
}

const format = (n: number) => new Intl.NumberFormat("fr-TD").format(n);

// Carte "solde" façon fintech (pattern inspiré de 21st.dev Payment Card) :
// dégradé de marque, masquage du montant à l'œil, actions optionnelles.
export const BalanceCard: React.FC<BalanceCardProps> = ({
  label,
  amount,
  currency = "FCFA",
  actions,
  footer,
}) => {
  const [hidden, setHidden] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-3xl p-7 text-white shadow-xl bg-gradient-to-br from-primary to-primaryDark">
      {/* Halo décoratif */}
      <div className="absolute -top-20 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-10 w-56 h-56 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">
            {label}
          </p>
          <button
            type="button"
            onClick={() => setHidden((h) => !h)}
            className="p-2 -mr-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={hidden ? "Afficher le solde" : "Masquer le solde"}
          >
            {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <h2 className="mt-2 text-4xl font-bold font-heading tracking-tight tabular-nums">
          {hidden ? "•• ••• •••" : format(amount)}{" "}
          <span className="text-lg font-normal text-white/60">{currency}</span>
        </h2>

        {actions && <div className="mt-6">{actions}</div>}
        {footer && <div className="mt-6 border-t border-white/10 pt-5">{footer}</div>}
      </div>
    </div>
  );
};

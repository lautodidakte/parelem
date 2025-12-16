
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

interface OTPVerificationProps {
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  isLoading: boolean;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  email, 
  onVerify, 
  onResend, 
  isLoading 
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 1. Auto-focus sur le premier input au mount
  useEffect(() => {
    otpRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // 4. Accepter UNIQUEMENT les chiffres (0-9)
    if (value !== '' && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // On ne prend que le dernier caractère au cas où l'utilisateur tape vite
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // 2. Quand un chiffre est tapé, focus automatique sur le suivant
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    // 3. Quand Backspace est pressé sur un input vide, revenir au précédent
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    // 7. Au clic sur "Vérifier", appeler onVerify(code)
    if (code.length === 6) {
      onVerify(code);
    }
  };

  // 5 & 6. État du bouton (Désactivé si < 6 chiffres)
  const isComplete = otp.every(digit => digit !== '');

  return (
    <form onSubmit={handleSubmit} className="animate-in zoom-in-95 duration-300">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <ShieldCheck size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Vérification</h2>
        <p className="text-white/70 text-sm mt-2 max-w-xs mx-auto">
          Saisissez le code envoyé à <span className="text-white font-bold">{email}</span>
        </p>
      </div>

      <div className="flex justify-between gap-2 mb-8">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => { otpRefs.current[idx] = el }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
            className="w-11 h-14 rounded-xl border-none bg-white text-center text-2xl font-bold text-primary shadow-lg focus:ring-4 focus:ring-secondary/50 outline-none transition-all"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={!isComplete || isLoading}
        className={`w-full bg-secondary text-primaryDark font-bold text-base py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] ${
          !isComplete || isLoading ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-[#ffc800]'
        }`}
      >
        {isLoading ? (
          <Loader2 className="animate-spin mx-auto" size={24} />
        ) : (
          "Vérifier le code"
        )}
      </button>

      <div className="text-center mt-6">
        <button
          type="button"
          onClick={onResend}
          className="text-white/70 text-sm hover:text-white transition-colors"
        >
          Renvoyer le code par SMS
        </button>
      </div>
    </form>
  );
};

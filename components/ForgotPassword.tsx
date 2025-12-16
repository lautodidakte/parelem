
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Circle, 
  Loader2, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

type ForgotStep = 'EMAIL' | 'OTP' | 'NEW_PASSWORD';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<ForgotStep>('EMAIL');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Refs for OTP
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Validation Rules
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword !== '';
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber && passwordsMatch;

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return setError("Veuillez entrer une adresse email valide.");
    }
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value !== '' && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length < 6) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('NEW_PASSWORD');
    }, 1200);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Votre mot de passe a été réinitialisé avec succès !");
      navigate('/login');
    }, 2000);
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name.substring(0, 3)}***@${domain}`;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-primary p-6 relative overflow-y-auto">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <button 
        onClick={() => step === 'EMAIL' ? navigate('/login') : setStep(step === 'OTP' ? 'EMAIL' : 'OTP')}
        className="fixed top-8 left-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-50 backdrop-blur-sm group"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      <div className="w-full max-w-md mt-24 relative z-10">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
          
          {step === 'EMAIL' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={40} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">Mot de passe oublié</h2>
                <p className="text-gray-500 text-sm mt-2">Entrez votre email pour recevoir un code de vérification.</p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={20} /></div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@directpare.td"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 text-gray-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm font-medium transition-all"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading || !email}
                  className="w-full bg-secondary text-primary font-bold py-4 rounded-2xl shadow-lg shadow-secondary/20 hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : "Envoyer le code"}
                </button>
              </form>
            </div>
          )}

          {step === 'OTP' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck size={40} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">Code de vérification</h2>
                <p className="text-gray-500 text-sm mt-2">
                  Entrez le code à 6 chiffres envoyé à <br/>
                  <span className="text-primary font-bold">{maskEmail(email)}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="flex justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpRefs.current[idx] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => e.key === 'Backspace' && !otp[idx] && idx > 0 && otpRefs.current[idx-1]?.focus()}
                      className="w-12 h-14 rounded-xl border border-gray-100 bg-gray-50 text-center text-xl font-bold text-primary focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    />
                  ))}
                </div>
                <div className="space-y-4">
                  <button 
                    type="submit" 
                    disabled={isLoading || otp.join('').length < 6}
                    className="w-full bg-secondary text-primary font-bold py-4 rounded-2xl shadow-lg shadow-secondary/20 hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : "Vérifier"}
                  </button>
                  <div className="text-center">
                    <button type="button" className="text-sm font-bold text-primary hover:underline">Renvoyer le code</button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {step === 'NEW_PASSWORD' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={40} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">Nouveau mot de passe</h2>
                <p className="text-gray-500 text-sm mt-2">Sécurisez votre compte DirectParé.</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={18} /></div>
                    <input 
                      type={showPass ? "text" : "password"} 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nouveau mot de passe"
                      className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-100 bg-gray-50 text-gray-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm font-medium transition-all"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><CheckCircle2 size={18} /></div>
                    <input 
                      type={showPass ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmer le mot de passe"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 text-gray-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Critères de sécurité</p>
                  <div className="flex flex-col gap-2">
                    <div className={`flex items-center gap-2 text-xs font-medium ${hasMinLength ? 'text-green-600' : 'text-gray-400'}`}>
                      {hasMinLength ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                      Min. 8 caractères
                    </div>
                    <div className={`flex items-center gap-2 text-xs font-medium ${hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
                      {hasUppercase ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                      Une majuscule
                    </div>
                    <div className={`flex items-center gap-2 text-xs font-medium ${hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                      {hasNumber ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                      Un chiffre
                    </div>
                    {confirmPassword && (
                      <div className={`flex items-center gap-2 text-xs font-medium ${passwordsMatch ? 'text-green-600' : 'text-red-400'}`}>
                        {passwordsMatch ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        Mots de passe identiques
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading || !isPasswordValid}
                  className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isPasswordValid 
                      ? 'bg-secondary text-primary hover:bg-yellow-400 shadow-secondary/20' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : "Réinitialiser mon mot de passe"}
                </button>
              </form>
            </div>
          )}
        </div>
        
        <p className="text-center text-white/50 text-[10px] font-medium mt-8 uppercase tracking-widest">
          DirectParé • Sécurité & Impact
        </p>
      </div>

      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xs bg-red-500 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-xs font-medium">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto">✕</button>
        </div>
      )}
    </div>
  );
};

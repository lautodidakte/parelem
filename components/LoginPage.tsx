
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowRight, ArrowLeft, Edit2, Lock, Mail, CheckCircle2, User as UserIcon, Phone, ShieldCheck, KeyRound, Info, ShieldAlert } from 'lucide-react';
import { RegistrationData } from '../types';
import { OTPVerification } from './OTPVerification';

type AuthView = 'LOGIN_EMAIL' | 'LOGIN_PASSWORD' | 'REGISTER' | 'OTP' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD';

interface LoginPageProps {
  initialView?: AuthView;
  registrationLevel?: 'A' | 'B';
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialView = 'LOGIN_EMAIL', registrationLevel = 'A' }) => {
  const [view, setView] = useState<AuthView>(initialView);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration State
  const [regData, setRegData] = useState<RegistrationData>({
    firstName: '', lastName: '', username: '', email: '', phone: '', password: '', confirmPassword: '', acceptTerms: false
  });

  // Global UI State
  const [error, setError] = useState<string | null>(null);
  const [isLoadingInternal, setIsLoadingInternal] = useState(false);
  
  // Context & Hooks
  const { login, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();

  // Sync internal view with prop change if needed
  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'TREASURER') navigate('/dashboard');
      else if (user.role === 'SUPERVISOR') navigate('/supervisor');
      else if (user.role === 'MEMBER') navigate('/member');
    }
  }, [user, navigate]);

  // Helpers
  const validateEmail = (email: string) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const handleLoginStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) return setError("L'adresse email est requise.");
    if (!validateEmail(email)) return setError("Email invalide.");
    setView('LOGIN_PASSWORD');
  };

  const handleLoginStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password) return setError("Mot de passe requis.");
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Erreur de connexion.");
    }
  };

  // Validation Check for Registration
  const isRegFormValid = () => {
    return (
      regData.firstName.trim() !== '' &&
      regData.lastName.trim() !== '' &&
      regData.username.trim() !== '' &&
      regData.email.trim() !== '' &&
      validateEmail(regData.email) !== null &&
      regData.phone.trim() !== '' &&
      regData.password.length >= 6 &&
      regData.password === regData.confirmPassword &&
      regData.acceptTerms
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!isRegFormValid()) {
        return setError("Veuillez remplir correctement tous les champs.");
    }

    setIsLoadingInternal(true);
    setTimeout(() => {
        setIsLoadingInternal(false);
        setEmail(regData.email); 
        setView('OTP');
    }, 1000);
  };

  const handleOtpVerify = (code: string) => {
      setError(null);
      setIsLoadingInternal(true);
      setTimeout(async () => {
          setIsLoadingInternal(false);
          const userEmail = email || regData.email;
          if (userEmail) {
              try {
                await login(userEmail);
              } catch(e) {
                setError("Vérification réussie, mais erreur de connexion auto.");
                setView('LOGIN_EMAIL');
              }
          }
      }, 1500);
  };

  const handleGlobalBack = () => {
    if (view === 'LOGIN_EMAIL') {
      navigate('/');
    } else if (view === 'LOGIN_PASSWORD' || view === 'OTP' || view === 'FORGOT_PASSWORD') {
      setView('LOGIN_EMAIL');
    } else if (view === 'REGISTER' || view === 'RESET_PASSWORD') {
      setView('LOGIN_EMAIL');
    }
  };

  // Inline Validation Helpers
  const showEmailError = regData.email !== '' && !validateEmail(regData.email);
  const showPasswordLengthError = regData.password !== '' && regData.password.length < 6;
  const showPasswordMatchError = regData.confirmPassword !== '' && regData.password !== regData.confirmPassword;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-primary p-4 relative overflow-y-auto py-20">
      
      {/* Bouton de retour en haut à gauche */}
      <button 
        onClick={handleGlobalBack}
        className="fixed top-6 left-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-50 backdrop-blur-sm group"
        aria-label="Retour"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Cercles de fond */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className={`text-center mb-10 relative z-10 transition-all ${view === 'REGISTER' ? 'mt-4' : ''}`}>
        <h1 className="text-4xl font-bold text-white mb-0.5 font-heading tracking-tight">Parelem</h1>
        <p className="text-white/80 text-[10px] font-medium uppercase tracking-widest">Tontine & Impact</p>
      </div>
      
      <div className={`w-full relative z-10 transition-all duration-300 ${view === 'REGISTER' ? 'max-w-md' : 'max-w-[320px]'}`}>
        
        {view === 'LOGIN_EMAIL' && (
          <form onSubmit={handleLoginStep1} className="animate-in fade-in slide-in-from-right-8 duration-300 space-y-5">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white leading-tight mb-1">Connexion</h2>
                <p className="text-white/60 text-xs">Entrez votre email pour accéder à votre espace.</p>
            </div>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"><Mail size={18} /></div>
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@parelem.td"
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border-0 bg-white text-gray-900 shadow-[0_0_20px_rgba(255,255,255,0.1)] focus:ring-4 focus:ring-secondary/50 outline-none text-sm font-medium"
                  autoFocus
                />
            </div>
            <button type="submit" className="w-full bg-secondary text-primaryDark font-bold text-base py-4 rounded-2xl shadow-xl hover:bg-[#ffc800] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
              Continuer <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="text-center pt-8">
                <p className="text-white/60 text-[13px] mb-3">Pas encore de compte ?</p>
                <div className="flex flex-col gap-3">
                  <button 
                    type="button" 
                    onClick={() => setView('REGISTER')} 
                    className="text-white font-bold text-[14px] hover:text-secondary transition-colors"
                  >
                    Créer un compte
                  </button>
                  <button 
                    type="button" 
                    onClick={() => navigate('/signup-parrainage')} 
                    className="text-white font-bold text-[14px] hover:text-secondary transition-colors"
                  >
                    Se faire parrainer
                  </button>
                </div>
            </div>
          </form>
        )}

        {view === 'LOGIN_PASSWORD' && (
          <form onSubmit={handleLoginStep2} className="animate-in fade-in slide-in-from-right-8 duration-300 space-y-5">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 mb-6 flex items-center justify-between">
               <div className="flex items-center gap-3 overflow-hidden">
                 <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {email.charAt(0).toUpperCase()}
                 </div>
                 <span className="text-sm font-bold text-white truncate">{email}</span>
               </div>
               <button type="button" onClick={() => setView('LOGIN_EMAIL')} className="p-1.5 text-white/60 hover:text-white"><Edit2 size={16} /></button>
            </div>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"><Lock size={18} /></div>
                <input 
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border-0 bg-white text-gray-900 shadow-xl focus:ring-4 focus:ring-secondary/50 outline-none text-sm font-medium"
                  autoFocus
                />
            </div>
            <button type="submit" disabled={authLoading} className="w-full bg-secondary text-primaryDark font-bold text-base py-4 rounded-2xl shadow-xl hover:bg-[#ffc800] transition-all flex items-center justify-center gap-2">
               {authLoading ? <Loader2 className="animate-spin" size={18} /> : <>Se connecter <CheckCircle2 size={18}/></>}
            </button>
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => navigate('/forgot-password')}
                className="text-white/60 text-xs hover:text-white underline underline-offset-4"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </form>
        )}

        {view === 'REGISTER' && (
           <form onSubmit={handleRegisterSubmit} className="animate-in slide-in-from-bottom-8 duration-500 bg-white rounded-3xl p-6 shadow-2xl space-y-4">
              
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200 mb-2 shadow-sm">
                  <ShieldAlert size={14} className="text-gray-400" />
                  <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Compte Standard</span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium">Vous pourrez vérifier votre identité après inscription</p>
              </div>

              <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Inscription</h2>
                  {registrationLevel === 'B' && <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full flex items-center gap-1"><Info size={12}/> Parrainage</span>}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                  <div>
                      <label className="text-[11px] font-bold text-gray-500 ml-1">Prénom</label>
                      <input required type="text" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={regData.firstName} onChange={e => setRegData({...regData, firstName: e.target.value})}/>
                  </div>
                  <div>
                      <label className="text-[11px] font-bold text-gray-500 ml-1">Nom</label>
                      <input required type="text" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={regData.lastName} onChange={e => setRegData({...regData, lastName: e.target.value})}/>
                  </div>
              </div>

              <div>
                  <label className="text-[11px] font-bold text-gray-500 ml-1">Nom d'utilisateur</label>
                  <div className="relative">
                      <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input required type="text" placeholder="@utilisateur" className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={regData.username} onChange={e => setRegData({...regData, username: e.target.value})}/>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1">
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Email</label>
                    <input required type="email" className={`w-full px-4 py-3 bg-gray-50 rounded-xl border ${showEmailError ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-primary/20'} text-sm outline-none transition-all`} value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})}/>
                    {showEmailError && <p className="text-[9px] text-red-500 mt-1 ml-1 font-bold animate-in fade-in">Email invalide</p>}
                </div>
                <div>
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Téléphone</label>
                    <input required type="tel" placeholder="+235..." className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})}/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Mot de passe</label>
                    <input required type="password" placeholder="min. 6 car." className={`w-full px-4 py-3 bg-gray-50 rounded-xl border ${showPasswordLengthError ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-primary/20'} text-sm outline-none transition-all`} value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})}/>
                    {showPasswordLengthError && <p className="text-[9px] text-red-500 mt-1 ml-1 font-bold animate-in fade-in">Minimum 6 caractères</p>}
                </div>
                <div>
                    <label className="text-[11px] font-bold text-gray-500 ml-1">Confirmer</label>
                    <input required type="password" className={`w-full px-4 py-3 bg-gray-50 rounded-xl border ${showPasswordMatchError ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-primary/20'} text-sm outline-none transition-all`} value={regData.confirmPassword} onChange={e => setRegData({...regData, confirmPassword: e.target.value})}/>
                    {showPasswordMatchError && <p className="text-[9px] text-red-500 mt-1 ml-1 font-bold animate-in fade-in">Les mots de passe ne correspondent pas</p>}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2">
                    <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary" checked={regData.acceptTerms} onChange={e => setRegData({...regData, acceptTerms: e.target.checked})}/>
                    <label htmlFor="terms" className="text-[10px] text-gray-600 leading-tight">J'accepte les Conditions d'Utilisation de Parelem et certifie l'exactitude des informations.</label>
                </div>

                <div className="flex gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                  <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    💡 Après inscription, vous pourrez vérifier votre identité pour accéder à toutes les fonctionnalités (création de tontine, rôle d'admin, etc.)
                  </p>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoadingInternal || !isRegFormValid()} 
                className={`w-full font-bold text-base py-4 rounded-xl shadow-lg transition-all mt-2 flex items-center justify-center gap-2 ${
                  isLoadingInternal || !isRegFormValid() 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-secondary text-primaryDark hover:bg-[#ffc800] active:scale-[0.98]'
                }`}
              >
                  {isLoadingInternal ? <Loader2 className="animate-spin" size={24}/> : <>Créer mon compte <ArrowRight size={18}/></>}
              </button>
           </form>
        )}

        {view === 'OTP' && (
            <OTPVerification 
              email={email || regData.email} 
              onVerify={handleOtpVerify} 
              onResend={() => console.log("OTP Resend requested")}
              isLoading={isLoadingInternal}
            />
        )}

        {error && (
            <div className="absolute -bottom-20 left-0 w-full bg-red-500 text-white text-[12px] font-medium p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
                <AlertCircle size={18} className="shrink-0" />
                <span className="flex-1 leading-snug">{error}</span>
                <button type="button" onClick={() => setError(null)} className="ml-auto opacity-70 hover:opacity-100">✕</button>
            </div>
        )}
      </div>
    </div>
  );
};

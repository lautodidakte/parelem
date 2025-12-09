
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowRight, ArrowLeft, Edit2, Lock, Mail, CheckCircle2, User as UserIcon, Phone, FileText, ShieldCheck, KeyRound } from 'lucide-react';
import { RegistrationData } from '../types';

type AuthView = 'LOGIN_EMAIL' | 'LOGIN_PASSWORD' | 'REGISTER' | 'OTP' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD';

export const LoginPage: React.FC = () => {
  const [view, setView] = useState<AuthView>('LOGIN_EMAIL');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration State
  const [regData, setRegData] = useState<RegistrationData>({
    firstName: '', lastName: '', username: '', email: '', phone: '', password: '', confirmPassword: '', acceptTerms: false
  });

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Global UI State
  const [error, setError] = useState<string | null>(null);
  const [isLoadingInternal, setIsLoadingInternal] = useState(false);
  
  // Context & Hooks
  const { login, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();

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

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // --- Handlers ---

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
      await login(email); // Mock login
    } catch (err: any) {
      setError(err.message || "Erreur de connexion.");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic Validation
    if (!regData.firstName || !regData.lastName || !regData.username || !regData.email || !regData.password) {
        return setError("Tous les champs sont requis.");
    }
    if (regData.password !== regData.confirmPassword) {
        return setError("Les mots de passe ne correspondent pas.");
    }
    if (!regData.acceptTerms) {
        return setError("Vous devez accepter les conditions d'utilisation.");
    }

    // Simulate API call
    setIsLoadingInternal(true);
    setTimeout(() => {
        setIsLoadingInternal(false);
        // Assuming success, go to OTP
        // We carry over the email to OTP context
        setEmail(regData.email); 
        setView('OTP');
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      const code = otp.join('');
      if (code.length < 6) return setError("Veuillez saisir le code complet.");

      setIsLoadingInternal(true);
      setTimeout(async () => {
          setIsLoadingInternal(false);
          
          if (view === 'OTP') {
             // Logic: If previous view was Register -> Login directly
             // Logic: If previous view was ForgotPassword -> Go to Reset
             // For simplicity in this demo, we check if regData.email is populated to know if we came from register
             if (regData.email === email && regData.email !== '') {
                 // Registration flow complete
                 try {
                    await login(regData.email); // Auto login
                 } catch(e) {
                     setError("Compte créé mais erreur de connexion auto.");
                     setView('LOGIN_EMAIL');
                 }
             } else {
                 // Forgot password flow
                 setView('RESET_PASSWORD');
             }
          }
      }, 1000);
  };

  const handleForgotPasswordRequest = (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateEmail(email)) return setError("Email invalide.");
      
      setIsLoadingInternal(true);
      setTimeout(() => {
          setIsLoadingInternal(false);
          // Go to OTP
          setView('OTP');
      }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmNewPassword) return setError("Les mots de passe ne correspondent pas.");
      
      setIsLoadingInternal(true);
      setTimeout(() => {
          setIsLoadingInternal(false);
          setView('LOGIN_EMAIL');
          alert("Mot de passe réinitialisé avec succès !");
          setPassword(''); // Clear old logic
      }, 1000);
  };

  // --- Render Components ---

  const renderBackBtn = (target: AuthView) => (
    <button 
      onClick={() => setView(target)} 
      className="absolute top-6 left-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-50 backdrop-blur-sm group"
    >
      <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
    </button>
  );

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-primary p-6 relative overflow-y-auto">
      
      {/* Background FX */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header (Hidden on Reg form to save space on mobile) */}
      <div className={`text-center mb-6 relative z-10 transition-all ${view === 'REGISTER' ? 'mt-8' : ''}`}>
        <h1 className="text-4xl font-bold text-white mb-1 font-heading tracking-tight">Mon Paré</h1>
        <p className="text-white/80 text-xs font-medium uppercase tracking-widest">Tontine & Impact</p>
      </div>
      
      {/* Main Card Container */}
      <div className={`w-full relative z-10 transition-all duration-300 ${view === 'REGISTER' ? 'max-w-md' : 'max-w-[340px]'}`}>
        
        {/* --- VIEW: LOGIN EMAIL --- */}
        {view === 'LOGIN_EMAIL' && (
          <form onSubmit={handleLoginStep1} className="animate-in fade-in slide-in-from-right-8 duration-300 space-y-6">
            <button onClick={() => navigate('/')} type="button" className="absolute -top-20 left-0 p-2 text-white/50 hover:text-white"><ArrowLeft /></button>
            
            <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-white">Connexion</h2>
                <p className="text-white/60 text-sm">Entrez votre email pour accéder à votre espace.</p>
            </div>

            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"><Mail size={20} /></div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@monpare.td"
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border-0 bg-white text-gray-900 shadow-lg focus:ring-4 focus:ring-secondary/50 outline-none"
                  autoFocus
                />
            </div>

            <button type="submit" className="w-full bg-secondary text-primaryDark font-bold text-lg py-4 rounded-2xl shadow-xl hover:bg-[#ffc800] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
              Continuer <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="text-center pt-4">
                <p className="text-white/80 text-sm">Pas encore de compte ?</p>
                <button type="button" onClick={() => setView('REGISTER')} className="text-secondary font-bold hover:underline mt-1">Créer un compte maintenant</button>
            </div>
          </form>
        )}

        {/* --- VIEW: LOGIN PASSWORD --- */}
        {view === 'LOGIN_PASSWORD' && (
          <form onSubmit={handleLoginStep2} className="animate-in fade-in slide-in-from-right-8 duration-300 space-y-6">
            {renderBackBtn('LOGIN_EMAIL')}
            
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 mb-6 flex items-center justify-between">
               <div className="flex items-center gap-3 overflow-hidden">
                 <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {email.charAt(0).toUpperCase()}
                 </div>
                 <span className="text-sm font-bold text-white truncate">{email}</span>
               </div>
               <button type="button" onClick={() => setView('LOGIN_EMAIL')} className="p-2 text-white/60 hover:text-white"><Edit2 size={16} /></button>
            </div>

            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"><Lock size={20} /></div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border-0 bg-white text-gray-900 shadow-lg focus:ring-4 focus:ring-secondary/50 outline-none"
                  autoFocus
                />
            </div>

            <div className="text-right">
               <button type="button" onClick={() => setView('FORGOT_PASSWORD')} className="text-xs font-bold text-secondary hover:text-white transition-colors">Mot de passe oublié ?</button>
            </div>

            <button type="submit" disabled={authLoading} className="w-full bg-secondary text-primaryDark font-bold text-lg py-4 rounded-2xl shadow-xl hover:bg-[#ffc800] transition-all flex items-center justify-center gap-2">
               {authLoading ? <Loader2 className="animate-spin" /> : <>Se connecter <CheckCircle2 /></>}
            </button>
            
            {/* Demo Helpers */}
            <div className="mt-6 text-[10px] text-white/50 text-center">
                <p className="mb-2 uppercase font-bold">Comptes Démo :</p>
                <span onClick={() => setEmail('mahamat@monpare.td')} className="cursor-pointer hover:text-secondary underline mx-2">Trésorier</span>
                <span onClick={() => setEmail('zara@monpare.td')} className="cursor-pointer hover:text-secondary underline mx-2">Membre</span>
            </div>
          </form>
        )}

        {/* --- VIEW: REGISTER --- */}
        {view === 'REGISTER' && (
           <form onSubmit={handleRegisterSubmit} className="animate-in slide-in-from-bottom-8 duration-500 bg-white rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-4 mb-2">
                  <button type="button" onClick={() => setView('LOGIN_EMAIL')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} className="text-gray-600"/></button>
                  <h2 className="text-xl font-bold text-gray-900">Créer un compte</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                  <div>
                      <label className="text-xs font-bold text-gray-500 ml-1">Prénom</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        value={regData.firstName}
                        onChange={e => setRegData({...regData, firstName: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-gray-500 ml-1">Nom</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        value={regData.lastName}
                        onChange={e => setRegData({...regData, lastName: e.target.value})}
                      />
                  </div>
              </div>

              <div>
                  <label className="text-xs font-bold text-gray-500 ml-1">Nom d'utilisateur</label>
                  <div className="relative">
                      <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input 
                        required
                        type="text" 
                        placeholder="@utilisateur"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        value={regData.username}
                        onChange={e => setRegData({...regData, username: e.target.value})}
                      />
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-bold text-gray-500 ml-1">Email</label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input 
                            required
                            type="email" 
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            value={regData.email}
                            onChange={e => setRegData({...regData, email: e.target.value})}
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 ml-1">Téléphone</label>
                    <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input 
                            required
                            type="tel" 
                            placeholder="+235..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            value={regData.phone}
                            onChange={e => setRegData({...regData, phone: e.target.value})}
                        />
                    </div>
                </div>
              </div>

              <div>
                  <label className="text-xs font-bold text-gray-500 ml-1">Mot de passe</label>
                  <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input 
                        required
                        type="password" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        value={regData.password}
                        onChange={e => setRegData({...regData, password: e.target.value})}
                      />
                  </div>
              </div>
              
              <div>
                  <label className="text-xs font-bold text-gray-500 ml-1">Confirmer Mot de passe</label>
                  <div className="relative">
                      <ShieldCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input 
                        required
                        type="password" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        value={regData.confirmPassword}
                        onChange={e => setRegData({...regData, confirmPassword: e.target.value})}
                      />
                  </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary"
                    checked={regData.acceptTerms}
                    onChange={e => setRegData({...regData, acceptTerms: e.target.checked})}
                  />
                  <label htmlFor="terms" className="text-xs text-gray-600 leading-snug">
                      J'accepte les <a href="#" className="text-primary font-bold hover:underline">Conditions d'Utilisation</a> et la <a href="#" className="text-primary font-bold hover:underline">Politique de Confidentialité</a> de Mon Paré.
                  </label>
              </div>

              <button type="submit" disabled={isLoadingInternal} className="w-full bg-secondary text-primaryDark font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-yellow-400 transition-all mt-4">
                  {isLoadingInternal ? <Loader2 className="animate-spin mx-auto"/> : "S'inscrire"}
              </button>
           </form>
        )}

        {/* --- VIEW: OTP --- */}
        {view === 'OTP' && (
            <form onSubmit={handleOtpSubmit} className="animate-in zoom-in-95 duration-300">
                {renderBackBtn(regData.email ? 'REGISTER' : 'FORGOT_PASSWORD')}
                
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <ShieldCheck size={32} className="text-white"/>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Vérification</h2>
                    <p className="text-white/70 text-sm mt-2 max-w-xs mx-auto">
                        Entrez le code à 6 chiffres envoyé à <br/><span className="text-white font-bold">{email}</span>
                    </p>
                </div>

                <div className="flex justify-between gap-2 mb-8">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={(el) => { otpRefs.current[idx] = el }}
                            type="text"
                            maxLength={1}
                            className="w-12 h-14 rounded-xl border-none bg-white text-center text-2xl font-bold text-primary shadow-lg focus:ring-4 focus:ring-secondary/50 outline-none"
                            value={digit}
                            onChange={e => handleOtpChange(idx, e.target.value)}
                            onKeyDown={e => handleOtpKeyDown(idx, e)}
                        />
                    ))}
                </div>

                <button type="submit" disabled={isLoadingInternal} className="w-full bg-secondary text-primaryDark font-bold text-lg py-4 rounded-2xl shadow-xl hover:bg-[#ffc800] transition-all">
                   {isLoadingInternal ? <Loader2 className="animate-spin mx-auto"/> : "Vérifier"}
                </button>
                
                <div className="text-center mt-6">
                    <button type="button" className="text-white/60 text-sm hover:text-white font-medium">Renvoyer le code (30s)</button>
                </div>
            </form>
        )}

        {/* --- VIEW: FORGOT PASSWORD --- */}
        {view === 'FORGOT_PASSWORD' && (
            <form onSubmit={handleForgotPasswordRequest} className="animate-in fade-in slide-in-from-right-8 duration-300">
                {renderBackBtn('LOGIN_PASSWORD')}
                
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-4">
                        <KeyRound size={32} className="text-secondary -rotate-3"/>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Réinitialisation</h2>
                    <p className="text-white/70 text-sm mt-2">Nous vous enverrons un code pour sécuriser votre compte.</p>
                </div>

                <div className="relative group mb-6">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"><Mail size={20} /></div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Votre email"
                      className="w-full pl-11 pr-4 py-4 rounded-2xl border-0 bg-white text-gray-900 shadow-lg focus:ring-4 focus:ring-secondary/50 outline-none"
                    />
                </div>

                <button type="submit" disabled={isLoadingInternal} className="w-full bg-secondary text-primaryDark font-bold text-lg py-4 rounded-2xl shadow-xl hover:bg-[#ffc800] transition-all">
                    {isLoadingInternal ? <Loader2 className="animate-spin mx-auto"/> : "Envoyer le code"}
                </button>
            </form>
        )}

        {/* --- VIEW: RESET PASSWORD --- */}
        {view === 'RESET_PASSWORD' && (
            <form onSubmit={handleResetPassword} className="animate-in fade-in slide-in-from-right-8 duration-300">
                
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Nouveau Mot de Passe</h2>
                    <p className="text-white/70 text-sm mt-2">Choisissez un mot de passe fort.</p>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"><Lock size={20} /></div>
                        <input 
                          type="password" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Nouveau mot de passe"
                          className="w-full pl-11 pr-4 py-4 rounded-2xl border-0 bg-white text-gray-900 shadow-lg focus:ring-4 focus:ring-secondary/50 outline-none"
                        />
                    </div>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"><ShieldCheck size={20} /></div>
                        <input 
                          type="password" 
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="Confirmer le mot de passe"
                          className="w-full pl-11 pr-4 py-4 rounded-2xl border-0 bg-white text-gray-900 shadow-lg focus:ring-4 focus:ring-secondary/50 outline-none"
                        />
                    </div>
                </div>

                <button type="submit" disabled={isLoadingInternal} className="w-full bg-secondary text-primaryDark font-bold text-lg py-4 rounded-2xl shadow-xl hover:bg-[#ffc800] transition-all">
                    {isLoadingInternal ? <Loader2 className="animate-spin mx-auto"/> : "Confirmer"}
                </button>
            </form>
        )}

        {/* Global Error Toast */}
        {error && (
            <div className="absolute -bottom-20 left-0 w-full bg-red-500 text-white text-sm font-medium p-4 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5">
                <AlertCircle size={20} className="shrink-0" />
                {error}
                <button type="button" onClick={() => setError(null)} className="ml-auto"><X size={16} className="lucide lucide-x" /></button>
            </div>
        )}

      </div>
      
      {/* Footer (Terms) */}
      <div className="mt-auto pt-8 pb-4 text-center">
        <p className="text-[10px] text-white/40">© 2025 Mon Paré. Tous droits réservés.</p>
      </div>

    </div>
  );
};

// Helper for X icon since it wasn't imported initially in the error toast block above
function X({ size, className }: { size?: number, className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
}

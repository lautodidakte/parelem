
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  ArrowLeft,
  Bell,
  Lock,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { IdentityVerificationModal } from './IdentityVerificationModal';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isKycOpen, setIsKycOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pb-32 animate-in fade-in duration-300">
      <div className="bg-primary pt-8 pb-20 px-6 -mx-4 -mt-8 rounded-b-[2.5rem] shadow-lg relative">
        <div className="flex items-center justify-between text-white mb-8">
          <button 
            onClick={() => navigate('/member')} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Mon Compte</h1>
          <div className="w-10"></div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-4 border-white bg-white/20 shadow-xl"
            />
            <button className="absolute bottom-0 right-0 bg-secondary text-primary p-2 rounded-full border-2 border-primary shadow-lg">
              <Settings size={16} />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-white mt-4">{user.displayName}</h2>
          <p className="text-white/70 text-sm">{user.email}</p>
          
          <div className={`mt-3 flex items-center gap-2 px-4 py-1.5 rounded-full border-2 text-[11px] font-bold uppercase tracking-wider ${
            user.isVerified ? 'bg-secondary text-primary border-white' : 'bg-white/10 text-white/80 border-white/20'
          }`}>
            {user.isVerified ? <ShieldCheck size={14}/> : <ShieldAlert size={14}/>}
            {user.isVerified ? 'Profil Vérifié (Niveau B)' : 'Profil Standard (Niveau A)'}
          </div>
        </div>
      </div>

      <div className="px-2 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          {!user.isVerified && (
            <div className="p-6 bg-yellow-50 border-b border-yellow-100 flex items-center justify-between">
                <div className="flex gap-3">
                    <ShieldCheck size={24} className="text-secondary" />
                    <div>
                        <h4 className="font-bold text-primary text-sm">Vérifiez votre identité</h4>
                        <p className="text-[10px] text-gray-500 font-medium">Augmentez vos limites jusqu'à 5M FCFA</p>
                    </div>
                </div>
                <button 
                  onClick={() => setIsKycOpen(true)}
                  className="bg-primary text-white text-[10px] font-bold px-4 py-2 rounded-xl shadow-md"
                >
                  VÉRIFIER
                </button>
            </div>
          )}

          <div className="p-4 border-b border-gray-50">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Paramètres</h3>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <User size={20} />
                </div>
                <span className="font-semibold text-gray-700">Informations personnelles</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
            </button>

            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <span className="font-semibold text-gray-700">Notifications</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
            </button>

            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <span className="font-semibold text-gray-700">Sécurité & PIN</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
            </button>
          </div>

          <div className="p-6">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all active:scale-[0.98]"
            >
              <LogOut size={20} />
              Déconnexion
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-6 font-medium">
              Version 1.0.4 • Parelem Tontine & Impact
            </p>
          </div>
        </div>
      </div>
      <IdentityVerificationModal isOpen={isKycOpen} onClose={() => setIsKycOpen(false)} />
    </div>
  );
};

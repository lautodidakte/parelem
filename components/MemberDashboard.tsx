import React, { useEffect } from 'react';
import { MOCK_ORG, CURRENT_USER_MEMBER } from '../constants';
import { ChevronRight, Plus, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = CURRENT_USER_MEMBER;
  const org = MOCK_ORG;

  useEffect(() => {
    // Apply Teal background for the Member Dashboard immersive experience
    const mainElement = document.querySelector('main');
    const originalMainBg = mainElement ? mainElement.style.backgroundColor : '';
    const originalBodyBg = document.body.style.backgroundColor;

    // Use the new Teal color #328080
    document.body.style.backgroundColor = '#328080';
    if (mainElement) {
        mainElement.style.backgroundColor = '#328080';
    }

    return () => {
        // Cleanup styles on unmount
        document.body.style.backgroundColor = originalBodyBg;
        if (mainElement) {
            mainElement.style.backgroundColor = originalMainBg;
        }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start pt-2">
        <div>
           <p className="text-white/60 font-light text-lg">Bonjour,</p>
           <h1 className="text-2xl font-bold text-white">
             {user.displayName.split(' ')[0]}
           </h1>
        </div>
        <div className="flex flex-col items-end">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`} 
              alt="Profile" 
              className="w-12 h-12 rounded-full border-2 border-white bg-white/20"
            />
            <button className="text-xs text-white/80 mt-1 font-medium hover:underline">Voir mon profil</button>
        </div>
      </div>

      {/* Tontines Section (Bubbles) */}
      <div className="mt-8">
         <div className="flex justify-between items-center text-white mb-4">
            <h2 className="font-semibold text-lg">Mes tontines(1)</h2>
         </div>
         
         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {/* Active Tontine Bubble */}
            <div onClick={() => navigate('/member/tontine')} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className="w-20 h-20 rounded-full bg-primaryDark flex items-center justify-center border-4 border-[#FFD700] relative shadow-lg group-hover:scale-105 transition-transform">
                    <span className="text-white font-bold text-sm">Amis</span>
                    <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-primaryDark"></div>
                </div>
            </div>

            {/* Add Placeholders */}
            <div className="flex flex-col items-center gap-2 opacity-50">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border-4 border-dashed border-white/20">
                    <Plus className="text-white" size={24} />
                </div>
            </div>
         </div>
         
         <button className="text-white/60 text-sm w-full text-center mt-4 flex items-center justify-center gap-1 hover:text-white transition-colors">
            + Importer une tontine
         </button>
      </div>

      {/* White Bottom Sheet Content ("Aperçu") */}
      <div className="bg-[#F8FAFC] rounded-t-[2rem] min-h-screen mt-8 pt-8 px-6 pb-32 -mx-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-10">
         {/* Aperçu Header */}
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 font-heading">Aperçu</h2>
            <span className="text-gray-400 text-sm">03 déc. 2024</span>
         </div>

         {/* Orange Contribution Card */}
         <div className="bg-secondary rounded-3xl p-6 text-primary relative shadow-lg shadow-yellow-200 mb-6 transition-transform hover:scale-[1.01] cursor-pointer" onClick={() => navigate('/member/tontine')}>
             <div className="flex justify-between items-start">
                 <h3 className="font-bold text-lg max-w-[70%] leading-tight">Verser ma prochaine cotisation</h3>
                 <div className="bg-primary/10 p-2 rounded-full">
                     <ChevronRight className="text-primary" />
                 </div>
             </div>
             
             {/* Coins decoration */}
             <div className="absolute top-4 right-16 opacity-10 pointer-events-none">
                <div className="w-12 h-12 rounded-full border-4 border-primary"></div>
                <div className="w-12 h-12 rounded-full border-4 border-primary -mt-8 ml-4"></div>
             </div>

             <div className="mt-8 flex justify-between items-end">
                 <p className="text-xs text-primary/80 max-w-[70%] leading-relaxed font-medium">
                     Actuellement, il n'y a aucune contribution en retard.
                 </p>
                 <button className="text-xs font-bold underline decoration-primary/50 underline-offset-4">
                     Voir les détails
                 </button>
             </div>
         </div>

         {/* Black Wallet Card */}
         <div onClick={() => navigate('/member/wallet')} className="bg-darkCard rounded-3xl p-6 text-white shadow-xl cursor-pointer hover:scale-[1.02] transition-transform">
             <div className="flex justify-between items-start mb-6">
                 <h3 className="font-bold text-lg">Mon Wallet</h3>
                 <Building2 className="text-gray-500" size={32} />
             </div>
             
             <div className="flex justify-between items-end">
                 <h2 className="text-4xl font-bold">84 500 <span className="text-lg font-normal text-gray-400">FCFA</span></h2>
                 <div className="flex items-center gap-2 text-xs text-gray-400">
                     Voir les détails <ChevronRight size={14} />
                 </div>
             </div>
         </div>
      </div>

    </div>
  );
};
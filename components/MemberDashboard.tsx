
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTontines } from '../contexts/TontinesContext';
import { ChevronRight, Plus, Building2, CheckCircle2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreateTontineDialog } from './CreateTontineDialog';

export const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tontines, addTontine } = useTontines();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const activeTontinesCount = tontines?.length || 0;

  useEffect(() => {
    const mainElement = document.querySelector('main');
    const originalMainBg = mainElement ? mainElement.style.backgroundColor : '';
    const originalBodyBg = document.body.style.backgroundColor;

    document.body.style.backgroundColor = '#328080';
    if (mainElement) {
        mainElement.style.backgroundColor = '#328080';
    }

    return () => {
        document.body.style.backgroundColor = originalBodyBg;
        if (mainElement) {
            mainElement.style.backgroundColor = originalMainBg;
        }
    };
  }, []);

  const handleImport = () => {
    alert("Fonctionnalité d'importation par code d'invitation bientôt disponible ! En attendant, vous pouvez créer votre propre tontine.");
    setIsCreateOpen(true);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
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
            <button 
              onClick={() => navigate('/member/profile')}
              className="text-xs text-white/80 mt-1 font-medium hover:underline"
            >
              Voir mon profil
            </button>
        </div>
      </div>

      <div className="mt-8">
         <div className="flex justify-between items-center text-white mb-4">
            <h2 className="font-semibold text-lg">Mes tontines ({activeTontinesCount})</h2>
         </div>
         
         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {activeTontinesCount > 0 ? (
                tontines.map((tontine) => (
                  <div key={tontine.id} onClick={() => navigate(`/member/tontine/${tontine.id}`)} className="flex flex-col items-center gap-2 cursor-pointer group shrink-0">
                      <div className="w-20 h-20 rounded-full bg-primaryDark flex items-center justify-center border-4 border-[#FFD700] relative shadow-lg group-hover:scale-105 transition-transform">
                          <span className="text-white font-bold text-[10px] text-center px-2 truncate w-full">{tontine.name.split(' ')[0]}</span>
                          {tontine.members.some(m => m.status === 'LATE') && (
                              <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full border-2 border-primaryDark flex items-center justify-center text-[10px] text-white font-bold">!</div>
                          )}
                      </div>
                  </div>
                ))
            ) : (
                <div className="text-white/60 text-sm italic p-2">Aucune tontine active</div>
            )}

            <div 
              onClick={() => setIsCreateOpen(true)}
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
            >
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border-4 border-dashed border-white/20 group-hover:bg-white/20 transition-all">
                    <Plus className="text-white" size={24} />
                </div>
                <span className="text-white/40 text-[10px] font-bold">Ajouter</span>
            </div>
         </div>
         
         <button 
           onClick={handleImport}
           className="text-white/60 text-sm w-full text-center mt-4 flex items-center justify-center gap-2 hover:text-white transition-colors"
         >
            <Download size={14} /> Importer une tontine
         </button>
      </div>

      <div className="bg-[#F8FAFC] rounded-t-[2.5rem] min-h-screen mt-8 pt-10 px-6 pb-32 -mx-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-10">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 font-heading">Aperçu</h2>
            <span className="text-gray-400 text-sm">Aujourd'hui</span>
         </div>

         {activeTontinesCount > 0 ? (
            tontines.map((t, idx) => (
               <div key={t.id} className={`${idx > 0 ? 'mt-4' : ''} bg-secondary rounded-3xl p-6 text-primary relative shadow-lg shadow-yellow-200/50 mb-6 transition-transform hover:scale-[1.01] cursor-pointer`} onClick={() => navigate(`/member/tontine/${t.id}`)}>
                   <div className="flex justify-between items-start">
                       <h3 className="font-bold text-lg max-w-[80%] leading-tight">
                           {t.name} : Verser ma cotisation
                       </h3>
                       <div className="bg-primary/10 p-2 rounded-full">
                           <ChevronRight className="text-primary" />
                       </div>
                   </div>
                   <div className="mt-8 flex justify-between items-end">
                       <p className="text-xs text-primary/80 font-medium flex items-center gap-2">
                           <span className="flex items-center gap-1">
                               <CheckCircle2 size={12} /> Prêt pour le versement
                           </span>
                       </p>
                   </div>
               </div>
            ))
         ) : (
            <div className="bg-white p-8 rounded-3xl border border-dashed border-gray-200 text-center mb-6">
                <p className="text-gray-400 text-sm mb-4">Vous n'avez pas encore de tontine active.</p>
                <button 
                  onClick={() => setIsCreateOpen(true)}
                  className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20"
                >
                  Créer ma première tontine
                </button>
            </div>
         )}

         <div onClick={() => navigate('/member/wallet')} className="bg-darkCard rounded-3xl p-7 text-white shadow-xl cursor-pointer hover:scale-[1.02] transition-transform">
             <div className="flex justify-between items-start mb-6">
                 <h3 className="font-bold text-lg">Mon Wallet</h3>
                 <Building2 className="text-gray-500" size={32} />
             </div>
             <div className="flex justify-between items-end">
                 <h2 className="text-4xl font-bold">
                    84 500 <span className="text-lg font-normal text-gray-400">FCFA</span>
                 </h2>
                 <div className="flex items-center gap-2 text-xs text-gray-400">
                     Détails <ChevronRight size={14} />
                 </div>
             </div>
         </div>
      </div>

      <CreateTontineDialog 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onTontineCreated={addTontine}
      />
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { MOCK_ORG, MOCK_POSTS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { useTontines } from '../contexts/TontinesContext';
import { ArrowLeft, Users, Wallet, Clock, MessageSquare, Plus, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { TransactionDialog } from './TransactionDialog';
import { Organization } from '../types';

export const TontineManager: React.FC = () => {
  const navigate = useNavigate();
  const { tontineId } = useParams<{ tontineId: string }>();
  const { getTontine, updateTontine } = useTontines();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FINANCE' | 'FORUM'>('OVERVIEW');
  const [isTxOpen, setIsTxOpen] = useState(false);
  const [txType, setTxType] = useState<'CONTRIBUTION' | 'EXPENSE'>('CONTRIBUTION');

  const currentOrg = getTontine(tontineId || '') || MOCK_ORG;
  const [localOrg, setLocalOrg] = useState<Organization>(currentOrg);

  useEffect(() => {
    const orgFromContext = getTontine(tontineId || '');
    if (orgFromContext) {
      setLocalOrg(orgFromContext);
    }
  }, [tontineId, getTontine]);

  const isAdmin = user?.managedOrgIds.includes(localOrg.id) || localOrg.members.find(m => m.userId === user?.uid)?.role === 'ADMIN';

  const handleValidateBP = (loanId: string) => {
    if (!isAdmin) return;
    if (window.confirm("Confirmer la validation du Business Plan ? Cela autorisera le décaissement.")) {
        const updatedLoans = localOrg.loanRequests.map(lr => 
            lr.id === loanId ? { ...lr, status: 'VALIDATED' as const } : lr
        );
        const updatedOrg = { ...localOrg, loanRequests: updatedLoans };
        setLocalOrg(updatedOrg);
        updateTontine(updatedOrg);
    }
  };

  const handleTransaction = (data: any) => {
    const updatedOrg = {
        ...localOrg,
        balance: data.type === 'INCOME' || data.type === 'CONTRIBUTION' ? localOrg.balance + data.amount : localOrg.balance - data.amount,
        transactions: [
            { id: `t${Date.now()}`, ...data },
            ...localOrg.transactions
        ]
    };
    setLocalOrg(updatedOrg);
    updateTontine(updatedOrg);
    alert(`Transaction de ${data.amount} FCFA enregistrée avec succès.`);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
       <div className="bg-primary p-6 pb-28 rounded-b-[2.5rem] relative z-0 shadow-lg">
           <div className="flex justify-between items-center text-white mb-6">
               <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium hover:bg-white/10 p-2 rounded-lg transition-colors">
                   <ArrowLeft size={20} /> Retour
               </button>
               {isAdmin && <span className="bg-secondary text-primary font-bold text-xs px-2 py-1 rounded">ADMIN</span>}
           </div>
           <div className="text-center text-white">
                <h1 className="text-2xl font-bold font-heading mb-1">{localOrg.name}</h1>
                <p className="text-white/80 text-sm">{localOrg.stats.totalMembers} Membres • {localOrg.location.city}</p>
           </div>
       </div>

       <div className="mx-6 -mt-12 relative z-10 bg-white rounded-2xl shadow-xl border border-gray-100 p-1.5 flex mb-8">
           {['OVERVIEW', 'FINANCE', 'FORUM'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === tab ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
               >
                 {tab === 'OVERVIEW' ? 'Aperçu' : tab === 'FINANCE' ? 'Finances' : 'Forum'}
               </button>
           ))}
       </div>

       <div className="px-6 space-y-8">
           {activeTab === 'OVERVIEW' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                   <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock size={18}/> Cycle en cours</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Mensualité</span>
                                <span className="font-bold text-gray-900 text-lg">{new Intl.NumberFormat('fr-TD').format(localOrg.cycles[0]?.amountPerMember || 0)} FCFA</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-secondary h-2 rounded-full w-[65%]"></div>
                            </div>
                            <p className="text-xs text-center text-gray-500">65% des cotisations reçues ce mois</p>
                        </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                       <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100 text-center">
                           <div className="w-10 h-10 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-2"><Users size={20}/></div>
                           <p className="text-2xl font-bold text-blue-900">{localOrg.stats.totalMembers}</p>
                           <p className="text-xs text-blue-700 font-medium">Membres Actifs</p>
                       </div>
                       <div className="bg-green-50 p-4 rounded-3xl border border-green-100 text-center">
                           <div className="w-10 h-10 bg-green-200 text-green-800 rounded-full flex items-center justify-center mx-auto mb-2"><Wallet size={20}/></div>
                           <p className="text-2xl font-bold text-green-900">{localOrg.loanRequests.length}</p>
                           <p className="text-xs text-green-700 font-medium">Prêts en cours</p>
                       </div>
                   </div>
               </div>
           )}

           {activeTab === 'FINANCE' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                   <div className="bg-darkCard p-6 rounded-3xl text-white relative overflow-hidden shadow-lg">
                       <div className="relative z-10">
                           <p className="text-gray-400 text-sm font-medium">Solde de la Tontine</p>
                           <h2 className="text-4xl font-bold mt-1 mb-6">{new Intl.NumberFormat('fr-TD').format(localOrg.balance)} FCFA</h2>
                           
                           <div className="flex gap-3">
                               <button 
                                 onClick={() => { setTxType('CONTRIBUTION'); setIsTxOpen(true); }}
                                 className="flex-1 bg-secondary text-primary font-bold py-3 rounded-xl text-sm hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                               >
                                   <Plus size={16} /> Cotiser
                               </button>
                               {isAdmin && (
                                   <button 
                                     onClick={() => { setTxType('EXPENSE'); setIsTxOpen(true); }}
                                     className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl text-sm hover:bg-white/20 transition-colors"
                                   >
                                       Dépense
                                   </button>
                               )}
                           </div>
                       </div>
                   </div>

                   <div>
                       <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                           <FileText size={20} className="text-primary"/> Demandes de Prêt & Business Plans
                       </h3>
                       <div className="space-y-4">
                           {localOrg.loanRequests.length === 0 ? (
                               <p className="text-sm text-gray-500 italic">Aucune demande en cours.</p>
                           ) : (
                               localOrg.loanRequests.map((req) => (
                                   <div key={req.id} className="bg-white border border-gray-100 shadow-sm p-5 rounded-3xl">
                                       <div className="flex justify-between items-start mb-3">
                                           <div>
                                               <p className="font-bold text-gray-900">{req.memberName}</p>
                                               <p className="text-primary font-bold text-lg">{new Intl.NumberFormat('fr-TD').format(req.amount)} FCFA</p>
                                           </div>
                                           {req.status === 'VALIDATED' ? (
                                               <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                   <CheckCircle2 size={12}/> Validé
                                               </span>
                                           ) : (
                                               <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                   <Clock size={12}/> En attente
                                               </span>
                                           )}
                                       </div>
                                       
                                       <div className="bg-gray-50 p-3 rounded-xl mb-4">
                                           <p className="text-xs text-gray-500 font-bold mb-1 uppercase">Business Plan</p>
                                           <p className="text-sm text-gray-700 leading-snug">{req.businessPlanSummary}</p>
                                       </div>

                                       {isAdmin && req.status === 'PENDING' && (
                                           <div className="flex gap-2 border-t border-gray-50 pt-3">
                                               <button onClick={() => handleValidateBP(req.id)} className="flex-1 bg-primary text-white text-xs font-bold py-2 rounded-lg hover:bg-primaryDark transition-colors">Valider BP</button>
                                           </div>
                                       )}
                                   </div>
                               ))
                           )}
                       </div>
                   </div>

                   <div>
                       <h3 className="font-bold text-gray-900 mb-4">Historique</h3>
                       <div className="space-y-3">
                           {localOrg.transactions.map((tx) => (
                               <div key={tx.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                                   <div className="flex items-center gap-3">
                                       <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type.includes('INCOME') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                           <Plus size={14}/>
                                       </div>
                                       <div>
                                           <p className="font-bold text-sm text-gray-900">{tx.category}</p>
                                           <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                                       </div>
                                   </div>
                                   <span className={`font-bold text-sm ${tx.type.includes('INCOME') ? 'text-gray-900' : 'text-red-500'}`}>
                                       {tx.type === 'EXPENSE' ? '-' : '+'}{new Intl.NumberFormat('fr-TD').format(tx.amount)}
                                   </span>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
           )}

           {activeTab === 'FORUM' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                   <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 items-start">
                       <MessageSquare className="text-blue-600 shrink-0 mt-1" size={20} />
                       <div>
                           <h4 className="font-bold text-blue-900 text-sm">Forum Membres</h4>
                           <p className="text-xs text-blue-700 mt-1">Discutez avec les membres de votre groupe.</p>
                       </div>
                   </div>

                   <div className="space-y-4">
                       {MOCK_POSTS.filter(p => !p.orgId || p.orgId === localOrg.id).map((post) => (
                           <div key={post.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                               <div className="flex items-center gap-3 mb-3">
                                   <img src={post.authorAvatar} className="w-8 h-8 rounded-full bg-gray-200" alt=""/>
                                   <div>
                                       <p className="font-bold text-sm text-gray-900">{post.authorName}</p>
                                       <p className="text-[10px] text-gray-400">{new Date(post.timestamp).toLocaleDateString()}</p>
                                   </div>
                               </div>
                               <p className="text-gray-700 text-sm">{post.content}</p>
                           </div>
                       ))}
                   </div>
               </div>
           )}
       </div>

       <TransactionDialog 
         isOpen={isTxOpen} 
         onClose={() => setIsTxOpen(false)} 
         org={localOrg} 
         isAdmin={isAdmin || false}
         prefillType={txType}
         onTransaction={handleTransaction}
       />
    </div>
  );
};

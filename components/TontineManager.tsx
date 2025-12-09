
import React, { useState } from 'react';
import { MOCK_ORG, MOCK_POSTS, MOCK_LOAN_REQUESTS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Users, Wallet, Clock, Check, X, MessageSquare, PieChart, Plus, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TransactionDialog } from './TransactionDialog';

export const TontineManager: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FINANCE' | 'FORUM'>('OVERVIEW');
  const [org, setOrg] = useState(MOCK_ORG);
  const [isTxOpen, setIsTxOpen] = useState(false);
  const [txType, setTxType] = useState<'CONTRIBUTION' | 'EXPENSE'>('CONTRIBUTION');

  const isAdmin = user?.managedOrgIds.includes(org.id);

  const handleValidateBP = (loanId: string) => {
    if (!isAdmin) return;
    if (window.confirm("Confirmer la validation du Business Plan ? Cela autorisera le décaissement.")) {
        const updatedLoans = org.loanRequests.map(lr => 
            lr.id === loanId ? { ...lr, status: 'VALIDATED' as const } : lr
        );
        setOrg({ ...org, loanRequests: updatedLoans });
    }
  };

  const handleTransaction = (data: any) => {
    // In real app: Server Action
    console.log("Transaction created:", data);
    alert(`Transaction de ${data.amount} FCFA enregistrée avec succès.`);
    setOrg(prev => ({
        ...prev,
        balance: data.type === 'INCOME' || data.type === 'CONTRIBUTION' ? prev.balance + data.amount : prev.balance - data.amount,
        transactions: [
            { id: `t${Date.now()}`, ...data },
            ...prev.transactions
        ]
    }));
  };

  return (
    <div className="bg-white min-h-screen pb-20">
       {/* Header */}
       <div className="bg-primary p-6 pb-28 rounded-b-[2.5rem] relative z-0 shadow-lg">
           <div className="flex justify-between items-center text-white mb-6">
               <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium hover:bg-white/10 p-2 rounded-lg transition-colors">
                   <ArrowLeft size={20} /> Retour
               </button>
               {isAdmin && <span className="bg-secondary text-primary font-bold text-xs px-2 py-1 rounded">ADMIN</span>}
           </div>
           <div className="text-center text-white">
                <h1 className="text-2xl font-bold font-heading mb-1">{org.name}</h1>
                <p className="text-white/80 text-sm">{org.stats.totalMembers} Membres • {org.location.city}</p>
           </div>
       </div>

       {/* Tabs Navigation */}
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
           
           {/* --- OVERVIEW TAB --- */}
           {activeTab === 'OVERVIEW' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                   <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock size={18}/> Cycle en cours</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Mensualité</span>
                                <span className="font-bold text-gray-900 text-lg">{new Intl.NumberFormat('fr-TD').format(org.cycles[0].amountPerMember)} FCFA</span>
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
                           <p className="text-2xl font-bold text-blue-900">{org.stats.totalMembers}</p>
                           <p className="text-xs text-blue-700 font-medium">Membres Actifs</p>
                       </div>
                       <div className="bg-green-50 p-4 rounded-3xl border border-green-100 text-center">
                           <div className="w-10 h-10 bg-green-200 text-green-800 rounded-full flex items-center justify-center mx-auto mb-2"><Wallet size={20}/></div>
                           <p className="text-2xl font-bold text-green-900">3</p>
                           <p className="text-xs text-green-700 font-medium">Prêts en cours</p>
                       </div>
                   </div>
               </div>
           )}

           {/* --- FINANCE TAB --- */}
           {activeTab === 'FINANCE' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                   {/* Balance Card */}
                   <div className="bg-darkCard p-6 rounded-3xl text-white relative overflow-hidden shadow-lg">
                       <div className="relative z-10">
                           <p className="text-gray-400 text-sm font-medium">Solde de la Tontine</p>
                           <h2 className="text-4xl font-bold mt-1 mb-6">{new Intl.NumberFormat('fr-TD').format(org.balance)} FCFA</h2>
                           
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

                   {/* LOAN REQUESTS / BUSINESS PLANS */}
                   <div>
                       <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                           <FileText size={20} className="text-primary"/> Demandes de Prêt & Business Plans
                       </h3>
                       <div className="space-y-4">
                           {org.loanRequests.length === 0 ? (
                               <p className="text-sm text-gray-500 italic">Aucune demande en cours.</p>
                           ) : (
                               org.loanRequests.map((req) => (
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
                                           ) : req.status === 'REJECTED' ? (
                                               <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full">Rejeté</span>
                                           ) : (
                                               <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                   <Clock size={12}/> En attente
                                               </span>
                                           )}
                                       </div>
                                       
                                       <div className="bg-gray-50 p-3 rounded-xl mb-4">
                                           <p className="text-xs text-gray-500 font-bold mb-1 uppercase">Business Plan</p>
                                           <p className="text-sm text-gray-700 leading-snug">{req.businessPlanSummary}</p>
                                           <div className="flex items-center gap-2 mt-2">
                                               <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">
                                                   Impact: {req.jobsPromise} emplois
                                               </span>
                                           </div>
                                       </div>

                                       {/* ADMIN ACTIONS */}
                                       {isAdmin && req.status === 'PENDING' && (
                                           <div className="flex gap-2 border-t border-gray-50 pt-3">
                                               <button 
                                                 onClick={() => handleValidateBP(req.id)}
                                                 className="flex-1 bg-primary text-white text-xs font-bold py-2 rounded-lg hover:bg-primaryDark transition-colors"
                                               >
                                                   Valider BP
                                               </button>
                                               <button className="flex-1 bg-red-50 text-red-600 text-xs font-bold py-2 rounded-lg hover:bg-red-100 transition-colors">
                                                   Rejeter
                                               </button>
                                           </div>
                                       )}
                                       {isAdmin && req.status === 'VALIDATED' && (
                                           <button 
                                             onClick={() => { setTxType('EXPENSE'); setIsTxOpen(true); }} // In real app, pass loan data to prefill
                                             className="w-full bg-secondary text-primary text-xs font-bold py-2 rounded-lg hover:bg-yellow-400 transition-colors mt-2"
                                           >
                                               Décaisser le Prêt
                                           </button>
                                       )}
                                   </div>
                               ))
                           )}
                       </div>
                   </div>

                   {/* Transactions List */}
                   <div>
                       <h3 className="font-bold text-gray-900 mb-4">Historique</h3>
                       <div className="space-y-3">
                           {org.transactions.map((tx) => (
                               <div key={tx.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                                   <div className="flex items-center gap-3">
                                       <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type.includes('INCOME') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                           {tx.type.includes('INCOME') ? <ArrowLeft className="rotate-45" size={14}/> : <ArrowLeft className="-rotate-135" size={14}/>}
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

           {/* --- FORUM TAB --- */}
           {activeTab === 'FORUM' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                   <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 items-start">
                       <MessageSquare className="text-blue-600 shrink-0 mt-1" size={20} />
                       <div>
                           <h4 className="font-bold text-blue-900 text-sm">Forum Membres</h4>
                           <p className="text-xs text-blue-700 mt-1">Espace dédié aux discussions sur les projets et la gestion du groupe.</p>
                       </div>
                   </div>

                   {/* Chat Input */}
                   <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex gap-2">
                       <input 
                         type="text" 
                         placeholder="Écrivez un message..." 
                         className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
                       />
                       <button className="bg-primary text-white p-2 rounded-xl">
                           <ArrowLeft className="rotate-180" size={20} />
                       </button>
                   </div>

                   {/* Posts */}
                   <div className="space-y-4">
                       {MOCK_POSTS.filter(p => !p.orgId || p.orgId === org.id).map((post) => (
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

       {/* Transaction Dialog */}
       <TransactionDialog 
         isOpen={isTxOpen} 
         onClose={() => setIsTxOpen(false)} 
         org={org} 
         isAdmin={isAdmin || false}
         prefillType={txType}
         onTransaction={handleTransaction}
       />
    </div>
  );
};

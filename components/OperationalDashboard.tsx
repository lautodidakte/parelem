
import React, { useState } from 'react';
import { MOCK_ORG, MOCK_POSTS } from '../constants';
import { Plus, ArrowUpRight, ArrowDownRight, RefreshCw, AlertTriangle, Bot, MessageCircle, Heart, Share2, Layers, Wallet, Globe } from 'lucide-react';
import { CreateTontineDialog } from './CreateTontineDialog';

export const OperationalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MY_SPACE' | 'FEED'>('MY_SPACE');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [org] = useState(MOCK_ORG);

  // Stats Calculations
  const income = org.transactions.filter(t => t.type === 'INCOME' || t.type === 'CONTRIBUTION').reduce((acc, t) => acc + t.amount, 0);
  const expense = org.transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      
      {/* Header & Tabs */}
      <div className="flex flex-col gap-6">
         <div className="flex justify-between items-center">
             <div>
                <h1 className="text-2xl font-bold text-gray-900 font-heading">Tableau de Bord</h1>
                <p className="text-gray-500 text-sm">Gérez vos activités et suivez la communauté.</p>
             </div>
             
             {/* CTA Principal : Création */}
             <button 
                onClick={() => setIsCreateOpen(true)}
                className="bg-secondary text-gray-900 px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 transform hover:-translate-y-1"
             >
                <Plus size={18} /> Créer Tontine
             </button>
         </div>

         {/* Custom Tabs Navigation */}
         <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
             <button
               onClick={() => setActiveTab('MY_SPACE')}
               className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                 activeTab === 'MY_SPACE' 
                   ? 'bg-primary text-white shadow-md' 
                   : 'text-gray-500 hover:bg-gray-50'
               }`}
             >
               <Layers size={18} /> Mon Espace
             </button>
             <button
               onClick={() => setActiveTab('FEED')}
               className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                 activeTab === 'FEED' 
                   ? 'bg-primary text-white shadow-md' 
                   : 'text-gray-500 hover:bg-gray-50'
               }`}
             >
               <Globe size={18} /> Fil d'Actualité
             </button>
         </div>
      </div>

      {/* --- TAB CONTENT: MON ESPACE --- */}
      {activeTab === 'MY_SPACE' && (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
            {/* Financial Card */}
            <div className="bg-[#0F172A] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/30 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-gray-400 text-sm font-medium mb-1">Solde Total (Toutes Tontines)</p>
                            <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
                                {new Intl.NumberFormat('fr-TD').format(org.balance)} <span className="text-2xl text-gray-500 font-normal">FCFA</span>
                            </h2>
                        </div>
                        <button className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors text-green-400">
                            <RefreshCw size={20} />
                        </button>
                    </div>
                    <div className="flex gap-8 md:gap-12 border-t border-white/10 pt-6">
                        <div>
                            <p className="text-gray-400 text-xs font-medium mb-1">Entrées</p>
                            <p className="text-green-400 font-bold text-lg">+{new Intl.NumberFormat('fr-TD').format(income)}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-medium mb-1">Sorties</p>
                            <p className="text-red-400 font-bold text-lg">-{new Intl.NumberFormat('fr-TD').format(expense)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Tontines List */}
            <div>
               <h3 className="text-lg font-bold text-gray-800 font-heading mb-4">Mes Tontines Actives</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-primary/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 font-bold text-xl">
                              C
                          </div>
                          <div>
                              <h4 className="font-bold text-gray-900">Cercle des Entrepreneurs</h4>
                              <p className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md inline-block mt-1">Admin</p>
                          </div>
                      </div>
                      <ArrowUpRight className="text-gray-300" />
                  </div>
                  {/* Mock second group */}
                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 font-bold text-xl">
                              F
                          </div>
                          <div>
                              <h4 className="font-bold text-gray-900">Famille Yacoub</h4>
                              <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md inline-block mt-1">Membre</p>
                          </div>
                      </div>
                      <ArrowUpRight className="text-gray-300" />
                  </div>
               </div>
            </div>

             {/* Recent Transactions (Same as before) */}
             <div>
                <h3 className="text-lg font-bold text-gray-800 font-heading mb-4">Dernières Opérations</h3>
                <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100/50">
                    {org.transactions.map((tx) => (
                        <div key={tx.id} className="p-4 hover:bg-gray-50 rounded-2xl transition-colors border-b last:border-0 border-gray-50">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type.includes('INCOME') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {tx.type.includes('INCOME') ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{tx.category}</h4>
                                        <p className="text-xs text-gray-400 uppercase font-medium mt-0.5">{tx.memberName}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${tx.type.includes('INCOME') ? 'text-gray-900' : 'text-red-500'}`}>
                                        {tx.type === 'EXPENSE' ? '-' : '+'}{new Intl.NumberFormat('fr-TD').format(tx.amount)}
                                    </p>
                                    {tx.aiAnalysis?.isSuspicious && (
                                        <span className="flex items-center gap-1 text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded font-bold mt-1">
                                            <AlertTriangle size={10} /> Suspect
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* --- TAB CONTENT: FIL D'ACTUALITE --- */}
      {activeTab === 'FEED' && (
         <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             
             {/* New Post Input (Mock) */}
             <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex gap-4 items-center">
                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold">M</div>
                 <input 
                   type="text" 
                   placeholder="Partagez une nouvelle ou une question..." 
                   className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                 />
                 <button className="bg-primary text-white p-3 rounded-xl hover:bg-primaryDark transition-colors">
                     <MessageCircle size={18} />
                 </button>
             </div>

             {/* Feed List */}
             {MOCK_POSTS.map((post) => (
                 <div key={post.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                     <div className="flex justify-between items-start mb-3">
                         <div className="flex items-center gap-3">
                             <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full bg-gray-100" />
                             <div>
                                 <h4 className="font-bold text-gray-900 text-sm">{post.authorName}</h4>
                                 <p className="text-xs text-gray-400">
                                    {new Date(post.timestamp).toLocaleDateString()} • 
                                    {post.type === 'ANNOUNCEMENT' && <span className="text-secondary font-bold ml-1">Annonce</span>}
                                    {post.type === 'NEW_GROUP' && <span className="text-green-600 font-bold ml-1">Nouveau Groupe</span>}
                                 </p>
                             </div>
                         </div>
                     </div>
                     
                     <p className="text-gray-700 leading-relaxed text-sm mb-4">
                         {post.content}
                     </p>

                     {post.type === 'NEW_GROUP' && (
                         <div className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-4 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="bg-green-200 p-2 rounded-lg text-green-800"><Wallet size={20}/></div>
                                 <span className="font-bold text-green-800 text-sm">Investisseurs N'Djamena</span>
                             </div>
                             <button className="text-xs bg-white text-green-700 px-3 py-1.5 rounded-lg font-bold border border-green-200 hover:bg-green-50">
                                 Rejoindre
                             </button>
                         </div>
                     )}

                     <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                         <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-xs font-bold group">
                             <Heart size={16} className="group-hover:fill-red-500" /> {post.likes}
                         </button>
                         <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-xs font-bold">
                             <MessageCircle size={16} /> {post.comments}
                         </button>
                         <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-xs font-bold ml-auto">
                             <Share2 size={16} /> Partager
                         </button>
                     </div>
                 </div>
             ))}
         </div>
      )}

      {/* Modal Creation */}
      <CreateTontineDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};


import React, { useState } from 'react';
import { X, Users, Wallet, Calendar, AlertTriangle, ShieldCheck, Heart, Info, Dice5, ListOrdered, Users2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { IdentityVerificationModal } from './IdentityVerificationModal';
import { SelectionMethod, Organization } from '../types';

interface CreateTontineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTontineCreated?: (t: Organization) => void;
}

export const CreateTontineDialog: React.FC<CreateTontineDialogProps> = ({ isOpen, onClose, onTontineCreated }) => {
  const { user } = useAuth();
  
  // Form State
  const [name, setName] = useState('');
  const [tontineType, setTontineType] = useState<'ROTATIVE' | 'EPARGNE'>('ROTATIVE');
  const [amount, setAmount] = useState('');
  const [attribution, setAttribution] = useState<SelectionMethod>('ORDER');
  const [hasSolidarity, setHasSolidarity] = useState(false);
  const [solidarityPercent, setSolidarityPercent] = useState('10');
  
  const getDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  };
  const [startDate, setStartDate] = useState(getDefaultDate());

  const [isKycOpen, setIsKycOpen] = useState(false);

  if (!isOpen) return null;

  const currentAmount = parseFloat(amount) || 0;
  const LIMIT = 50000;
  const isOverLimit = currentAmount > LIMIT;
  const needsVerification = isOverLimit && !user?.isVerified;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (needsVerification) return;

    // Création de l'objet tontine
    const newTontine: Organization = {
        id: `org-${Date.now()}`,
        name: name || "Nouvelle Tontine",
        type: tontineType,
        visibility: 'PRIVATE',
        location: { region: 'Tchad', city: "N'Djamena" },
        currency: 'FCFA',
        balance: 0,
        stats: {
          totalMembers: 1,
          totalSaved: 0
        },
        members: [
          { 
            id: 'm-owner', 
            userId: user?.uid || '', 
            fullName: user?.displayName || 'Admin', 
            role: 'ADMIN', 
            phone: '', 
            status: 'UP_TO_DATE', 
            totalContributed: 0,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName}`
          }
        ],
        transactions: [],
        cycles: [
          {
            id: `c-${Date.now()}`,
            type: tontineType === 'ROTATIVE' ? 'ROTATING' : 'SAVINGS',
            status: 'ACTIVE',
            participants: ['m-owner'],
            method: attribution,
            amountPerMember: currentAmount,
            frequency: 'MONTHLY'
          }
        ],
        loanRequests: []
    };

    if (onTontineCreated) {
        onTontineCreated(newTontine);
    }
    
    alert(`Félicitations ! La tontine "${newTontine.name}" a été créée avec succès.`);
    onClose();
    
    // Reset form
    setName('');
    setAmount('');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

        <div className="bg-white rounded-3xl w-full max-w-lg relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="bg-primary p-6 relative shrink-0">
            <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-white font-heading">Créer une Tontine</h2>
            <p className="text-white/80 mt-1 text-sm">Configurez votre nouveau groupe d'épargne.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto no-scrollbar">
            {/* Nom */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Nom de la Tontine</label>
              <input 
                required 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Tontine Solidaire N'Djamena" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-medium focus:ring-2 focus:ring-primary/20 outline-none" 
              />
            </div>

            {/* Type & Fréquence */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Type</label>
                  <select 
                    value={tontineType}
                    onChange={(e) => setTontineType(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="ROTATIVE">Rotative</option>
                    <option value="EPARGNE">Épargne Simple</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Fréquence</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 outline-none">
                    <option value="MONTHLY">Mensuelle</option>
                    <option value="WEEKLY">Hebdomadaire</option>
                  </select>
               </div>
            </div>

            {/* Mode d'Attribution (Seulement si Rotative) */}
            {tontineType === 'ROTATIVE' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Mode d'attribution</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    type="button" 
                    onClick={() => setAttribution('ORDER')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${attribution === 'ORDER' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                  >
                    <ListOrdered size={20} />
                    <span className="text-[10px] font-bold">Ordre fixé</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAttribution('RANDOM')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${attribution === 'RANDOM' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                  >
                    <Dice5 size={20} />
                    <span className="text-[10px] font-bold">Hasard</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAttribution('VOTE')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${attribution === 'VOTE' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                  >
                    <Users2 size={20} />
                    <span className="text-[10px] font-bold">Vote</span>
                  </button>
                </div>
              </div>
            )}

            {/* Date de début */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Date de début de cycle</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-medium text-gray-700 focus:ring-2 focus:ring-primary/20 outline-none" 
                />
              </div>
            </div>

            {/* Montant */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Montant de la part (FCFA)</label>
              <input 
                required
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 10 000"
                className={`w-full px-4 py-3 rounded-xl border-2 font-medium text-lg transition-colors focus:ring-2 focus:ring-primary/20 outline-none ${needsVerification ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              />
              
              {isOverLimit && (
                <div className={`mt-3 p-3 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2 ${user?.isVerified ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                   {user?.isVerified ? (
                     <>
                        <ShieldCheck size={18} className="text-green-600 shrink-0" />
                        <p className="text-[11px] text-green-700 font-bold leading-tight">Compte Vérifié : Vous pouvez créer des tontines à montants élevés.</p>
                     </>
                   ) : (
                     <>
                        <AlertTriangle size={18} className="text-red-600 shrink-0" />
                        <div>
                           <p className="text-[11px] text-red-700 font-bold leading-tight">Vérification Requise</p>
                           <p className="text-[10px] text-red-600/70 mt-0.5">Le montant dépasse 50 000 FCFA. Veuillez valider votre identité.</p>
                        </div>
                     </>
                   )}
                </div>
              )}
            </div>

            {/* Double Caisse (Caisse de Solidarité) */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white rounded-lg text-primary shadow-sm"><Heart size={18}/></div>
                   <div>
                      <span className="block text-sm font-bold text-gray-800">Caisse Solidarité</span>
                      <span className="block text-[10px] text-gray-400 font-medium">Pour les urgences du groupe</span>
                   </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={hasSolidarity} 
                    onChange={e => setHasSolidarity(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {hasSolidarity && (
                <div className="animate-in fade-in slide-in-from-top-2 space-y-3 pt-2 border-t border-gray-100 mt-2">
                   <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">% pour Solidarité</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            value={solidarityPercent}
                            onChange={(e) => setSolidarityPercent(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white font-bold text-sm" 
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span>
                        </div>
                      </div>
                      <div className="flex-[1.5] bg-white p-2 rounded-lg border border-gray-100">
                         <p className="text-[10px] text-gray-500 font-medium italic">
                           💡 Prélèvement automatique sur chaque cotisation versée.
                         </p>
                      </div>
                   </div>
                </div>
              )}
            </div>

            {/* Submit logic */}
            {needsVerification ? (
              <button 
                type="button"
                onClick={() => setIsKycOpen(true)}
                className="w-full bg-secondary text-primary font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
              >
                <ShieldCheck size={20} /> Valider mon identité
              </button>
            ) : (
              <button 
                type="submit"
                className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-primaryDark transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
              >
                <Users size={20} /> Créer la tontine
              </button>
            )}
          </form>
        </div>
      </div>
      <IdentityVerificationModal isOpen={isKycOpen} onClose={() => setIsKycOpen(false)} />
    </>
  );
};

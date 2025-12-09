
import React, { useState } from 'react';
import { X, ArrowUpRight, ArrowDownRight, Smartphone, Banknote } from 'lucide-react';
import { TransactionType, PaymentProvider, Organization } from '../types';

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  org: Organization;
  isAdmin: boolean;
  onTransaction: (data: any) => void;
  prefillType?: TransactionType;
}

export const TransactionDialog: React.FC<TransactionDialogProps> = ({ isOpen, onClose, org, isAdmin, onTransaction, prefillType }) => {
  const [type, setType] = useState<TransactionType>(prefillType || 'CONTRIBUTION');
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState<PaymentProvider>('CASH');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  
  // New Fee logic based on ENF-05
  const calculateFees = (amt: number, prov: PaymentProvider) => {
    if (prov === 'CASH') return 0;
    // Mock fees for mobile money: 1%
    return Math.ceil(amt * 0.01); 
  };

  const currentAmount = parseFloat(amount) || 0;
  const currentFees = calculateFees(currentAmount, provider);
  const total = currentAmount + currentFees;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTransaction({
      type,
      amount: currentAmount,
      fees: currentFees,
      provider,
      category: category || type,
      date: new Date().toISOString(),
      memberId: 'm1', // Mock: Current User
      memberName: 'Moi'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-3xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="bg-primary p-6 text-white relative">
            <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/30"><X size={20}/></button>
            <h2 className="text-xl font-bold font-heading">Nouvelle Transaction</h2>
            <p className="text-sm opacity-80">Enregistrez un mouvement financier</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Type Selector - Admin gets more options */}
            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-xl">
                <button 
                  type="button" 
                  onClick={() => setType('CONTRIBUTION')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${type === 'CONTRIBUTION' ? 'bg-primary text-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                  Entrée (Cotisation)
                </button>
                {isAdmin && (
                  <button 
                    type="button" 
                    onClick={() => setType('EXPENSE')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${type === 'EXPENSE' ? 'bg-red-500 text-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}
                  >
                    Sortie (Dépense)
                  </button>
                )}
            </div>

            {/* Amount */}
            <div>
               <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Montant (FCFA)</label>
               <input 
                 type="number" 
                 required
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary focus:ring-0 text-xl font-bold text-gray-900 bg-gray-50"
                 placeholder="0"
               />
            </div>

            {/* Provider Selection */}
            <div>
               <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Moyen de Paiement</label>
               <div className="grid grid-cols-2 gap-3">
                   {['CASH', 'AIRTEL_MONEY', 'MOOV_MONEY', 'KONOOM'].map((p) => (
                       <button
                         key={p}
                         type="button"
                         onClick={() => setProvider(p as PaymentProvider)}
                         className={`px-3 py-3 rounded-xl border text-left flex items-center gap-2 transition-all ${provider === p ? 'border-secondary bg-yellow-50 ring-1 ring-secondary' : 'border-gray-200 hover:border-gray-300'}`}
                       >
                          {p === 'CASH' ? <Banknote size={16} className="text-green-600"/> : <Smartphone size={16} className="text-primary"/>}
                          <div>
                              <span className="block text-xs font-bold text-gray-900">{p.replace('_', ' ')}</span>
                          </div>
                       </button>
                   ))}
               </div>
            </div>

            {/* Mobile Money Phone Input */}
            {provider !== 'CASH' && (
                <div className="animate-in slide-in-from-top-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Numéro Téléphone</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: 66 12 34 56"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    />
                </div>
            )}

            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Montant</span>
                    <span>{new Intl.NumberFormat('fr-TD').format(currentAmount)} FCFA</span>
                </div>
                {provider !== 'CASH' && (
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Frais (1%)</span>
                        <span>{new Intl.NumberFormat('fr-TD').format(currentFees)} FCFA</span>
                    </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
                    <span>Total débité</span>
                    <span>{new Intl.NumberFormat('fr-TD').format(total)} FCFA</span>
                </div>
            </div>

            <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primaryDark transition-all">
                Valider la Transaction
            </button>

        </form>
      </div>
    </div>
  );
};

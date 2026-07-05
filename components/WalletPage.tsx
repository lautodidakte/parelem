
import React, { useState, useMemo } from 'react';
import { MOCK_WALLET_TRANSACTIONS } from '../constants';
import { useTontines } from '../contexts/TontinesContext';
import { ArrowLeft, Plus, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TransactionDialog } from './TransactionDialog';
import { TransactionType } from '../types';

export const WalletPage: React.FC = () => {
  const navigate = useNavigate();
  const { tontines } = useTontines();
  
  const [isTxOpen, setIsTxOpen] = useState(false);
  const [txType, setTxType] = useState<TransactionType>('CONTRIBUTION');
  const [transactions, setTransactions] = useState(MOCK_WALLET_TRANSACTIONS);

  const INITIAL_BALANCE = 84500;
  
  const currentBalance = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      if (tx.type === 'CREDIT') return acc + tx.amount;
      if (tx.type === 'DEBIT') return acc - tx.amount;
      return acc;
    }, INITIAL_BALANCE);
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-TD').format(amount);
  };

  const handleCotiser = () => {
    setTxType('CONTRIBUTION');
    setIsTxOpen(true);
  };

  const handleUnavailableAction = (action: string) => {
    alert(`${action} : Cette fonctionnalité sera disponible prochainement.`);
  };

  const handleTransactionSuccess = (data: any) => {
    const isOutflow = data.type === 'CONTRIBUTION' || data.type === 'EXPENSE' || data.type === 'LOAN';
    
    const newTx = {
      id: `wt-${Date.now()}`,
      type: isOutflow ? 'DEBIT' : 'CREDIT',
      amount: data.amount,
      label: data.category || (data.type === 'CONTRIBUTION' ? 'Cotisation Tontine' : 'Transaction Wallet'),
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    
    setTransactions([newTx as any, ...transactions]);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
       <div className="bg-primary pt-8 pb-16 px-6 rounded-b-[2.5rem] shadow-lg relative z-10">
          <div className="flex items-center gap-4 text-white mb-6">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ArrowLeft />
              </button>
              <h1 className="text-xl font-bold font-heading">Mon Wallet</h1>
          </div>
          
          <p className="text-white/80 text-sm mb-6 max-w-xs leading-relaxed">
              Gérez votre argent Parelem en toute sécurité.
          </p>

          <div className="bg-white rounded-3xl p-6 shadow-xl text-center mx-auto absolute left-6 right-6 -bottom-20 border border-gray-100">
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mb-4 mx-auto"></div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Solde Disponible</p>
              <h2 className="text-4xl font-bold text-primary mt-1 mb-6 font-heading">
                {formatCurrency(currentBalance)} <span className="text-lg font-normal text-gray-400">FCFA</span>
              </h2>
              
              <div className="flex justify-center gap-3">
                  <button onClick={() => handleUnavailableAction('Recharger')} className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white px-3 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-primary/20 transition-transform"><Plus size={14} /> Recharger</button>
                  <button onClick={handleCotiser} className="flex-1 flex items-center justify-center gap-1.5 bg-secondary text-primaryDark px-3 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-secondary/20 transition-transform"><ArrowUpRight size={14} /> Cotiser</button>
                  <button onClick={() => handleUnavailableAction('Encaisser')} className="flex-1 flex items-center justify-center gap-1.5 bg-darkCard text-white px-3 py-3 rounded-2xl text-xs font-bold shadow-lg transition-transform"><ArrowDownRight size={14} /> Encaisser</button>
              </div>
          </div>
       </div>

       <div className="h-28"></div>

       <div className="px-6 mt-4">
          <h3 className="font-bold text-lg text-gray-900 font-heading mb-5">Historique</h3>
          
          <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-3">
              {transactions.map((tx) => (
                  <div key={tx.id} className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center border border-gray-100/50 transition-colors">
                      <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'DEBIT' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                              {tx.type === 'DEBIT' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                          </div>
                          <div>
                              <p className="font-bold text-sm text-gray-900 leading-tight">{tx.label}</p>
                              <p className="text-[10px] text-gray-400 font-medium mt-1">{tx.date}</p>
                          </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold text-sm ${tx.type === 'DEBIT' ? 'text-red-500' : 'text-primary'}`}>
                            {tx.type === 'DEBIT' ? '-' : '+'}{formatCurrency(tx.amount)}
                        </span>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">FCFA</p>
                      </div>
                  </div>
              ))}
          </div>
       </div>

       <TransactionDialog 
         isOpen={isTxOpen}
         onClose={() => setIsTxOpen(false)}
         org={tontines[0]} 
         isAdmin={false}
         prefillType={txType}
         onTransaction={handleTransactionSuccess}
       />
    </div>
  );
};

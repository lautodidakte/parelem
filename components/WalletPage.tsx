
import React, { useState, useMemo } from 'react';
import { MOCK_WALLET_TRANSACTIONS } from '../constants';
import { useTontines } from '../contexts/TontinesContext';
import { ArrowLeft, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TransactionDialog } from './TransactionDialog';
import { BalanceCard } from './ui/BalanceCard';
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
       <div className="px-6 pt-6 pb-2 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold font-heading text-gray-900">Mon Wallet</h1>
       </div>

       <div className="px-6 mt-2">
          <BalanceCard
            label="Solde Disponible"
            amount={currentBalance}
            currency="FCFA"
            actions={
              <div className="flex gap-2">
                <button onClick={() => handleUnavailableAction('Recharger')} className="flex-1 min-w-0 flex items-center justify-center gap-1 bg-white/15 text-white px-2 py-3 rounded-2xl text-[11px] font-bold whitespace-nowrap hover:bg-white/25 transition-colors"><Plus size={14} className="shrink-0" /> Recharger</button>
                <button onClick={handleCotiser} className="flex-1 min-w-0 flex items-center justify-center gap-1 bg-secondary text-primaryDark px-2 py-3 rounded-2xl text-[11px] font-bold whitespace-nowrap shadow-lg shadow-black/10 transition-transform"><ArrowUpRight size={14} className="shrink-0" /> Cotiser</button>
                <button onClick={() => handleUnavailableAction('Encaisser')} className="flex-1 min-w-0 flex items-center justify-center gap-1 bg-white/15 text-white px-2 py-3 rounded-2xl text-[11px] font-bold whitespace-nowrap hover:bg-white/25 transition-colors"><ArrowDownRight size={14} className="shrink-0" /> Encaisser</button>
              </div>
            }
          />
       </div>

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

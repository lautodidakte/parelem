import React from 'react';
import { MOCK_WALLET_TRANSACTIONS } from '../constants';
import { ArrowLeft, Plus, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WalletPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
       {/* Teal Header */}
       <div className="bg-primary pt-8 pb-16 px-6 rounded-b-[2.5rem] shadow-lg relative z-10">
          <div className="flex items-center gap-4 text-white mb-6">
              <button onClick={() => navigate(-1)}><ArrowLeft /></button>
              <h1 className="text-xl font-bold">Mon Wallet</h1>
          </div>
          
          <p className="text-white/80 text-sm mb-6 max-w-xs">
              Rechargez votre compte, versez vos cotisations et encaissez votre argent
          </p>

          {/* Balance Card - Floating */}
          <div className="bg-white rounded-3xl p-6 shadow-xl text-center mx-auto absolute left-6 right-6 -bottom-20">
              <div className="w-12 h-8 bg-gray-100 rounded-md mb-2 mx-auto flex items-center justify-center">
                  <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
              </div>
              <p className="text-sm font-bold text-gray-900">Solde</p>
              <h2 className="text-4xl font-bold text-primary mt-1 mb-6">84€</h2>
              
              <div className="flex justify-center gap-4">
                  <button className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-full text-xs font-bold shadow-md shadow-primary/20">
                      <Plus size={14} /> Recharger
                  </button>
                  <button className="flex items-center gap-1.5 bg-secondary text-white px-4 py-2 rounded-full text-xs font-bold shadow-md shadow-secondary/20">
                      <ArrowUpRight size={14} /> Cotiser
                  </button>
                  <button className="flex items-center gap-1.5 bg-darkCard text-white px-4 py-2 rounded-full text-xs font-bold shadow-md">
                      <ArrowDownRight size={14} /> Encaisser
                  </button>
              </div>
          </div>
       </div>

       {/* Spacer for floating card */}
       <div className="h-24"></div>

       {/* Transactions History */}
       <div className="px-6 mt-4">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Historique de mes transactions</h3>
          
          <div className="space-y-4">
              {MOCK_WALLET_TRANSACTIONS.map((tx) => (
                  <div key={tx.id} className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
                      <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${tx.type === 'DEBIT' ? 'bg-gray-400' : 'bg-gray-400'}`}></div>
                          <div>
                              <p className="font-bold text-sm text-gray-900 leading-tight">{tx.label}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{tx.date}</p>
                          </div>
                      </div>
                      <span className={`font-bold ${tx.type === 'DEBIT' ? 'text-secondary' : 'text-primary'}`}>
                          {tx.type === 'DEBIT' ? '-' : '+'}{tx.amount}€
                      </span>
                  </div>
              ))}
          </div>
       </div>
    </div>
  );
};
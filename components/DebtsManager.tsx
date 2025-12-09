import React, { useState } from 'react';
import { MOCK_DEBTS } from '../constants';
import { User, Calendar, CheckCircle, Plus } from 'lucide-react';

export const DebtsManager: React.FC = () => {
  const [debts, setDebts] = useState(MOCK_DEBTS);

  const handleRepay = (id: string, amount: number) => {
    if (window.confirm(`Confirmer le remboursement de ${new Intl.NumberFormat('fr-TD').format(amount)} FCFA ?`)) {
      setDebts(prev => ({
        ...prev,
        owedByMe: prev.owedByMe.filter(d => d.id !== id)
      }));
      // In a real app, this would trigger an API call and update the transaction history
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-gray-900 font-heading">Gestion des Dettes</h1>
         <button className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#144a2d] transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
            <Plus size={18} /> Nouvelle Dette
         </button>
      </div>

      {/* Section: Ce que je dois */}
      <div className="bg-red-50/50 rounded-3xl p-6 border border-red-50">
          <h2 className="text-red-800 font-bold mb-6 flex items-center gap-2">
              <User size={20} className="text-red-500" /> Ce que je dois (Mes Emprunts)
          </h2>
          
          <div className="space-y-4">
              {debts.owedByMe.length === 0 ? (
                  <div className="bg-white/50 rounded-2xl p-8 text-center text-gray-500">
                      <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
                      <p className="font-medium">Aucune dette en cours. Bravo !</p>
                  </div>
              ) : (
                  debts.owedByMe.map((debt) => (
                      <div key={debt.id} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md">
                          <div className="flex items-center gap-4">
                              <img src={debt.avatar} alt="" className="w-12 h-12 rounded-full bg-gray-100 object-cover" />
                              <div>
                                  <p className="text-sm text-gray-500 font-bold">À : <span className="text-gray-900 text-base">{debt.counterparty}</span></p>
                                  <p className="text-gray-600 font-medium mt-1">{debt.reason}</p>
                                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Calendar size={12}/> Échéance : {debt.dueDate}</p>
                              </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                              <p className="text-xl font-bold text-red-600">{new Intl.NumberFormat('fr-TD').format(debt.amount)} FCFA</p>
                              {debt.totalAmount && <p className="text-xs text-gray-400">Sur {new Intl.NumberFormat('fr-TD').format(debt.totalAmount)}</p>}
                              <button 
                                onClick={() => handleRepay(debt.id, debt.amount)}
                                className="mt-1 border border-green-500 text-green-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-green-50 w-full md:w-auto transition-colors active:scale-95"
                              >
                                  Rembourser
                              </button>
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>

      {/* Section: Ce qu'on me doit */}
      <div className="bg-green-50/50 rounded-3xl p-6 border border-green-50">
          <h2 className="text-green-800 font-bold mb-6 flex items-center gap-2">
              <User size={20} className="text-green-600" /> Ce qu'on me doit (Mes Prêts)
          </h2>
          
          <div className="space-y-4">
              {debts.owedToMe.length === 0 ? (
                  <div className="bg-white/50 rounded-2xl p-8 text-center text-gray-500">
                      <p className="font-medium">Personne ne vous doit d'argent actuellement.</p>
                  </div>
              ) : (
                  debts.owedToMe.map((debt) => (
                      <div key={debt.id} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md">
                          <div className="flex items-center gap-4">
                              <img src={debt.avatar} alt="" className="w-12 h-12 rounded-full bg-gray-100 object-cover" />
                              <div>
                                  <p className="text-sm text-gray-500 font-bold">De : <span className="text-gray-900 text-base">{debt.counterparty}</span></p>
                                  <p className="text-gray-600 font-medium mt-1">{debt.reason}</p>
                                  <p className="text-xs text-gray-400 mt-1">Prêté le : {debt.date}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="text-xl font-bold text-green-600">{new Intl.NumberFormat('fr-TD').format(debt.amount)} FCFA</p>
                              <p className="text-xs text-gray-400 mt-1">Échéance : {debt.dueDate}</p>
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>
    </div>
  );
};

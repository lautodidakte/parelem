
import React from 'react';
import { X, Users, Wallet, Calendar } from 'lucide-react';

interface CreateTontineDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTontineDialog: React.FC<CreateTontineDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Dialog */}
      <div className="bg-white rounded-3xl w-full max-w-lg relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-primary p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold text-white font-heading">Créer une Tontine</h2>
          <p className="text-white/80 mt-1 text-sm">Configurez votre nouveau groupe d'épargne.</p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nom du Groupe</label>
            <input 
              type="text" 
              placeholder="Ex: Tontine Solidaire N'Djamena"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium text-gray-700">
                    <option value="ROTATIVE">Rotative</option>
                    <option value="EPARGNE">Épargne Simple</option>
                  </select>
                  <Wallet size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Fréquence</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium text-gray-700">
                    <option value="MONTHLY">Mensuelle</option>
                    <option value="WEEKLY">Hebdomadaire</option>
                  </select>
                  <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
             </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Montant de la part (FCFA)</label>
            <input 
              type="number" 
              placeholder="Ex: 10 000"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-lg"
            />
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Visibilité</label>
             <div className="flex gap-4">
                <label className="flex-1 flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary has-[:checked]:bg-green-50">
                    <input type="radio" name="visibility" value="public" className="accent-primary" defaultChecked />
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">Publique</span>
                        <span className="text-[10px] text-gray-500">Visible dans le fil</span>
                    </div>
                </label>
                <label className="flex-1 flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 has-[:checked]:border-primary has-[:checked]:bg-green-50">
                    <input type="radio" name="visibility" value="private" className="accent-primary" />
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">Privée</span>
                        <span className="text-[10px] text-gray-500">Sur invitation</span>
                    </div>
                </label>
             </div>
          </div>

          <button className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/30 hover:bg-[#144a2d] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4">
             <Users size={20} /> Créer le Groupe
          </button>
        </div>
      </div>
    </div>
  );
};

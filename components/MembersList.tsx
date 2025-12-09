import React from 'react';
import { MOCK_ORG } from '../constants';
import { Search } from 'lucide-react';

export const MembersList: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Membres du Groupe</h1>
        <div className="relative w-full md:w-72">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder="Rechercher..." 
               className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium" 
             />
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_ORG.members.map((member) => (
            <div key={member.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                    <img src={member.avatarUrl} alt={member.fullName} className="w-16 h-16 rounded-full bg-gray-100 object-cover border-4 border-gray-50" />
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                           <h3 className="font-bold text-lg text-gray-900">{member.fullName}</h3>
                           {member.status === 'UP_TO_DATE' ? (
                               <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">À jour</span>
                           ) : (
                               <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">En retard</span>
                           )}
                        </div>
                        <p className="text-sm text-gray-400 font-medium">Membre • {member.phone}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-gray-50 pt-4 md:pt-0">
                    <div>
                        <p className="text-xs text-gray-400 font-medium mb-1">Solde</p>
                        <p className="font-bold text-gray-900">{new Intl.NumberFormat('fr-TD').format(member.totalContributed)} FCFA</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button className="text-sm border border-gray-200 px-4 py-2 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                            Voir Profil
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
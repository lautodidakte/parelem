import React from 'react';
import { Card } from './ui/Card';
import { MOCK_IMPACT_REPORTS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const ImpactDashboard: React.FC = () => {
  const data = MOCK_IMPACT_REPORTS.map(r => ({
    name: r.period,
    Emplois: r.metrics.jobsCreated,
    Croissance: r.metrics.revenueGrowth,
    Score: r.metrics.accessToFinanceScore
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 font-heading">Aperçu de l'Impact Régional</h2>
        <p className="text-gray-500 mt-1">Suivi de la croissance économique dans la région du Chari-Baguirmi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <p className="text-gray-500 text-sm font-medium">Emplois Créés (Net)</p>
            <h3 className="text-4xl font-bold text-primary mt-2">142</h3>
            <span className="text-xs bg-green-50 text-green-700 font-bold px-2 py-1 rounded-lg mt-3 inline-block">+12% vs trimestre dernier</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <p className="text-gray-500 text-sm font-medium">Croissance Revenus Moy.</p>
            <h3 className="text-4xl font-bold text-secondary mt-2">18%</h3>
             <span className="text-xs bg-green-50 text-green-700 font-bold px-2 py-1 rounded-lg mt-3 inline-block">Au-dessus de la cible (15%)</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <p className="text-gray-500 text-sm font-medium">Cohortes Actives</p>
            <h3 className="text-4xl font-bold text-gray-800 mt-2">8</h3>
            <span className="text-xs text-gray-400 mt-3 inline-block">À travers 3 villes</span>
        </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <p className="text-gray-500 text-sm font-medium">Accès au Financement</p>
            <h3 className="text-4xl font-bold text-primary mt-2">7.8/10</h3>
             <span className="text-xs bg-green-50 text-green-700 font-bold px-2 py-1 rounded-lg mt-3 inline-block">Amélioration constante</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Tendances Création d'Emplois" className="border-none shadow-md">
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                    cursor={{fill: '#F3F4F6'}}
                />
                <Bar dataKey="Emplois" fill="#1A5E3A" radius={[8, 8, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Croissance des Revenus (%)" className="border-none shadow-md">
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                     contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Line type="monotone" dataKey="Croissance" stroke="#FFD700" strokeWidth={4} dot={{r: 6, fill: '#FFD700', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
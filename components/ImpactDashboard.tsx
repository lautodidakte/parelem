import React from 'react';
import { Card } from './ui/Card';
import { StatCard } from './ui/StatCard';
import { TrendChart } from './ui/MiniCharts';

export const ImpactDashboard: React.FC = () => {
  // Série trimestrielle (démo) pour donner du relief aux graphiques.
  const data = [
    { name: '2024-T1', Emplois: 45, Croissance: 8 },
    { name: '2024-T2', Emplois: 72, Croissance: 11 },
    { name: '2024-T3', Emplois: 98, Croissance: 14 },
    { name: '2024-T4', Emplois: 120, Croissance: 16 },
    { name: '2025-T1', Emplois: 142, Croissance: 18 },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 font-heading">Aperçu de l'Impact Régional</h2>
        <p className="text-gray-500 mt-1">Suivi de la croissance économique dans la région du Chari-Baguirmi</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          label="Emplois Créés (Net)"
          value="142"
          accent="green"
          trend="up"
          delta="+12%"
          data={[110, 118, 124, 130, 135, 139, 142]}
        />
        <StatCard
          label="Croissance Revenus Moy."
          value="18%"
          accent="gold"
          trend="up"
          delta="Cible 15% ✓"
          data={[12, 13, 14, 15, 16, 17, 18]}
        />
        <StatCard
          label="Cohortes Actives"
          value="8"
          accent="primary"
          trend="neutral"
          delta="3 villes"
          data={[5, 6, 6, 7, 7, 8, 8]}
        />
        <StatCard
          label="Accès au Financement"
          value="7.8/10"
          accent="primary"
          trend="up"
          delta="En hausse"
          data={[6.5, 6.8, 7, 7.2, 7.4, 7.6, 7.8]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Tendances Création d'Emplois" className="border-none shadow-md">
          <div className="mt-4">
            <TrendChart
              variant="bars"
              color="#328080"
              data={data.map((d) => ({ name: d.name, value: d.Emplois }))}
            />
          </div>
        </Card>

        <Card title="Croissance des Revenus (%)" className="border-none shadow-md">
          <div className="mt-4">
            <TrendChart
              variant="area"
              color="#E0A800"
              suffix="%"
              data={data.map((d) => ({ name: d.name, value: d.Croissance }))}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { MOCK_COHORTS } from '../constants';
import { Calendar, CheckCircle2, Circle, Clock, MapPin, ChevronRight, AlertCircle } from 'lucide-react';

export const CohortsTracker: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 font-heading">Suivi des Cohortes</h2>
        <p className="text-gray-500 mt-1">Surveillez les jalons et progrès des groupes GIE.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {MOCK_COHORTS.map((cohort) => (
            <Card key={cohort.id} className="border-none shadow-md hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4 border-b border-gray-50 pb-6">
                    <div>
                        <div className="flex items-center gap-3">
                             <h3 className="text-2xl font-bold text-primary font-heading">{cohort.name}</h3>
                             <span className="bg-primary/5 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/10">{cohort.organizationIds.length} Groupes</span>
                        </div>
                        <p className="text-sm text-gray-400 flex items-center gap-2 mt-2 font-medium">
                             <MapPin size={16} className="text-gray-300" /> Région du Chari-Baguirmi
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors">
                            Voir Détails <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="relative px-2">
                    {/* Progress Bar background */}
                    <div className="absolute top-6 left-0 w-full h-1.5 bg-gray-100 rounded-full hidden md:block z-0"></div>
                    
                    <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 relative z-10">
                        {cohort.milestones.map((milestone, idx) => {
                            let statusStyles = 'text-gray-300 bg-white border-gray-200';
                            let icon = <Circle size={18} />;
                            let labelColor = 'text-gray-400';
                            
                            if (milestone.status === 'COMPLETED') {
                                statusStyles = 'text-white bg-green-500 border-green-500 shadow-md shadow-green-200';
                                icon = <CheckCircle2 size={18} />;
                                labelColor = 'text-green-800';
                            } else if (milestone.status === 'IN_PROGRESS') {
                                statusStyles = 'text-blue-600 bg-white border-blue-500 ring-4 ring-blue-50';
                                icon = <Loader2 className="animate-spin" size={18} />;
                                labelColor = 'text-blue-800';
                            } else if (milestone.status === 'LATE') {
                                statusStyles = 'text-white bg-red-500 border-red-500 shadow-md shadow-red-200';
                                icon = <AlertCircle size={18} />;
                                labelColor = 'text-red-800';
                            }

                            return (
                                <div key={idx} className="flex md:flex-col items-start md:items-center gap-4 md:gap-4 text-left md:text-center flex-1">
                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${statusStyles}`}>
                                        {icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-bold mb-1 ${labelColor}`}>{milestone.name}</p>
                                        <p className="text-xs text-gray-400 flex items-center md:justify-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg w-fit md:w-auto md:mx-auto">
                                            <Calendar size={12} /> {new Date(milestone.date).toLocaleDateString()}
                                        </p>
                                        {milestone.status === 'LATE' && (
                                            <span className="md:absolute md:-bottom-2 md:left-1/2 md:-translate-x-1/2 text-[10px] text-red-600 font-bold bg-red-50 border border-red-100 px-2 py-0.5 rounded-full mt-2 inline-block">
                                                En Retard
                                            </span>
                                        )}
                                        {milestone.status === 'IN_PROGRESS' && (
                                            <span className="md:absolute md:-bottom-2 md:left-1/2 md:-translate-x-1/2 text-[10px] text-blue-600 font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full mt-2 inline-block">
                                                En cours
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>
        ))}
      </div>
    </div>
  );
};

// Helper for icon
function Loader2({ className, size }: { className?: string, size?: number }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Users, TrendingUp, HandCoins, Bell, Check, Sparkles, FileText, Smartphone } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: "Un projet ? Parelem vous aide à le réaliser.",
    text: "Mariage, commerce, ou soutien familial : activez la solidarité de votre groupe et réalisez vos projets sans attendre.",
    visual: "orbital"
  },
  {
    id: 2,
    title: "Recevez votre épargne, garantie et sécurisée.",
    text: "Importez une tontine existante ou créez-en une nouvelle avec vos proches. Sécurisez jusqu'à 5.000.000 FCFA.",
    visual: "card"
  },
  {
    id: 3,
    title: "Plus d'oublis, plus de palabres.",
    text: "Parelem gère les rappels SMS, le suivi des versements et la sécurité. Profitez de la solidarité, sans la complexité.",
    visual: "notifications"
  },
  {
    id: 4,
    title: "Deux formules adaptées à vos besoins.",
    text: "De la tontine entre amis à la gestion de grands GIE agricoles.",
    visual: "plans"
  }
];

export const OnboardingWalkthrough: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      localStorage.setItem('parelem_onboarding_completed', 'true');
      navigate('/login');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('parelem_onboarding_completed', 'true');
    navigate('/login');
  };

  const renderVisual = (type: string) => {
    switch (type) {
      case 'orbital':
        return (
          <div className="relative w-full aspect-square flex items-center justify-center max-w-[300px] mx-auto animate-in fade-in zoom-in duration-700">
            <div className="absolute w-[85%] h-[85%] border-2 border-dashed border-gray-100 rounded-full"></div>
            <div className="absolute w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 w-28 h-28 bg-primary rounded-full flex items-center justify-center shadow-[0_15px_35px_rgba(50,128,128,0.3)] border-[6px] border-white">
                <span className="text-white text-5xl font-bold font-heading">P</span>
            </div>
            <div className="absolute top-0 bg-white p-3.5 rounded-2xl shadow-xl shadow-gray-100 border border-gray-50 -translate-y-2 animate-bounce duration-[3000ms]">
                <HandCoins size={28} className="text-primary" />
            </div>
            <div className="absolute bottom-4 left-4 bg-white p-3.5 rounded-2xl shadow-xl shadow-gray-100 border border-gray-50 -translate-x-4">
                <TrendingUp size={28} className="text-secondary" />
            </div>
            <div className="absolute bottom-4 right-4 bg-white p-3.5 rounded-2xl shadow-xl shadow-gray-100 border border-gray-50 translate-x-4">
                <Users size={28} className="text-primary" />
            </div>
          </div>
        );
      
      case 'card':
        return (
          <div className="relative w-full max-w-[280px] mx-auto animate-in slide-in-from-right-10 duration-700">
             {/* Main Card */}
             <div className="bg-primary rounded-3xl p-6 shadow-2xl relative overflow-hidden h-44 flex flex-col justify-between transform -rotate-2">
                <div className="absolute top-0 right-0 p-4 opacity-20"><Smartphone size={40} className="text-white" /></div>
                <div>
                   <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Cagnotte Disponible</p>
                   <h2 className="text-white text-3xl font-bold font-heading mt-1">5.0 M <span className="text-lg font-normal">FCFA</span></h2>
                </div>
                <div className="flex justify-between items-end">
                   <p className="text-white/60 font-mono text-sm tracking-widest">**** 4289</p>
                   <div className="w-8 h-8 rounded-full bg-secondary/80"></div>
                </div>
             </div>
             {/* Floating Coin Icon */}
             <div className="absolute -top-4 -right-2 bg-secondary w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                <span className="text-white font-bold">$</span>
             </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="relative w-full aspect-square flex items-center justify-center max-w-[280px] mx-auto animate-in zoom-in duration-700">
             <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center relative">
                <Bell size={64} className="text-primary/40 animate-swing" />
                <div className="absolute top-8 right-8 w-4 h-4 bg-red-400 rounded-full border-2 border-white"></div>
             </div>
             {/* Bubble Rappel */}
             <div className="absolute top-4 left-0 bg-white py-2 px-4 rounded-2xl shadow-lg shadow-gray-100 flex items-center gap-2 border border-gray-50 animate-in slide-in-from-left-4 duration-500">
                <span className="text-xs font-bold text-gray-700">Rappel tontine</span>
                <span>🔔</span>
             </div>
             {/* Bubble Versement */}
             <div className="absolute bottom-8 right-0 bg-white py-2 px-4 rounded-2xl shadow-lg shadow-gray-100 flex items-center gap-2 border border-gray-50 animate-in slide-in-from-right-4 duration-500 delay-200">
                <span className="text-xs font-bold text-gray-700">Versement reçu</span>
                <span>✅</span>
             </div>
          </div>
        );

      case 'plans':
        return (
          <div className="relative w-full max-w-[280px] mx-auto animate-in slide-in-from-bottom-10 duration-700">
             {/* Background Plan (Standard) */}
             <div className="absolute top-[-20px] left-[10%] w-[80%] bg-gray-50 border border-gray-100 rounded-2xl p-6 opacity-40">
                <div className="flex justify-between items-center mb-4">
                   <div className="w-12 h-4 bg-gray-200 rounded"></div>
                   <div className="w-12 h-4 bg-gray-200 rounded"></div>
                </div>
             </div>
             {/* Foreground Plan (Premium) */}
             <div className="relative bg-white border-2 border-secondary rounded-3xl p-6 shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                   <h3 className="text-primary font-bold text-xl">Premium ⭐</h3>
                   <span className="bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Gold</span>
                </div>
                <div className="space-y-4">
                   {[
                     { text: "Suivi SMS", icon: Check },
                     { text: "Export PDF", icon: Check },
                     { text: "Support 24/7", icon: Check }
                   ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                         <item.icon size={16} className="text-green-500" strokeWidth={3} />
                         <span className="text-sm font-medium text-gray-600">{item.text}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-hidden relative font-sans">
      {/* Bouton Sauter */}
      <div className="flex justify-end p-8 z-20">
        <button 
          onClick={handleSkip}
          className="text-gray-300 font-medium text-base hover:text-gray-400 transition-colors"
        >
          Sauter
        </button>
      </div>

      {/* Zone Visuelle */}
      <div className="flex-[1.5] flex items-center justify-center p-4">
        {renderVisual(SLIDES[currentSlide].visual)}
      </div>

      {/* Zone Texte & Action */}
      <div className="flex-1 px-8 pb-12 flex flex-col items-center text-center">
        <h1 className="text-[22px] font-bold text-primary font-heading leading-tight mb-4 min-h-[4rem] px-4">
            {SLIDES[currentSlide].title}
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-[280px] min-h-[4.5rem]">
            {SLIDES[currentSlide].text}
        </p>

        {/* Dots Indicator */}
        <div className="flex gap-2 mb-10">
          {SLIDES.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-gray-100'}`}
            ></div>
          ))}
        </div>

        {/* Primary Action Button */}
        <button 
            onClick={handleNext}
            className="w-full bg-primary text-white h-15 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primaryDark transition-all active:scale-[0.98] shadow-xl shadow-primary/10"
        >
            <span className="text-base tracking-wide">
                {currentSlide === SLIDES.length - 1 ? "Commencer" : "Suivant"}
            </span>
            <ChevronRight size={18} className="mt-0.5" />
        </button>
      </div>

      <style>{`
        @keyframes swing {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-10deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-swing {
          animation: swing 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
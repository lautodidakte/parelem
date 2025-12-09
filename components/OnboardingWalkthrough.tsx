
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Users, TrendingUp, HandCoins, BellRing, ShieldCheck, Check, Star, ArrowLeft } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: "Un projet ? Mon Paré vous aide à le réaliser.",
    text: "Mariage, commerce, ou soutien familial : activez la solidarité de votre groupe et réalisez vos projets sans attendre.",
    visual: "cycle"
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
    text: "Mon Paré gère les rappels SMS, le suivi des versements et la sécurité. Profitez de la solidarité, sans la complexité.",
    visual: "notification"
  },
  {
    id: 4,
    title: "Deux formules adaptées à vos besoins.",
    text: "De la tontine entre amis à la gestion de grands GIE agricoles.",
    visual: "offers"
  }
];

export const OnboardingWalkthrough: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < SLIDES.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      finishOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const finishOnboarding = () => {
    localStorage.setItem('mon_pare_onboarding_completed', 'true');
    navigate('/login');
  };

  const renderVisual = (type: string) => {
    switch (type) {
      case 'cycle':
        return (
          <div className="relative w-64 h-64 flex items-center justify-center animate-in zoom-in duration-700">
            <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute -top-4 bg-white p-3 rounded-2xl shadow-lg border border-gray-50 text-primary">
              <HandCoins size={32} />
            </div>
            <div className="absolute -bottom-4 left-4 bg-white p-3 rounded-2xl shadow-lg border border-gray-50 text-secondary">
              <TrendingUp size={32} />
            </div>
            <div className="absolute -bottom-4 right-4 bg-white p-3 rounded-2xl shadow-lg border border-gray-50 text-gray-700">
              <Users size={32} />
            </div>
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
               <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-primary/40">
                 P
               </div>
            </div>
          </div>
        );
      case 'card':
        return (
          <div className="relative w-full max-w-[280px] h-48 animate-in slide-in-from-right duration-700">
            {/* Card Visual */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-[#164e30] rounded-3xl shadow-2xl p-6 text-white flex flex-col justify-between transform rotate-3 hover:rotate-0 transition-transform duration-500">
               <div className="flex justify-between items-start">
                 <div className="w-10 h-6 rounded bg-white/20"></div>
                 <ShieldCheck className="text-white/50" />
               </div>
               <div>
                 <p className="text-xs text-white/70 mb-1">Cagnotte Disponible</p>
                 <p className="text-3xl font-bold tracking-tight">5.0 M <span className="text-base font-normal">FCFA</span></p>
               </div>
               <div className="flex justify-between items-end">
                 <p className="text-sm font-medium tracking-wider">**** 4289</p>
                 <div className="w-8 h-8 rounded-full bg-secondary/80"></div>
               </div>
            </div>
            {/* Coin decoration */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold">
              $
            </div>
          </div>
        );
      case 'notification':
        return (
          <div className="relative w-64 h-64 flex items-center justify-center">
             <div className="w-40 h-40 bg-gray-50 rounded-full flex items-center justify-center relative animate-pulse">
                <BellRing size={64} className="text-primary" />
                <div className="absolute top-8 right-10 w-6 h-6 bg-red-500 rounded-full border-4 border-white"></div>
             </div>
             {/* Floating bubbles */}
             <div className="absolute top-10 left-0 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-100 text-xs font-bold text-gray-600 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                Rappel tontine 🔔
             </div>
             <div className="absolute bottom-10 right-0 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-100 text-xs font-bold text-green-600 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
                Versement reçu ✅
             </div>
          </div>
        );
      case 'offers':
        return (
          <div className="relative w-full max-w-[260px] h-60 flex items-center justify-center mt-8">
             {/* Background Card (Standard) */}
             <div className="absolute top-0 w-full h-40 bg-gray-100 rounded-2xl border border-gray-200 transform -rotate-6 scale-90 p-4 opacity-80">
                <div className="flex justify-between mb-2">
                   <span className="font-bold text-gray-500">Standard</span>
                   <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-500">Gratuit</span>
                </div>
                <div className="space-y-2 mt-4">
                   <div className="w-full h-2 bg-gray-200 rounded"></div>
                   <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
                </div>
             </div>
             {/* Foreground Card (Premium) */}
             <div className="absolute bottom-0 w-full h-44 bg-white rounded-2xl border-2 border-secondary shadow-xl shadow-orange-100 transform rotate-3 p-5">
                <div className="flex justify-between mb-2">
                   <span className="font-bold text-gray-900 flex items-center gap-1">Premium <Star size={12} fill="#FFD700" className="text-secondary"/></span>
                   <span className="text-[10px] bg-secondary text-white font-bold px-2 py-0.5 rounded-full">Gold</span>
                </div>
                <div className="space-y-3 mt-4">
                   <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Check size={12} className="text-green-500" /> Suivi SMS
                   </div>
                   <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Check size={12} className="text-green-500" /> Export PDF
                   </div>
                   <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Check size={12} className="text-green-500" /> Support 24/7
                   </div>
                </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans">
      {/* Top Bar */}
      <div className="px-6 py-6 flex justify-between items-center relative z-20">
        {/* Back Button (Only Step > 0) */}
        <div className="w-16 h-10 flex items-center">
          {currentStep > 0 && (
            <button 
              onClick={handlePrev}
              className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={24} />
            </button>
          )}
        </div>

        <button 
          onClick={finishOnboarding}
          className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors"
        >
          Sauter
        </button>
      </div>

      {/* Main Slider Area */}
      <div className="flex-1 relative flex flex-col justify-center">
         <div 
           className="flex-1 flex transition-transform duration-500 ease-in-out"
           style={{ transform: `translateX(-${currentStep * 100}%)` }}
         >
            {SLIDES.map((slide) => (
              <div key={slide.id} className="w-full h-full flex-shrink-0 flex flex-col items-center px-6">
                 {/* Visual Container */}
                 <div className="flex-1 flex items-center justify-center w-full max-h-[45vh] py-4">
                    {renderVisual(slide.visual)}
                 </div>

                 {/* Text Container */}
                 <div className="w-full flex flex-col items-center text-center max-w-sm mt-4 mb-8">
                    <h2 className="text-[22px] font-bold text-primary font-heading mb-3 leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-[15px] text-gray-500 leading-relaxed px-2">
                      {slide.text}
                    </p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Bottom Controls */}
      <div className="px-8 pb-10 pt-2 bg-white relative z-20">
         <div className="flex flex-col gap-8">
            {/* Dots */}
            <div className="flex justify-center gap-2">
               {SLIDES.map((_, idx) => (
                 <div 
                   key={idx}
                   className={`h-2 rounded-full transition-all duration-300 ${
                     idx === currentStep ? 'w-8 bg-primary' : 'w-2 bg-gray-200'
                   }`}
                 />
               ))}
            </div>

            {/* Next Button */}
            <button 
              onClick={handleNext}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${
                currentStep === SLIDES.length - 1 
                  ? 'bg-primary text-white hover:bg-primaryDark' 
                  : 'bg-primary text-white hover:bg-primaryDark'
              }`}
            >
              {currentStep === SLIDES.length - 1 ? "Commencer" : "Suivant"}
              {currentStep !== SLIDES.length - 1 && <ChevronRight size={20} />}
            </button>
         </div>
      </div>
    </div>
  );
};

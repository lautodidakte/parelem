
import React, { useState } from 'react';
import { X, ShieldCheck, Upload, Camera, CheckCircle2, Loader2, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface IdentityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IdentityVerificationModal: React.FC<IdentityVerificationModalProps> = ({ isOpen, onClose }) => {
  const { verifyUser, isLoading } = useAuth();
  const [step, setStep] = useState<'INTRO' | 'UPLOAD' | 'SUCCESS'>('INTRO');
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleVerify = async () => {
    await verifyUser();
    setStep('SUCCESS');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primaryDark/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="bg-white rounded-[2.5rem] w-full max-w-md relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        
        {step !== 'SUCCESS' && (
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 z-20">
            <X size={20} />
          </button>
        )}

        <div className="p-8">
          {step === 'INTRO' && (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck size={40} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">Vérification d'identité</h2>
                <p className="text-gray-500 text-sm mt-2">
                  Pour participer à des tontines de plus de <span className="text-primary font-bold">50 000 FCFA</span>, la loi exige une vérification de votre identité.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 text-left">
                <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                  Vos données sont cryptées et ne seront jamais partagées. Cette étape renforce la confiance au sein de vos groupes.
                </p>
              </div>
              <button 
                onClick={() => setStep('UPLOAD')}
                className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primaryDark transition-all"
              >
                Démarrer la vérification
              </button>
            </div>
          )}

          {step === 'UPLOAD' && (
            <div className="text-center space-y-6 py-4">
              <h3 className="text-xl font-bold text-gray-900">Document d'identité</h3>
              <p className="text-gray-500 text-xs">Prenez une photo nette de votre CNI, Passeport ou Carte d'électeur.</p>
              
              <div className="aspect-[3/2] bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center relative group hover:border-primary transition-colors cursor-pointer">
                {file ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 size={40} className="text-green-500 mb-2" />
                    <span className="text-xs font-bold text-gray-700">{file.name}</span>
                  </div>
                ) : (
                  <>
                    <Camera size={48} className="text-gray-300 group-hover:text-primary transition-colors" />
                    <span className="text-xs font-bold text-gray-400 mt-4 uppercase tracking-widest">Scanner le document</span>
                  </>
                )}
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>

              <button 
                disabled={!file || isLoading}
                onClick={handleVerify}
                className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                  !file || isLoading ? 'bg-gray-200 text-gray-400' : 'bg-primary text-white shadow-primary/20 hover:bg-primaryDark'
                }`}
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Soumettre pour validation"}
              </button>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center space-y-6 py-8 animate-in zoom-in-95">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto border-4 border-green-50 shadow-xl shadow-green-100">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">Félicitations !</h2>
                <p className="text-gray-500 text-sm mt-2 px-4">
                  Votre identité a été vérifiée avec succès. Vous avez désormais accès à toutes les tontines sans limite de montant.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-primaryDark transition-all"
              >
                Continuer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

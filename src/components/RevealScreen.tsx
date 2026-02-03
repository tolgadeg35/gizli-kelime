import React, { useState } from 'react';
import { Player, Role, SecretData } from '../types';
import { Eye, EyeOff, ChevronUp, User } from 'lucide-react';

interface RevealScreenProps {
  players: Player[];
  secretData: SecretData;
  onRevealComplete: () => void;
  useHint: boolean;
}

const RevealScreen: React.FC<RevealScreenProps> = ({ players, secretData, onRevealComplete, useHint }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);

  const currentPlayer = players[currentIndex];

  const handleNext = () => {
    setIsRevealing(false);
    if (currentIndex < players.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onRevealComplete();
    }
  };

  const getRoleContent = () => {
    if (currentPlayer.role === Role.CIVILIAN) {
      return (
        <div className="text-center animate-fade-in">
          <p className="text-green-400 font-bold tracking-widest text-sm mb-2">GÖREVİNİZ</p>
          <p className="text-6xl font-black text-white mb-4">{secretData.word}</p>
          <p className="text-slate-400 text-sm">Kategori: {secretData.category}</p>
        </div>
      );
    } else {
      return (
        <div className="text-center animate-fade-in">
          <p className="text-red-500 font-bold tracking-widest text-sm mb-2">GÖREVİNİZ</p>
          <h2 className="text-5xl font-black text-red-500 mb-4">IMPOSTER</h2>
          {useHint && secretData.imposterHint ? (
            <div className="bg-slate-800/50 p-4 rounded-lg mt-4">
              <p className="text-slate-400 text-xs mb-1">İPUCU KELİME</p>
              <p className="text-2xl font-bold text-slate-200">{secretData.imposterHint}</p>
              <p className="text-xs text-slate-500 mt-2">Bu kelime gerçek değil, ama yakın!</p>
            </div>
          ) : (
            <p className="text-slate-300 mt-4">Kimseye belli etme, kelimeyi bulmaya çalış!</p>
          )}
        </div>
      );
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-between p-6 bg-slate-900 relative overflow-hidden">
      
      {/* Progress */}
      <div className="w-full flex justify-between items-center mb-8 z-10">
        <span className="text-slate-500 text-sm font-mono">
          OYUNCU {currentIndex + 1} / {players.length}
        </span>
        <div className="flex gap-1">
          {players.map((_, i) => (
            <div key={i} className={`h-1 w-4 rounded-full ${i <= currentIndex ? 'bg-purple-500' : 'bg-slate-700'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center z-10">
        
        {!isRevealing ? (
          /* HIDDEN STATE */
          <div className="flex flex-col items-center gap-6 animate-fade-in text-center">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center shadow-xl border-4 border-slate-700">
              <User className="w-10 h-10 text-slate-400" />
            </div>
            <div>
              <p className="text-slate-400 mb-2">Telefonu şu kişiye verin:</p>
              <h1 className="text-4xl font-bold text-white">{currentPlayer.name}</h1>
            </div>
            
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-sm text-purple-300 animate-bounce">Görmek için yukarı kaydırın</p>
              <button 
                className="w-16 h-16 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center active:bg-slate-700 transition-colors"
                onClick={() => setIsRevealing(true)}
              >
                <ChevronUp className="w-8 h-8 text-purple-400" />
              </button>
            </div>
          </div>
        ) : (
          /* REVEALED STATE */
          <div className="flex flex-col items-center w-full max-w-xs">
            {getRoleContent()}
            
            <div className="mt-16 w-full">
              <button 
                onClick={handleNext}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white py-4 rounded-xl font-bold transition-all active:scale-95"
              >
                {currentIndex < players.length - 1 ? 'GİZLE VE DEVAM ET' : 'HERKES GÖRDÜ'}
              </button>
            </div>
          </div>
        )}

      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-slate-900 pointer-events-none" />
    </div>
  );
};

export default RevealScreen;

import React, { useState } from 'react';
import { Player, Role, EndReason, SecretData } from '../types';
import { Trophy, Skull, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface ResultScreenProps {
  players: Player[];
  secretData: SecretData;
  endReason: EndReason;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ players, secretData, endReason, onRestart }) => {
  const [selectedImposterId, setSelectedImposterId] = useState<string | null>(null);
  const [imposterGuessWord, setImposterGuessWord] = useState('');
  const [phase, setPhase] = useState<'ACTION' | 'REVEAL'>('ACTION'); // ACTION (Vote/Guess) -> REVEAL (Winner)

  const imposters = players.filter(p => p.role === Role.IMPOSTER);
  const isImposterGuessing = endReason === EndReason.IMPOSTER_GUESS_CORRECT; 
  
  const [voteConfirmed, setVoteConfirmed] = useState(false);
  const [guessConfirmed, setGuessConfirmed] = useState(false);
  const [guessIsCorrect, setGuessIsCorrect] = useState(false);

  const handleVoteSubmit = () => {
    setVoteConfirmed(true);
    setPhase('REVEAL');
  };

  const handleGuessSubmit = (isCorrect: boolean) => {
    setGuessIsCorrect(isCorrect);
    setGuessConfirmed(true);
    setPhase('REVEAL');
  };

  // 1. Voting Phase UI
  if (phase === 'ACTION' && (endReason === EndReason.TOTAL_TIME_UP || endReason === EndReason.VOTE_CORRECT)) {
    return (
      <div className="h-full flex flex-col p-6 bg-slate-900 overflow-y-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-400">OYLAMA ZAMANI</h1>
        <p className="text-slate-400 text-center mb-8">İmposter olduğunu düşündüğünüz kişiyi seçin. Çoğunluk kime?</p>
        
        <div className="grid grid-cols-2 gap-3 mb-8">
          {players.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedImposterId(p.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedImposterId === p.id 
                ? 'border-purple-500 bg-purple-500/20 text-white' 
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
              }`}
            >
              <span className="font-bold block">{p.name}</span>
            </button>
          ))}
        </div>

        <button
          disabled={!selectedImposterId}
          onClick={handleVoteSubmit}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl font-bold text-xl disabled:opacity-50"
        >
          OYLAMAYI BİTİR
        </button>
      </div>
    );
  }

  // 2. Imposter Guessing UI
  if (phase === 'ACTION' && endReason === EndReason.IMPOSTER_GUESS_CORRECT) { // Used as "Imposter wants to guess"
    return (
      <div className="h-full flex flex-col p-6 bg-slate-900">
        <h1 className="text-3xl font-bold text-center mb-2 text-orange-500">İMPOSTER TAHMİNİ</h1>
        <p className="text-slate-400 text-center mb-8">İmposter oyunu durdurdu! Kelimeyi bilirse kazanır.</p>
        
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6 text-center">
            <p className="text-sm text-slate-500 mb-2">Gizli Kelime (GM Kontrolü)</p>
            <p className="text-3xl font-black blur-sm hover:blur-none transition-all cursor-pointer select-none" title="Görmek için üzerine gelin">
                {secretData.word}
            </p>
        </div>

        <p className="text-center text-white mb-4">İmposter doğru bildi mi?</p>
        
        <div className="flex gap-4">
            <button 
                onClick={() => handleGuessSubmit(false)}
                className="flex-1 bg-red-600 hover:bg-red-700 p-4 rounded-xl font-bold"
            >
                YANLIŞ
            </button>
            <button 
                onClick={() => handleGuessSubmit(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 p-4 rounded-xl font-bold"
            >
                DOĞRU
            </button>
        </div>
      </div>
    );
  }

  // 3. Final Reveal Logic
  let title = "";
  let winnerText = "";
  let winnerColor = "";
  let description = "";

  const isImposter = (id: string) => imposters.some(imp => imp.id === id);

  if (endReason === EndReason.CIVILIAN_TIMEOUT) {
    title = "İMPOSTER KAZANDI!";
    winnerText = "Sivil Süre Aşımı";
    winnerColor = "text-red-500";
    description = "Sıradaki sivil süresi içinde kelime söyleyemedi ve elendi.";
  } else if (endReason === EndReason.IMPOSTER_TIMEOUT) {
    title = "SİVİLLER KAZANDI!";
    winnerText = "İmposter Konuşamadı";
    winnerColor = "text-green-500";
    description = "İmposter süresi içinde kelime bulamadı veya söyleyemedi.";
  } else if (endReason === EndReason.TURN_TIME_UP) {
    // Fallback logic
    title = "SÜRE BİTTİ!";
    description = "Süre doldu, oyun sona erdi.";
    winnerText = "Oyun Bitti";
    winnerColor = "text-slate-400";
  } else if (voteConfirmed) {
      if (selectedImposterId && isImposter(selectedImposterId)) {
          title = "SİVİLLER KAZANDI!";
          winnerText = "İmposter Yakalandı";
          winnerColor = "text-green-500";
          description = `${players.find(p => p.id === selectedImposterId)?.name} gerçekten İmposter idi.`;
      } else {
          title = "İMPOSTER KAZANDI!";
          winnerText = "Yanlış Kişi Oylandı";
          winnerColor = "text-red-500";
          description = `${players.find(p => p.id === selectedImposterId)?.name} masumdu.`;
      }
  } else if (guessConfirmed) {
      if (guessIsCorrect) {
          title = "İMPOSTER KAZANDI!";
          winnerText = "Gizli Kelime Bulundu";
          winnerColor = "text-red-500";
      } else {
          title = "SİVİLLER KAZANDI!";
          winnerText = "Yanlış Tahmin";
          winnerColor = "text-green-500";
      }
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-900 animate-fade-in text-center">
      <div className="mb-6">
         {winnerColor.includes('green') ? <Trophy className="w-20 h-20 text-green-500 mx-auto" /> : <Skull className="w-20 h-20 text-red-500 mx-auto" />}
      </div>
      
      <h1 className={`text-4xl font-black mb-2 ${winnerColor}`}>{title}</h1>
      <p className="text-xl text-white font-medium mb-6">{winnerText}</p>
      <p className="text-slate-400 mb-8 max-w-xs mx-auto">{description}</p>

      <div className="bg-slate-800 w-full max-w-xs rounded-xl p-4 mb-8 border border-slate-700">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">GİZLİ KELİME</p>
        <p className="text-3xl font-black text-white">{secretData.word}</p>
        <p className="text-sm text-slate-400 mt-1">{secretData.category}</p>
      </div>

      <div className="w-full max-w-xs bg-slate-800 rounded-xl p-4 mb-8">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">ROLLER</p>
        {players.map(p => (
            <div key={p.id} className="flex justify-between py-1 border-b border-slate-700 last:border-0">
                <span className="text-slate-300">{p.name}</span>
                <span className={p.role === Role.IMPOSTER ? 'text-red-400 font-bold' : 'text-green-400'}>
                    {p.role === Role.IMPOSTER ? 'IMPOSTER' : 'Sivil'}
                </span>
            </div>
        ))}
      </div>

      <button 
        onClick={onRestart}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105"
      >
        <RefreshCw className="w-5 h-5" />
        YENİ OYUN
      </button>
    </div>
  );
};

export default ResultScreen;

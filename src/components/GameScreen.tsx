import React, { useEffect, useState, useRef } from 'react';
import { Player, Role, EndReason, GameSettings } from '../types';
import { Play, Pause, AlertTriangle, SkipForward, Gavel, Timer, Mic, User } from 'lucide-react';

interface GameScreenProps {
  players: Player[];
  settings: GameSettings;
  firstPlayerIndex: number;
  onEndGame: (reason: EndReason) => void;
  onImposterGuess: () => void;
  onVote: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ 
  players, 
  settings, 
  firstPlayerIndex, 
  onEndGame, 
  onImposterGuess,
  onVote 
}) => {
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(firstPlayerIndex);
  const [totalTimeLeft, setTotalTimeLeft] = useState(settings.totalTimeSeconds);
  const [turnTimeLeft, setTurnTimeLeft] = useState(settings.turnTimeSeconds);
  const [isPaused, setIsPaused] = useState(false);
  
  const totalTimerRef = useRef<number | null>(null);
  const turnTimerRef = useRef<number | null>(null);

  // Total Timer Logic
  useEffect(() => {
    if (isPaused) return;
    totalTimerRef.current = window.setInterval(() => {
      setTotalTimeLeft((prev) => {
        if (prev <= 1) {
          if (totalTimerRef.current) clearInterval(totalTimerRef.current);
          onEndGame(EndReason.TOTAL_TIME_UP);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (totalTimerRef.current) clearInterval(totalTimerRef.current); };
  }, [isPaused, onEndGame]);

  // Turn Timer Logic
  useEffect(() => {
    if (isPaused) return;
    turnTimerRef.current = window.setInterval(() => {
      setTurnTimeLeft((prev) => {
        if (prev <= 1) {
          if (turnTimerRef.current) clearInterval(turnTimerRef.current);
          onEndGame(EndReason.TURN_TIME_UP);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (turnTimerRef.current) clearInterval(turnTimerRef.current); };
  }, [currentPlayerIdx, isPaused]);

  const nextTurn = () => {
    setTurnTimeLeft(settings.turnTimeSeconds);
    setCurrentPlayerIdx((prev) => (prev + 1) % players.length);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentPlayer = players[currentPlayerIdx];
  
  // Percentages for bars
  const totalProgress = (totalTimeLeft / settings.totalTimeSeconds) * 100;
  const turnProgress = (turnTimeLeft / settings.turnTimeSeconds) * 100;
  
  const isTurnCritical = turnTimeLeft <= 5;

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden relative">
      
      {/* 1. TOP LINEAR PROGRESS BAR (TURN TIMER) */}
      <div className="w-full h-3 bg-slate-800 z-50">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${isTurnCritical ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-indigo-500'}`} 
          style={{ width: `${turnProgress}%` }}
        />
      </div>

      {/* Header Info */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center z-40 shadow-md">
        <div className="flex items-center gap-3 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          <ClockIcon className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-lg font-bold text-slate-200 tracking-widest">{formatTime(totalTimeLeft)}</span>
        </div>
        
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold transition-all ${
            isPaused 
            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/50' 
            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
          <span className="text-xs uppercase">{isPaused ? "Devam Et" : "Durdur"}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        
        {/* Current Player Card */}
        <div className="w-full max-w-sm aspect-square bg-slate-900/50 border border-slate-800 rounded-3xl relative flex flex-col items-center justify-center p-8 mb-8 backdrop-blur-sm shadow-2xl">
           {/* Background Glow */}
           <div className={`absolute inset-0 rounded-3xl opacity-20 transition-colors duration-500 ${isTurnCritical ? 'bg-red-500' : 'bg-indigo-500'}`} />
           
           <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center mb-6 shadow-xl relative z-10">
             <User className="w-10 h-10 text-slate-400" />
           </div>

           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 z-10">SIRA SENDE</p>
           <h2 className="text-4xl font-black text-center text-white leading-tight z-10 mb-4">{currentPlayer.name}</h2>
           
           <div className="bg-slate-950/60 px-4 py-2 rounded-full border border-slate-700 z-10 flex items-center gap-2">
             <Mic className={`w-4 h-4 ${isTurnCritical ? 'text-red-400 animate-pulse' : 'text-indigo-400'}`} />
             <span className={`text-2xl font-mono font-bold ${isTurnCritical ? 'text-red-400' : 'text-indigo-400'}`}>
               {turnTimeLeft}
             </span>
             <span className="text-xs text-slate-500 self-end mb-1">sn</span>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3 max-w-sm">
          <button 
            onClick={nextTurn}
            disabled={isPaused}
            className="w-full group bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:grayscale text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 border-b-4 border-indigo-800 hover:border-indigo-700 active:border-b-0 active:translate-y-1"
          >
            <span className="flex items-center gap-2">
               TURU BİTİR <SkipForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onImposterGuess}
              disabled={isPaused}
              className="bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 disabled:opacity-50 text-slate-300 py-3 rounded-xl font-bold text-sm flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
            >
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>İmposter Tahmini</span>
            </button>

            <button 
               onClick={onVote}
               disabled={isPaused}
               className="bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 disabled:opacity-50 text-slate-300 py-3 rounded-xl font-bold text-sm flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
            >
              <Gavel className="w-5 h-5 text-purple-500" />
              <span>Acil Oylama</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

const ClockIcon = ({className}: {className: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default GameScreen;
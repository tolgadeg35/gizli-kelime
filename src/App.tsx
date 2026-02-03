import React, { useState } from 'react';
import { GamePhase, GameSettings, Player, Role, SecretData, EndReason } from './types';
import { generateSecretData } from './services/geminiService';
import SetupScreen from './components/SetupScreen';
import RevealScreen from './components/RevealScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.SETUP);
  const [players, setPlayers] = useState<Player[]>([]);
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [secretData, setSecretData] = useState<SecretData | null>(null);
  const [firstPlayerIndex, setFirstPlayerIndex] = useState(0);
  const [endReason, setEndReason] = useState<EndReason | null>(null);

  const handleStartGame = async (playerNames: string[], gameSettings: GameSettings) => {
    setPhase(GamePhase.LOADING);
    
    // 1. Assign Roles
    const newPlayers: Player[] = playerNames.map((name, index) => ({
      id: `p-${index}`,
      name,
      role: Role.CIVILIAN
    }));

    // Randomly assign imposters
    let impostersAssigned = 0;
    while (impostersAssigned < gameSettings.imposterCount) {
      const idx = Math.floor(Math.random() * newPlayers.length);
      if (newPlayers[idx].role === Role.CIVILIAN) {
        newPlayers[idx].role = Role.IMPOSTER;
        impostersAssigned++;
      }
    }
    
    setPlayers(newPlayers);
    setSettings(gameSettings);

    // 2. Generate Secret Word (Local or Gemini)
    // Pass settings so it can filter by category/difficulty
    const secret = await generateSecretData(gameSettings);
    setSecretData(secret);

    // 3. Move to Reveal
    setPhase(GamePhase.REVEAL);
  };

  const handleRevealComplete = () => {
    // Pick random start player
    const startIdx = Math.floor(Math.random() * players.length);
    setFirstPlayerIndex(startIdx);
    setPhase(GamePhase.PLAYING);
  };

  const handleEndGame = (reason: EndReason) => {
    setEndReason(reason);
    setPhase(GamePhase.GAME_OVER);
  };

  const handleImposterGuessTrigger = () => {
    handleEndGame(EndReason.IMPOSTER_GUESS_CORRECT); 
  };

  const handleManualVoteTrigger = () => {
     handleEndGame(EndReason.TOTAL_TIME_UP); 
  };

  const handleRestart = () => {
    setPhase(GamePhase.SETUP);
    setSecretData(null);
    setEndReason(null);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {phase === GamePhase.SETUP && (
        <SetupScreen onStart={handleStartGame} />
      )}

      {phase === GamePhase.LOADING && (
        <div className="h-full flex flex-col items-center justify-center space-y-4 bg-slate-950">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-xl font-medium animate-pulse text-indigo-300">Gizli Kelime Seçiliyor...</p>
        </div>
      )}

      {phase === GamePhase.REVEAL && secretData && settings && (
        <RevealScreen 
          players={players} 
          secretData={secretData} 
          onRevealComplete={handleRevealComplete}
          useHint={settings.useImposterHint}
        />
      )}

      {phase === GamePhase.PLAYING && settings && (
        <GameScreen 
          players={players}
          settings={settings}
          firstPlayerIndex={firstPlayerIndex}
          onEndGame={handleEndGame}
          onImposterGuess={handleImposterGuessTrigger}
          onVote={handleManualVoteTrigger}
        />
      )}

      {phase === GamePhase.GAME_OVER && secretData && endReason && (
        <ResultScreen 
          players={players}
          secretData={secretData}
          endReason={endReason}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default App;
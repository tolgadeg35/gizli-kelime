
import React, { useState } from 'react';
import { GameSettings, Difficulty } from '../types';
import { CATEGORIES } from '../data/wordPool';
import { Plus, X, Users, Clock, BrainCircuit, Check, Layers, BarChart, Info, Trash2 } from 'lucide-react';

interface SetupScreenProps {
  onStart: (players: string[], settings: GameSettings) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [players, setPlayers] = useState<string[]>(['Oyuncu 1', 'Oyuncu 2', 'Oyuncu 3', 'Oyuncu 4']);
  const [newName, setNewName] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [settings, setSettings] = useState<GameSettings>({
    totalTimeSeconds: 300,
    turnTimeSeconds: 15,
    imposterCount: 1,
    useImposterHint: true,
    categories: [],
    difficulty: Difficulty.RANDOM
  });

  const addPlayer = () => {
    if (newName.trim()) {
      setPlayers([...players, newName.trim()]);
      setNewName('');
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const toggleCategory = (cat: string) => {
    if (settings.categories.includes(cat)) {
      setSettings({...settings, categories: settings.categories.filter(c => c !== cat)});
    } else {
      setSettings({...settings, categories: [...settings.categories, cat]});
    }
  };
  
  const clearCategories = () => {
    setSettings({...settings, categories: []});
  };

  const handleStart = () => {
    if (players.length < 3) return alert("En az 3 oyuncu gerekli!");
    if (players.length <= settings.imposterCount) return alert("İmposter sayısı oyuncu sayısından az olmalı!");
    onStart(players, settings);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 relative">
      
      {/* Header */}
      <div className="p-6 pb-2 relative flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight">
            GİZLİ KELİME
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Imposter'ı Bul</p>
        </div>
        
        {/* Info Button */}
        <button 
          onClick={() => setShowInfo(true)}
          className="absolute right-6 top-6 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pb-32">
        
        {/* Players Card */}
        <section className="bg-slate-900/50 backdrop-blur-sm p-5 rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Oyuncular ({players.length})
          </h2>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Oyuncu adı..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
            />
            <button 
              onClick={addPlayer}
              className="bg-indigo-600 hover:bg-indigo-500 w-12 rounded-xl flex items-center justify-center transition-colors text-white"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {players.map((p, i) => (
              <div key={i} className="group flex items-center gap-2 bg-slate-800 border border-slate-700 hover:border-slate-600 pl-3 pr-2 py-1.5 rounded-lg transition-all">
                <span className="font-medium text-slate-300">{p}</span>
                <button onClick={() => removePlayer(i)} className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-700/50 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Game Settings Card */}
        <section className="bg-slate-900/50 backdrop-blur-sm p-5 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-pink-400" />
            Zamanlama
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs text-slate-500 font-bold mb-2 block">TOPLAM SÜRE</label>
              <div className="flex items-center gap-3">
                 <input 
                  type="range" min="60" max="600" step="30"
                  value={settings.totalTimeSeconds}
                  onChange={(e) => setSettings({...settings, totalTimeSeconds: Number(e.target.value)})}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-indigo-400 font-mono font-bold w-8 text-right">
                  {settings.totalTimeSeconds / 60}dk
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-bold mb-2 block">TUR SÜRESİ</label>
              <div className="flex items-center gap-3">
                 <input 
                  type="range" min="5" max="60" step="5"
                  value={settings.turnTimeSeconds}
                  onChange={(e) => setSettings({...settings, turnTimeSeconds: Number(e.target.value)})}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <span className="text-pink-400 font-mono font-bold w-8 text-right">
                  {settings.turnTimeSeconds}s
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories & Difficulty */}
        <section className="bg-slate-900/50 backdrop-blur-sm p-5 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          
          {/* Difficulty */}
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
               <BarChart className="w-4 h-4 text-emerald-400" />
               Zorluk Seviyesi
            </h2>
            <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
               {Object.values(Difficulty).map((diff) => (
                 <button
                    key={diff}
                    onClick={() => setSettings({...settings, difficulty: diff})}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                      settings.difficulty === diff 
                      ? 'bg-emerald-600 text-white shadow-lg' 
                      : 'text-slate-500 hover:text-slate-300'
                    }`}
                 >
                   {diff}
                 </button>
               ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Kategoriler
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600">
                  {settings.categories.length === 0 ? "Hepsi Dahil" : `${settings.categories.length} Seçili`}
                </span>
                {settings.categories.length > 0 && (
                  <button 
                    onClick={clearCategories}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors border border-slate-700 hover:border-red-500/50"
                    title="Seçimi Temizle"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
               {CATEGORIES.map(cat => {
                 const isSelected = settings.categories.includes(cat);
                 return (
                   <button
                     key={cat}
                     onClick={() => toggleCategory(cat)}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        isSelected 
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' 
                        : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600'
                     }`}
                   >
                     {cat}
                   </button>
                 )
               })}
            </div>
          </div>

        </section>

        {/* Imposter Settings */}
        <section className="bg-slate-900/50 backdrop-blur-sm p-5 rounded-2xl border border-slate-800 shadow-xl">
           <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-red-400" />
            İmposter Ayarları
           </h2>
           
           <div className="flex items-center justify-between mb-4">
              <span className="text-slate-300 font-medium">İmposter Sayısı</span>
              <div className="flex gap-1">
                {[1, 2, 3].map(num => (
                  <button
                    key={num}
                    onClick={() => setSettings({...settings, imposterCount: num})}
                    className={`w-8 h-8 rounded-lg font-bold text-sm border transition-all ${
                      settings.imposterCount === num 
                      ? 'bg-red-600 border-red-500 text-white' 
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
           </div>

           <div className="flex items-center justify-between cursor-pointer" onClick={() => setSettings({...settings, useImposterHint: !settings.useImposterHint})}>
             <div className="flex flex-col">
               <span className="text-slate-300 font-medium">İpucu Modu</span>
               <span className="text-xs text-slate-500">İmposter yakın bir kelime görür</span>
             </div>
             <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.useImposterHint ? 'bg-red-500' : 'bg-slate-700'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${settings.useImposterHint ? 'translate-x-7' : 'translate-x-1'}`} />
             </div>
           </div>
        </section>

      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-10">
        <button
          onClick={handleStart}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl text-lg shadow-xl shadow-indigo-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <PlayIcon className="w-6 h-6 fill-current" />
          OYUNU BAŞLAT
        </button>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl">
            
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
               <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
                 <Info className="w-5 h-5" />
                 Oyun Rehberi
               </h3>
               <button onClick={() => setShowInfo(false)} className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 transition-colors">
                 <X className="w-6 h-6" />
               </button>
            </div>

            <div className="p-6 overflow-y-auto no-scrollbar text-sm space-y-6 text-slate-300 leading-relaxed">
              
              <section>
                <h4 className="font-bold text-white text-base mb-2">🕵️ Gizli Kelime (Imposter)</h4>
                <p>Gizli Kelime, arkadaşlarınızla oynayabileceğiniz, blöf yeteneğinizi ve yaratıcılığınızı test eden heyecan verici bir sosyal çıkarım oyunudur. Amaç basit: Siviller aralarındaki ajanı bulmaya çalışırken, Imposter (Casus) ise gizli kelimeyi tahmin etmeye ve kendini gizlemeye çalışır.</p>
              </section>

              <section>
                <h4 className="font-bold text-white text-base mb-2">🎭 Roller</h4>
                <ul className="list-disc pl-5 space-y-2 marker:text-indigo-500">
                  <li><strong className="text-green-400">Siviller:</strong> Oyunun başında belirlenen "Gizli Kelime"yi bilirler. Amaçları, kelimeyi açık etmeden bu kelimeyle ilgili ipuçları vererek Imposter'ı tespit etmektir.</li>
                  <li><strong className="text-red-400">Imposter:</strong> Gizli kelimeyi bilmez. Amacı, diğer oyuncuların verdiği ipuçlarını dinleyerek kelimeyi tahmin etmek ve tur boyunca sivil gibi davranıp yakalanmamaktır.</li>
                  <li><strong className="text-yellow-400">İpucu Modu:</strong> Eğer ayarlarda açıksa, Imposter tamamen habersiz olmaz; gizli kelimeye çok yakın ama yanlış bir kelime görür (Örn: Gizli kelime "Elma" ise, Imposter "Armut" görebilir).</li>
                </ul>
              </section>

              <section>
                <h4 className="font-bold text-white text-base mb-2">🎮 Nasıl Oynanır?</h4>
                <ol className="list-decimal pl-5 space-y-2 marker:text-pink-500">
                  <li><strong>Hazırlık:</strong> Telefonu sırayla elinize alıp ekranı yukarı kaydırarak rolünüzü öğrenirsiniz.</li>
                  <li><strong>İpucu Turu:</strong> Sırası gelen oyuncu, gizli kelimeyle alakalı tek bir kelime söyler.
                    <div className="mt-1 pl-2 border-l-2 border-slate-700 text-slate-400 italic text-xs">
                      Çok açık olursanız Imposter kelimeyi anlar. Çok kapalı olursanız siviller sizi Imposter sanabilir.
                    </div>
                  </li>
                  <li><strong>Süreler:</strong> Her oyuncunun konuşmak için kısıtlı süresi vardır. Süre dolarsa oyun biter!</li>
                </ol>
              </section>

              <section>
                <h4 className="font-bold text-white text-base mb-2">🏆 Nasıl Kazanılır?</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <p className="font-bold text-green-400 mb-1">Siviller Kazanırsa:</p>
                    <ul className="text-xs list-disc pl-4 space-y-1">
                      <li>Oylamada Imposter'ı bulurlarsa.</li>
                      <li>Imposter süre içinde konuşamazsa.</li>
                      <li>Imposter yanlış tahmin yaparsa.</li>
                    </ul>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <p className="font-bold text-red-400 mb-1">Imposter Kazanırsa:</p>
                    <ul className="text-xs list-disc pl-4 space-y-1">
                      <li>Siviller oylamada yanlış kişiyi seçerse.</li>
                      <li>Gizli kelimeyi doğru tahmin ederse.</li>
                      <li>Bir sivil süresi içinde konuşamazsa.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="font-bold text-white text-base mb-2">💡 Taktikler</h4>
                <ul className="list-disc pl-5 space-y-2 marker:text-amber-500">
                  <li><strong>Siviller:</strong> Kendi aranızda sadece sizin anlayabileceğiniz kültürel referanslar veya ortak anılarınıza dayalı kelimeler kullanın.</li>
                  <li><strong>Imposter:</strong> Son sıralarda konuşmak avantajdır. Eğer fikriniz yoksa, önceki oyuncunun kelimesine yakın genel bir kelime söyleyin.</li>
                </ul>
              </section>

            </div>
            
            <div className="p-4 border-t border-slate-800 bg-slate-900 rounded-b-2xl">
              <button onClick={() => setShowInfo(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors">
                ANLADIM
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

const PlayIcon = ({className}: {className: string}) => (
  <svg viewBox="0 0 24 24" className={className}><path d="M8 5v14l11-7z"/></svg>
);

export default SetupScreen;

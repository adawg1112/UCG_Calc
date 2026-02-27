import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'motion/react';

export type Player = {
  id: string;
  name: string;
  score: number;
  avatar: string;
};

export type CardData = {
  id: string;
  value: number | null;
};

const PRESET_AVATARS = [
  '/avatar1.png',
  '/avatar2.png',
  '/avatar3.png',
  '/avatar4.png',
  '/avatar5.png'
];

const THEMES = [
  { name: 'Default', main: '#6d1818', accent: '#d4af37' },
  { name: 'Arborial', main: '#2E8B57', accent: '#80461B' },
  { name: 'Aquatic', main: '#23297A', accent: '#40E0D0' },
  { name: 'Galaxy', main: '#191970', accent: '#FFFFE0' },
  { name: 'Chrono', main: '#6A0DAD', accent: '#FFDA03' },
];

function Calculator({ isOpen, initialValue, onClose, onSave }: any) {
  const [input, setInput] = useState(initialValue || '0');
  const inputRef = useRef(input);

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    if (isOpen) {
      setInput(initialValue || '0');
      
      const handleKeyDown = (e: KeyboardEvent) => {
        const key = e.key;
        if (key >= '0' && key <= '9') {
          handlePress(key);
        } else if (key === '+') {
          handlePress('+');
        } else if (key === '-') {
          handlePress('-');
        } else if (key === '*' || key === 'x') {
          handlePress('×');
        } else if (key === '/') {
          handlePress('÷');
        } else if (key === 'Enter') {
          handleCheck();
        } else if (key === 'Escape') {
          onClose();
        } else if (key === 'Backspace') {
          setInput(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        } else if (key === 'c' || key === 'C') {
          handleClear();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handlePress = (val: string) => {
    setInput(prev => {
      if (prev === '0' && !isNaN(Number(val))) {
        return val;
      } else {
        return prev + val;
      }
    });
  };

  const handleClear = () => setInput('0');

  const handleCheck = () => {
    const currentInput = inputRef.current;
    try {
      if (!currentInput || currentInput === '0') {
        onSave(0);
        return;
      }
      const expression = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      let result = Math.floor(eval(expression)); 
      if (isNaN(result) || !isFinite(result)) result = 0;
      if (result < 0) result = 0;
      onSave(result);
    } catch (e) {
      let fallback = parseInt(currentInput) || 0;
      if (fallback < 0) fallback = 0;
      onSave(fallback);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 font-trajan" onClick={() => onClose()}>
      <div className="flex flex-col landscape:flex-row items-center justify-center gap-6 md:gap-10 animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
        
        <div className="relative aspect-[60/90] w-40 md:w-56 landscape:w-28 landscape:md:w-40 rounded-xl border-4 border-gold-accent bg-marble-red bg-cover overflow-hidden shadow-[0_0_50px_var(--theme-accent)] card-shadow shrink-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596541624738-4e89759d57a9?q=80&w=2574&auto=format&fit=crop')] opacity-80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <span className="text-5xl md:text-8xl landscape:text-4xl landscape:md:text-6xl font-bold gold-metallic-text font-trajan leading-none drop-shadow-2xl text-center px-2 break-all">{input}</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-4 gap-2 md:gap-4 p-2 md:p-4 shrink-0 landscape:gap-1 landscape:p-1">
          {['1','2','3','+','4','5','6','-','7','8','9','×'].map(btn => (
            <button 
              key={btn}
              onClick={() => handlePress(btn)}
              className={`calculator-btn h-12 w-12 md:h-20 md:w-20 landscape:h-8 landscape:w-8 landscape:md:h-12 landscape:md:w-12 rounded-[2rem] flex items-center justify-center text-xl md:text-3xl landscape:text-base font-bold text-white shadow-lg ${['+','-','×'].includes(btn) ? 'bg-white/40' : ''}`}
            >
              {btn}
            </button>
          ))}
          
          <button onClick={handleClear} className="calculator-btn h-12 w-12 md:h-20 md:w-20 landscape:h-8 landscape:w-8 landscape:md:h-12 landscape:md:w-12 rounded-[2rem] flex items-center justify-center text-sm md:text-xl landscape:text-[10px] font-bold text-white/80 shadow-lg bg-red-900/40 hover:bg-red-900/60 uppercase tracking-widest">
            C
          </button>
          <button onClick={() => handlePress('0')} className="calculator-btn h-12 w-12 md:h-20 md:w-20 landscape:h-8 landscape:w-8 landscape:md:h-12 landscape:md:w-12 rounded-[2rem] flex items-center justify-center text-xl md:text-3xl landscape:text-base font-bold text-white shadow-lg">
            0
          </button>
          <button onClick={handleCheck} className="calculator-btn h-12 w-12 md:h-20 md:w-20 landscape:h-8 landscape:w-8 landscape:md:h-12 landscape:md:w-12 rounded-[2rem] flex items-center justify-center text-xl font-bold text-gold-opaque shadow-lg bg-gold-accent/20 hover:bg-gold-accent/40">
            <span className="material-symbols-outlined text-2xl md:text-4xl landscape:text-lg" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>check</span>
          </button>
          <button onClick={() => handlePress('÷')} className="calculator-btn h-12 w-12 md:h-20 md:w-20 landscape:h-8 landscape:w-8 landscape:md:h-12 landscape:md:w-12 rounded-[2rem] flex items-center justify-center text-xl md:text-3xl landscape:text-base font-bold text-white shadow-lg bg-white/40">
            ÷
          </button>
        </div>
      </div>
    </div>
  );
}

function Points({ players, setPlayers, onBack, onReset, isDarkMode, toggleDarkMode, cycle, setCycle, currentTheme, setTheme }: any) {
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [avatarMenuId, setAvatarMenuId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  
  // Store the initial sorted order of player IDs when the component mounts
  const sortedPlayerIds = useRef([...players].sort((a, b) => b.score - a.score).map((p: Player) => p.id));

  // Update ref with any new players so they don't sort in real time
  players.forEach((p: Player) => {
    if (!sortedPlayerIds.current.includes(p.id)) {
      sortedPlayerIds.current.push(p.id);
    }
  });

  // Reconstruct the players array based on the initial sorted order, 
  // appending any new players to the end
  const displayPlayers = [...players].sort((a, b) => {
    const indexA = sortedPlayerIds.current.indexOf(a.id);
    const indexB = sortedPlayerIds.current.indexOf(b.id);
    return indexA - indexB;
  });

  const updateScore = (id: string, delta: number) => {
    setPlayers(players.map((p: Player) => p.id === id ? { ...p, score: p.score + delta } : p));
  };

  const updateName = (id: string, newName: string) => {
    setPlayers(players.map((p: Player) => p.id === id ? { ...p, name: newName } : p));
  };

  const updateAvatar = (id: string, newAvatar: string) => {
    setPlayers(players.map((p: Player) => p.id === id ? { ...p, avatar: newAvatar } : p));
    setAvatarMenuId(null);
  };

  const handleFileUpload = (id: string, e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateAvatar(id, url);
    }
  };

  const addPlayer = () => {
    const newId = String(Date.now());
    setPlayers([...players, {
      id: newId,
      name: `Player ${players.length + 1}`,
      score: 0,
      avatar: PRESET_AVATARS[players.length % PRESET_AVATARS.length]
    }]);
  };

  return (
    <div className={`min-h-[100dvh] font-trajan flex flex-col items-center justify-center relative overflow-x-hidden ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-stone-100'}`}>
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center opacity-100 pointer-events-none transition-all duration-500"
        style={{ backgroundImage: `url('${isDarkMode ? '/BlackMarbleStone.png' : '/WhiteMarbleStone.png'}')` }}
      ></div>
      <div className={`fixed inset-0 z-0 ${isDarkMode ? 'bg-black/20' : 'bg-white/10'} pointer-events-none mix-blend-overlay transition-colors duration-300`}></div>
      
      <div className={`relative z-10 w-full max-w-md md:max-w-2xl lg:max-w-4xl h-[100dvh] flex flex-col shadow-2xl ${isDarkMode ? 'bg-[#2a2a2a]/90' : 'bg-white/80'} backdrop-blur-sm border-x border-gold-accent transition-colors duration-300`}>
        <header 
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
          className={`flex items-center justify-between whitespace-nowrap border-b border-solid border-gold-accent px-4 py-3 md:px-6 md:py-4 ${isDarkMode ? 'bg-[#2a2a2a]/80' : 'bg-white/70'} backdrop-blur-sm shrink-0 transition-colors duration-300`}
        >
          <div className="flex items-center gap-3">
            <h2 className={`text-base md:text-lg font-bold leading-tight font-trajan tracking-widest ${isDarkMode ? 'text-gray-200' : 'text-slate-900'} transition-colors duration-300`}>Ultimate Card Game</h2>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className={`flex items-center justify-center rounded-full w-8 h-8 md:w-10 md:h-10 ${isDarkMode ? 'hover:bg-[#3a3a3a]' : 'hover:bg-stone-200'} transition-colors`}
          >
            <span className="material-symbols-outlined text-gold-accent" style={{ fontSize: '24px' }}>settings</span>
          </button>
        </header>

        <main className="flex-1 flex flex-col p-2 md:p-4 gap-2 overflow-y-auto pb-32">
          <div className="text-center pt-2 pb-2 shrink-0">
            <h1 className={`font-trajan text-2xl md:text-3xl font-bold tracking-widest inline-block border-b-4 border-primary pb-1 ${isDarkMode ? 'text-gray-200' : 'text-slate-900'} transition-colors duration-300`}>
              POINTS
            </h1>
          </div>

          <div className="flex flex-col gap-2">
            {displayPlayers.map((player: Player) => (
              <div key={player.id} className={`${isDarkMode ? 'bg-[#333333] border-[#444444]' : 'bg-white border-stone-200'} rounded-xl border shadow-sm p-2 md:p-3 flex items-center justify-between relative group transition-colors duration-300`}>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-accent rounded-l-xl"></div>
                
                <div className="flex items-center gap-3 flex-1 pl-2">
                  <div className="relative">
                    <div 
                      className="relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-stone-200 overflow-hidden shadow-inner cursor-pointer group shrink-0"
                      onClick={() => setAvatarMenuId(avatarMenuId === player.id ? null : player.id)}
                    >
                      <img src={player.avatar} alt={player.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                    </div>
                    
                    {avatarMenuId === player.id && (
                      <div className={`absolute top-12 left-0 ${isDarkMode ? 'bg-[#2a2a2a] border-[#444444]' : 'bg-white border-stone-200'} border shadow-xl rounded-lg p-2 z-50 flex gap-2 w-max transition-colors duration-300`}>
                        {PRESET_AVATARS.map((av, i) => (
                          <img key={i} src={av} alt="preset" className={`w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-transform border ${isDarkMode ? 'border-[#444444]' : 'border-stone-200'}`} onClick={() => updateAvatar(player.id, av)} />
                        ))}
                        <label className={`w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-transform border ${isDarkMode ? 'border-[#444444] bg-[#3a3a3a]' : 'border-stone-200 bg-stone-100'} flex items-center justify-center`}>
                          <span className={`material-symbols-outlined text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>upload</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(player.id, e)} />
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1">
                    {editingNameId === player.id ? (
                      <input 
                        type="text" 
                        value={player.name}
                        onChange={(e) => updateName(player.id, e.target.value)}
                        onBlur={() => setEditingNameId(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingNameId(null)}
                        autoFocus
                        className={`font-trajan font-bold text-sm md:text-lg ${isDarkMode ? 'text-gray-200 bg-[#2a2a2a]' : 'text-slate-900 bg-stone-100'} border-b border-gold-accent outline-none px-1 w-full max-w-[120px] md:max-w-[150px] transition-colors duration-300`}
                      />
                    ) : (
                      <h3 
                        className={`font-trajan font-bold text-sm md:text-lg ${isDarkMode ? 'text-gray-200' : 'text-slate-900'} cursor-pointer hover:text-gold-accent transition-colors truncate max-w-[120px] md:max-w-[200px]`}
                        onClick={() => setEditingNameId(player.id)}
                      >
                        {player.name}
                      </h3>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 md:gap-2 shrink-0">
                  <button onClick={() => updateScore(player.id, -1)} className="text-gold-accent hover:text-primary transition-colors p-1">
                    <span className="material-symbols-outlined text-lg md:text-xl">remove</span>
                  </button>
                  <div className="bg-card-red text-white w-10 h-12 md:w-14 md:h-16 rounded-lg flex items-center justify-center shadow-md border-2 border-primary/30 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 pointer-events-none"></div>
                    <span className="text-lg md:text-2xl font-bold font-trajan z-10">{player.score}</span>
                  </div>
                  <button onClick={() => updateScore(player.id, 1)} className="text-gold-accent hover:text-primary transition-colors p-1">
                    <span className="material-symbols-outlined text-lg md:text-xl">add</span>
                  </button>
                </div>
              </div>
            ))}

            {players.length < 10 && (
              <button onClick={addPlayer} className={`w-full mt-1 group relative overflow-hidden rounded-xl border-2 border-primary/40 ${isDarkMode ? 'bg-[#333333]' : 'bg-white'} p-2 md:p-3 flex items-center justify-center gap-2 transition-all hover:bg-primary/5 active:scale-[0.98]`}>
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-slate-900 font-bold text-sm">add</span>
                </div>
                <span className={`font-trajan font-bold ${isDarkMode ? 'text-gray-200' : 'text-slate-900'} tracking-wider text-xs md:text-sm transition-colors duration-300`}>Add New Player</span>
              </button>
            )}
          </div>
        </main>

        <footer 
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.5rem)' }}
          className={`absolute bottom-0 left-0 right-0 z-20 ${isDarkMode ? 'bg-[#222222]/90 border-[#333]' : 'bg-white/90 border-stone-200'} backdrop-blur-xl border-t p-2 md:p-3 shrink-0 transition-colors duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] landscape:p-1`}
        >
          <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
            <button onClick={onReset} className={`flex-1 flex items-center justify-center gap-2 h-10 md:h-12 rounded-2xl ${isDarkMode ? 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333] hover:text-white border border-[#444]' : 'bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'} font-bold transition-all uppercase tracking-wider text-xs md:text-sm font-trajan shadow-sm`}>
              <span className="material-symbols-outlined text-lg">restart_alt</span>
              Reset
            </button>
            <div className={`flex-[1.2] flex items-center justify-between px-2 h-10 md:h-12 rounded-full ${isDarkMode ? 'bg-[#111] border border-[#333]' : 'bg-stone-100 border border-stone-200'} shadow-inner transition-colors`}>
              <button onClick={() => setCycle(Math.max(1, cycle - 1))} className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'hover:bg-[#222] text-gray-400 hover:text-gold-accent' : 'hover:bg-white text-stone-500 hover:text-gold-accent'} transition-all shadow-sm`}>
                <span className="material-symbols-outlined text-sm md:text-base">chevron_left</span>
              </button>
              <div className="flex flex-col items-center justify-center">
                <span className={`text-[7px] md:text-[8px] font-sans font-bold tracking-[0.2em] ${isDarkMode ? 'text-gray-500' : 'text-stone-400'} leading-none mb-0.5`}>CYCLE</span>
                <span className={`font-trajan text-base md:text-lg font-bold leading-none ${isDarkMode ? 'text-gold-accent' : 'text-slate-800'}`}>{cycle}</span>
              </div>
              <button onClick={() => setCycle(cycle + 1)} className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'hover:bg-[#222] text-gray-400 hover:text-gold-accent' : 'hover:bg-white text-stone-500 hover:text-gold-accent'} transition-all shadow-sm`}>
                <span className="material-symbols-outlined text-sm md:text-base">chevron_right</span>
              </button>
            </div>
            <button onClick={onBack} className="flex-1 flex items-center justify-center gap-2 h-10 md:h-12 rounded-2xl bg-gradient-to-b from-gold-accent to-primary-dark text-black font-bold shadow-lg hover:shadow-xl hover:brightness-110 transition-all uppercase tracking-wider text-xs md:text-sm font-trajan border border-primary-dark">
              <span className="material-symbols-outlined text-lg">swords</span>
              DUEL
            </button>
          </div>
        </footer>

        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`w-full max-w-sm rounded-2xl border-2 border-gold-accent ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-white'} shadow-2xl overflow-hidden flex flex-col`}>
              <div className={`flex justify-between items-center p-4 border-b ${isDarkMode ? 'border-[#444444]' : 'border-stone-200'}`}>
                <h3 className={`font-trajan font-bold text-lg tracking-widest ${isDarkMode ? 'text-gray-200' : 'text-slate-900'}`}>Settings</h3>
                <button onClick={() => setIsSettingsOpen(false)} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-[#3a3a3a] text-gray-400' : 'hover:bg-stone-100 text-stone-500'} transition-colors`}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-2 flex flex-col gap-1">
                <button className={`flex items-center gap-3 w-full p-3 rounded-xl ${isDarkMode ? 'hover:bg-[#3a3a3a] text-gray-200' : 'hover:bg-stone-100 text-slate-800'} transition-colors text-left`}>
                  <span className="material-symbols-outlined text-gold-accent">menu_book</span>
                  <span className="font-sans font-medium">Rules & Rulings</span>
                </button>
                <button 
                  onClick={toggleDarkMode}
                  className={`flex items-center justify-between w-full p-3 rounded-xl ${isDarkMode ? 'hover:bg-[#3a3a3a] text-gray-200' : 'hover:bg-stone-100 text-slate-800'} transition-colors text-left`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gold-accent">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                    <span className="font-sans font-medium">Dark Mode</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'bg-gold-accent' : 'bg-stone-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                </button>
                <button 
                  onClick={() => setIsThemeMenuOpen(true)}
                  className={`flex items-center gap-3 w-full p-3 rounded-xl ${isDarkMode ? 'hover:bg-[#3a3a3a] text-gray-200' : 'hover:bg-stone-100 text-slate-800'} transition-colors text-left`}
                >
                  <span className="material-symbols-outlined text-gold-accent">palette</span>
                  <span className="font-sans font-medium">Select Theme</span>
                </button>
                <button className={`flex items-center gap-3 w-full p-3 rounded-xl ${isDarkMode ? 'hover:bg-[#3a3a3a] text-gray-200' : 'hover:bg-stone-100 text-slate-800'} transition-colors text-left`}>
                  <span className="material-symbols-outlined text-gold-accent opacity-0">circle</span>
                  <span className="font-sans font-medium opacity-50 italic">Coming Soon</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {isThemeMenuOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`w-full max-w-sm rounded-2xl border-2 border-gold-accent ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-white'} shadow-2xl overflow-hidden flex flex-col`}>
              <div className={`flex justify-between items-center p-4 border-b ${isDarkMode ? 'border-[#444444]' : 'border-stone-200'}`}>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsThemeMenuOpen(false)} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-[#3a3a3a] text-gray-400' : 'hover:bg-stone-100 text-stone-500'} transition-colors`}>
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <h3 className={`font-trajan font-bold text-lg tracking-widest ${isDarkMode ? 'text-gray-200' : 'text-slate-900'}`}>Themes</h3>
                </div>
                <button onClick={() => { setIsThemeMenuOpen(false); setIsSettingsOpen(false); }} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-[#3a3a3a] text-gray-400' : 'hover:bg-stone-100 text-stone-500'} transition-colors`}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-2 flex flex-col gap-1">
                {THEMES.map((t) => (
                  <button 
                    key={t.name}
                    onClick={() => setTheme(t)}
                    className={`flex items-center justify-between w-full p-3 rounded-xl transition-colors ${currentTheme.name === t.name ? (isDarkMode ? 'bg-[#3a3a3a]' : 'bg-stone-100') : (isDarkMode ? 'hover:bg-[#333]' : 'hover:bg-stone-50')}`}
                  >
                    <span className={`font-sans font-medium ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>{t.name}</span>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full border border-black" style={{ backgroundColor: t.main }}></div>
                      <div className="w-6 h-6 rounded-full border border-black" style={{ backgroundColor: t.accent }}></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Landing({ topCards, bottomCards, onOpenCalc, onOpenPoints, onReset, onDragEnd, isDarkMode, round, setRound, isResetting }: any) {
  const renderSection = (cards: CardData[], section: 'top' | 'bottom') => {
    const hasEditedCards = cards.some(c => c.value !== null);
    const total = cards.reduce((sum, c) => sum + (c.value || 0), 0);
    
    const totalElement = hasEditedCards ? (
      <motion.div 
        animate={isResetting ? { 
          opacity: 0, 
          scale: 0.8, 
          filter: "brightness(2) saturate(2) blur(10px)",
          y: -20
        } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[120px] md:max-w-[160px] relative h-8 md:h-10 rounded-lg md:rounded-xl overflow-hidden border-2 border-gold-accent card-shadow gold-bg-metallic flex items-center justify-center shrink-0 z-50"
      >
        <span className="red-marble-text text-xl md:text-2xl font-bold tracking-tight font-trajan leading-none">{total}</span>
      </motion.div>
    ) : null;

    return (
      <section className="flex-1 flex flex-col justify-center items-center py-1 px-1 md:px-2 gap-1 md:gap-2 w-full min-h-0 overflow-hidden landscape:py-0 landscape:gap-0.5">
        {section === 'top' && totalElement}
        
        <Droppable droppableId={section} direction="horizontal">
          {(provided) => (
            <div 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-row flex-nowrap justify-center items-center gap-1 md:gap-2 w-full px-1 md:px-2 min-h-0 flex-1 h-full landscape:gap-0.5"
            >
              {cards.map((card, idx) => {
                const DraggableComponent = Draggable as any;
                const isPlusCard = card.value === null;
                const shouldAnimate = !isPlusCard && isResetting;

                return (
                <DraggableComponent key={card.id} draggableId={card.id} index={idx} isDragDisabled={isPlusCard || isResetting}>
                  {(provided: any, snapshot: any) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex-1 min-w-0 flex items-center justify-center h-full @container ${snapshot.isDragging ? 'dragging' : ''}`}
                      style={{
                        ...provided.draggableProps.style,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <motion.div
                        className="w-full h-full flex items-center justify-center"
                        animate={snapshot.isDragging ? {
                          scale: 1.1,
                          rotate: 2,
                          filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))"
                        } : shouldAnimate ? {
                          scale: [1, 1.1, 0.9],
                          opacity: [1, 1, 0],
                          y: [0, -10, -40],
                          rotate: [0, 2, -2, 0],
                          filter: [
                            "brightness(1) saturate(1) blur(0px)",
                            "brightness(2) saturate(4) contrast(1.5) drop-shadow(0 0 15px #ff4500) blur(2px)",
                            "brightness(0) blur(10px)"
                          ]
                        } : { scale: 1, opacity: 1, y: 0, filter: "none", rotate: 0 }}
                        transition={shouldAnimate ? { duration: 0.8, ease: "easeIn" } : { type: "spring", stiffness: 400, damping: 30 }}
                      >
                        {!isPlusCard ? (
                          <div 
                            onClick={() => !isResetting && onOpenCalc(section, idx, String(card.value))}
                            className="relative w-full aspect-[60/90] max-w-[calc(100cqh*0.666)] rounded-md md:rounded-xl border-2 md:border-4 border-gold-accent bg-marble-red bg-cover overflow-hidden shadow-lg card-shadow cursor-pointer hover:scale-105 transition-transform flex items-center justify-center"
                          >
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596541624738-4e89759d57a9?q=80&w=2574&auto=format&fit=crop')] opacity-80 mix-blend-multiply"></div>
                            <span className="relative z-10 font-bold gold-metallic-text font-trajan leading-none" style={{ fontSize: 'min(40cqw, 8cqh)' }}>{card.value}</span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => !isResetting && onOpenCalc(section, idx, '')}
                            className="group relative w-full aspect-[60/90] max-w-[calc(100cqh*0.666)] rounded-md md:rounded-xl border-2 md:border-4 border-gold-accent bg-marble-red bg-cover overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 card-shadow flex items-center justify-center disabled:opacity-50"
                            disabled={isResetting}
                          >
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596541624738-4e89759d57a9?q=80&w=2574&auto=format&fit=crop')] opacity-80 mix-blend-multiply"></div>
                            <span className="relative z-10 material-symbols-outlined gold-metallic-text drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1", fontSize: 'min(40cqw, 8cqh)' }}>add_circle</span>
                            <div className="absolute inset-0 border-2 md:border-4 border-gold-accent/20 rounded-lg pointer-events-none"></div>
                          </button>
                        )}
                      </motion.div>
                    </div>
                  )}
                </DraggableComponent>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {section === 'bottom' && totalElement}
      </section>
    );
  };

  return (
    <div className={`h-[100dvh] font-trajan flex flex-col items-center justify-center relative overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-stone-100'}`}>
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center opacity-100 pointer-events-none transition-all duration-500"
        style={{ backgroundImage: `url('${isDarkMode ? '/BlackMarbleStone.png' : '/WhiteMarbleStone.png'}')` }}
      ></div>
      <div className={`fixed inset-0 z-0 ${isDarkMode ? 'bg-black/20' : 'bg-white/10'} pointer-events-none mix-blend-overlay transition-colors duration-300`}></div>
      
      <div className={`relative z-10 w-full max-w-full md:max-w-4xl lg:max-w-6xl xl:max-w-7xl h-full flex flex-col shadow-2xl ${isDarkMode ? 'bg-[#2a2a2a]/90' : 'bg-white/80'} backdrop-blur-sm border-x border-gold-accent transition-colors duration-300`}>
        <header 
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
          className={`flex items-center justify-center px-2 py-1 md:px-4 md:py-2 border-b-2 border-gold-accent ${isDarkMode ? 'bg-[#2a2a2a]/80' : 'bg-white/70'} backdrop-blur-md shrink-0 transition-colors duration-300 landscape:hidden`}
        >
          <h1 className={`text-xs md:text-sm lg:text-base font-bold ${isDarkMode ? 'text-gray-200' : 'text-slate-900'} uppercase tracking-[0.1em] font-trajan text-center leading-tight max-w-[90%] mx-auto transition-colors duration-300`}>
            ULTIMATE CARD GAME<br/>CALCULATOR COMPANION
          </h1>
        </header>

        <DragDropContext onDragEnd={onDragEnd}>
          <main className="flex-1 flex flex-col relative overflow-hidden pb-32 md:pb-40 pt-2 md:pt-3 landscape:pb-16 landscape:pt-1">
            {renderSection(topCards, 'top')}
            
            <div className="relative w-full shrink-0 my-1 landscape:my-0.5">
              <div className="h-1 md:h-2 w-full bg-gold-accent shadow-[0_0_10px_var(--theme-accent)] border-y border-primary-dark landscape:h-0.5"></div>
            </div>
            
            {renderSection(bottomCards, 'bottom')}
          </main>
        </DragDropContext>

        <footer 
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.5rem)' }}
          className={`absolute bottom-0 left-0 right-0 z-20 ${isDarkMode ? 'bg-[#222222]/90 border-[#333]' : 'bg-white/90 border-stone-200'} backdrop-blur-xl border-t p-2 md:p-3 shrink-0 transition-colors duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] landscape:p-1`}
        >
          <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
            <button onClick={onReset} className={`flex-1 flex items-center justify-center gap-2 h-10 md:h-12 rounded-2xl ${isDarkMode ? 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333] hover:text-white border border-[#444]' : 'bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'} font-bold transition-all uppercase tracking-wider text-xs md:text-sm font-trajan shadow-sm`}>
              <span className="material-symbols-outlined text-lg">restart_alt</span>
              Reset
            </button>
            
            <div className={`flex-[1.2] flex items-center justify-between px-2 h-10 md:h-12 rounded-full ${isDarkMode ? 'bg-[#111] border border-[#333]' : 'bg-stone-100 border border-stone-200'} shadow-inner transition-colors`}>
              <button onClick={() => setRound(Math.max(1, round - 1))} className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'hover:bg-[#222] text-gray-400 hover:text-gold-accent' : 'hover:bg-white text-stone-500 hover:text-gold-accent'} transition-all shadow-sm`}>
                <span className="material-symbols-outlined text-sm md:text-base">chevron_left</span>
              </button>
              <div className="flex flex-col items-center justify-center">
                <span className={`text-[7px] md:text-[8px] font-sans font-bold tracking-[0.2em] ${isDarkMode ? 'text-gray-500' : 'text-stone-400'} leading-none mb-0.5`}>ROUND</span>
                <span className={`font-trajan text-base md:text-lg font-bold leading-none ${isDarkMode ? 'text-gold-accent' : 'text-slate-800'}`}>{round}</span>
              </div>
              <button onClick={() => setRound(round + 1)} className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'hover:bg-[#222] text-gray-400 hover:text-gold-accent' : 'hover:bg-white text-stone-500 hover:text-gold-accent'} transition-all shadow-sm`}>
                <span className="material-symbols-outlined text-sm md:text-base">chevron_right</span>
              </button>
            </div>

            <button onClick={onOpenPoints} className="flex-1 flex items-center justify-center gap-2 h-10 md:h-12 rounded-2xl bg-gradient-to-b from-gold-accent to-primary-dark text-black font-bold shadow-lg hover:shadow-xl hover:brightness-110 transition-all uppercase tracking-wider text-xs md:text-sm font-trajan border border-primary-dark">
              <span className="material-symbols-outlined text-lg">leaderboard</span>
              POINTS
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SplashScreen({ onComplete, isDarkMode }: { onComplete: () => void; isDarkMode: boolean }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const bgImage = isDarkMode ? '/BlackMarbleStone.png' : '/WhiteMarbleStone.png';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      onClick={onComplete}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-cover bg-center cursor-pointer"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className="text-center px-4 pointer-events-none">
        <h1 className="font-trajan text-4xl md:text-7xl font-black text-gold-accent leading-tight drop-shadow-[0_0_30px_var(--theme-accent)] tracking-wider">
          <span className="block landscape:inline">ULTIMATE </span>
          <span className="block landscape:inline">CARD GAME</span>
        </h1>
        <div className="w-32 md:w-64 h-px bg-gold-accent mx-auto my-4 md:my-8 opacity-60 shadow-[0_0_10px_var(--theme-accent)]"></div>
        <h1 className="font-trajan text-4xl md:text-7xl font-black text-gold-accent leading-tight drop-shadow-[0_0_30px_var(--theme-accent)] tracking-wider">
          CALCULATOR COMPANION
        </h1>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<'landing' | 'points'>('landing');
  const [isDarkMode, setIsDarkMode] = useState(() => 
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-main', currentTheme.main);
    document.documentElement.style.setProperty('--theme-accent', currentTheme.accent);
  }, [currentTheme]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const [round, setRound] = useState(1);
  const [cycle, setCycle] = useState(1);
  const [isResetting, setIsResetting] = useState(false);
  
  const [topCards, setTopCards] = useState<CardData[]>([{ id: 'init-top', value: null }]);
  const [bottomCards, setBottomCards] = useState<CardData[]>([{ id: 'init-bottom', value: null }]);
  
  const [players, setPlayers] = useState<Player[]>([]);

  const [calcState, setCalcState] = useState<{
    isOpen: boolean;
    targetSection: 'top' | 'bottom' | null;
    targetIndex: number | null;
    initialValue: string;
  }>({ isOpen: false, targetSection: null, targetIndex: null, initialValue: '' });

  const handleOpenCalc = (section: 'top' | 'bottom', index: number, initialValue: string) => {
    setCalcState({ isOpen: true, targetSection: section, targetIndex: index, initialValue });
  };

  const handleSaveCalc = (value: number) => {
    const { targetSection, targetIndex } = calcState;
    
    const updateCards = (cards: CardData[]) => {
      let newCards = [...cards];
      if (targetIndex !== null && targetIndex < newCards.length) {
        newCards[targetIndex].value = value;
        
        let currentIndex = targetIndex;
        
        if (currentIndex === 0 && newCards.length < 10) {
          newCards.unshift({ id: Date.now() + 'L', value: null });
          currentIndex++;
        }
        
        if (currentIndex === newCards.length - 1 && newCards.length < 10) {
          newCards.push({ id: Date.now() + 'R', value: null });
        }
      }
      return newCards;
    };

    if (targetSection === 'top') {
      setTopCards(updateCards(topCards));
    } else if (targetSection === 'bottom') {
      setBottomCards(updateCards(bottomCards));
    }
    setCalcState({ isOpen: false, targetSection: null, targetIndex: null, initialValue: '' });
  };

  const handleResetLanding = () => {
    setIsResetting(true);
    setTimeout(() => {
      setTopCards([{ id: 'init-top', value: null }]);
      setBottomCards([{ id: 'init-bottom', value: null }]);
      setRound(1);
      setIsResetting(false);
    }, 800);
  };

  const handleResetPoints = () => {
    setPlayers([]);
    setCycle(1);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const isTop = source.droppableId === 'top';
      const items = Array.from(isTop ? topCards : bottomCards) as CardData[];
      
      let destIndex = destination.index;
      
      // Prevent dropping outside of plus cards
      if (items[0].value === null && destIndex === 0) {
        destIndex = 1;
      }
      if (items[items.length - 1].value === null && destIndex === items.length - 1) {
        destIndex = items.length - 2;
      }

      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destIndex, 0, reorderedItem);

      if (isTop) {
        setTopCards(items);
      } else {
        setBottomCards(items);
      }
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} isDarkMode={isDarkMode} />
        )}
      </AnimatePresence>

      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="h-full w-full"
        >
          {currentPage === 'landing' ? (
            <Landing 
              topCards={topCards} 
              bottomCards={bottomCards} 
              onOpenCalc={handleOpenCalc} 
              onOpenPoints={() => setCurrentPage('points')}
              onReset={handleResetLanding}
              onDragEnd={handleDragEnd}
              isDarkMode={isDarkMode}
              round={round}
              setRound={setRound}
              isResetting={isResetting}
            />
          ) : (
            <Points 
              players={players} 
              setPlayers={setPlayers} 
              onBack={() => setCurrentPage('landing')} 
              onReset={handleResetPoints}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              cycle={cycle}
              setCycle={setCycle}
              currentTheme={currentTheme}
              setTheme={setCurrentTheme}
            />
          )}
          
          <Calculator 
            isOpen={calcState.isOpen} 
            initialValue={calcState.initialValue} 
            onClose={() => setCalcState({ ...calcState, isOpen: false })} 
            onSave={handleSaveCalc} 
          />
        </motion.div>
      )}
    </>
  );
}

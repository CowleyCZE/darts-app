import React, { useState, useEffect } from 'react';
import { 
  Trophy, User, Settings, ChevronRight, 
  Undo2, Target, Plus, List, Trash2, Play, BarChart3, Users, Check, X, History, Edit2
} from 'lucide-react';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

// --- Komponenty ---

const PlayerManager = ({ players, onAdd, onDelete, onRename }) => {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  const handleAdd = () => {
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName('');
    }
  };

  const startRename = (player) => {
    setEditingId(player.id);
    setEditValue(player.id);
  };

  const submitRename = () => {
    if (editValue.trim() && editValue !== editingId) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <Users size={20} className="text-blue-500" /> Správa hráčů
      </h3>
      <div className="flex gap-2">
        <input 
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Jméno nového hráče"
          className="flex-1 bg-slate-100 dark:bg-slate-700 p-2 rounded-lg outline-none focus:ring-2 ring-blue-500 text-slate-900 dark:text-white"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {players.map(p => (
          <div key={p.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-2 rounded-lg group border border-slate-100 dark:border-slate-800">
            {editingId === p.id ? (
              <div className="flex gap-1 w-full">
                <input 
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 bg-white dark:bg-slate-800 text-sm p-1 rounded border border-blue-500 outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && submitRename()}
                  onBlur={submitRename}
                />
              </div>
            ) : (
              <>
                <span className="truncate font-medium text-sm pl-1">{p.id}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startRename(p)} className="text-slate-400 hover:text-blue-500 p-1">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => onDelete(p.id)} className="text-slate-400 hover:text-red-500 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SetupScreen = ({ 
  availablePlayers, 
  targetSets, setTargetSets, 
  legsPerSet, setLegsPerSet, 
  gameType, setGameType,
  doubleIn, setDoubleIn,
  doubleOut, setDoubleOut,
  startGame,
  onCancel
}) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const togglePlayer = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Settings className="text-blue-500" />
          <h2 className="text-2xl font-bold uppercase tracking-tighter">Nastavení zápasu</h2>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-red-500 transition-colors">
          <X size={24} />
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-2 opacity-50">Hráči (2-4)</label>
          {availablePlayers.length === 0 ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
               <p className="text-xs text-red-600 dark:text-red-400 font-bold">Nejdříve přidejte hráče v hlavním menu!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
              {availablePlayers.map(p => (
                <button
                  key={p.id}
                  onClick={() => togglePlayer(p.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${selectedIds.includes(p.id) ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 font-bold' : 'border-slate-100 dark:border-slate-700'}`}
                >
                  <span className="truncate text-sm">{p.id}</span>
                  {selectedIds.includes(p.id) && <Check size={16} className="text-blue-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-1 opacity-50">Typ hry</label>
            <select 
              value={gameType} 
              onChange={(e) => setGameType(Number(e.target.value))}
              className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-xl font-bold border-none outline-none appearance-none"
            >
              {[301, 401, 501, 701, 801].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest mb-1 opacity-50">Možnosti</label>
            <div className="flex flex-col gap-2">
               <button 
                onClick={() => setDoubleIn(!doubleIn)}
                className={`text-[10px] font-black py-1 px-2 rounded-lg border-2 transition-all ${doubleIn ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-slate-200 opacity-40'}`}
               >
                 DOUBLE IN
               </button>
               <button 
                onClick={() => setDoubleOut(!doubleOut)}
                className={`text-[10px] font-black py-1 px-2 rounded-lg border-2 transition-all ${doubleOut ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-slate-200 opacity-40'}`}
               >
                 DOUBLE OUT
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-1 opacity-50">Sety k výhře</label>
            <select 
              value={targetSets} 
              onChange={(e) => setTargetSets(Number(e.target.value))}
              className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-xl font-bold border-none outline-none"
            >
              {[1, 2, 3, 4, 5, 7, 10].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-1 opacity-50">Legy v setu</label>
            <select 
              value={legsPerSet} 
              onChange={(e) => setLegsPerSet(Number(e.target.value))}
              className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-xl font-bold border-none outline-none"
            >
              {[1, 2, 3, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      </div>

      <button 
        onClick={() => startGame(selectedIds)}
        disabled={selectedIds.length < 2}
        className={`w-full font-black py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest ${selectedIds.length < 2 ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
      >
        Spustit zápas <ChevronRight />
      </button>
    </div>
  );
};

const ScoreBoard = ({ 
  game, recordLegWin, undoLastMove, resetMatch 
}) => {
  const currentTotalLegs = game.history?.length || 0;
  const turnIndex = currentTotalLegs % game.players.length;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm gap-4">
        <button onClick={resetMatch} className="text-slate-500 hover:text-blue-500 flex items-center gap-1 transition-colors">
          <List size={18} /> <span className="text-xs font-black uppercase">MENU</span>
        </button>
        
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-60">
          <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">TYP: {game.gameType || 'X'}</span>
          <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">BEST OF {game.targetSets} SETS</span>
          {game.doubleIn && <span className="text-orange-500">DI</span>}
          {game.doubleOut && <span className="text-orange-500">DO</span>}
        </div>

        <button 
          onClick={undoLastMove} 
          disabled={!game.history || game.history.length === 0}
          className={`flex items-center gap-1 transition-colors ${(!game.history || game.history.length === 0) ? 'opacity-30 cursor-not-allowed' : 'hover:text-blue-500'}`}
        >
          <Undo2 size={18} /> <span className="text-xs font-black uppercase">ZPĚT</span>
        </button>
      </div>

      <div className={`grid gap-4 ${game.players.length > 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
        {game.players.map((playerName, idx) => {
          const isWinning = game.scores[idx].sets === Math.max(...game.scores.map(s => s.sets)) && game.scores[idx].sets > 0;
          const isOnTurn = turnIndex === idx;

          return (
            <div 
              key={idx}
              className={`relative p-6 rounded-3xl transition-all border-4 cursor-pointer active:scale-95 ${isOnTurn ? 'border-orange-500 shadow-xl scale-[1.02]' : 'border-transparent shadow-sm'} ${isWinning ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-slate-800'}`}
              onClick={() => recordLegWin(idx)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-black truncate pr-2 uppercase italic">{playerName}</h3>
                  <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">Hráč {idx + 1}</p>
                </div>
                {isOnTurn && (
                  <div className="bg-orange-500 text-white p-2 rounded-full animate-pulse shadow-lg">
                    <Target size={24} />
                  </div>
                )}
              </div>
              <div className="flex items-end gap-4">
                <div className="text-8xl font-black text-blue-600 dark:text-blue-400 leading-none">{game.scores[idx].sets}</div>
                <div className="mb-2">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-40 text-blue-500">Sety</div>
                  <div className="text-4xl font-black text-slate-400 leading-none">
                    {game.scores[idx].legs} <span className="text-[10px] opacity-50">LEGS</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Hlavní Aplikace ---

const App = () => {
  const [view, setView] = useState('list'); 
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [activeGame, setActiveGame] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tSets, setTSets] = useState(3);
  const [lPerSet, setLPerSet] = useState(3);
  const [gType, setGType] = useState(501);
  const [dIn, setDIn] = useState(false);
  const [dOut, setDOut] = useState(true);

  // --- Načítání dat ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedGames = await localforage.getItem('games') || [];
        const loadedPlayers = await localforage.getItem('players') || [];
        setGames(loadedGames);
        setPlayers(loadedPlayers);
      } catch (err) {
        console.error("Chyba při načítání dat:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- Ukládání dat (pomocné funkce) ---
  const savePlayers = async (newPlayers) => {
    setPlayers(newPlayers);
    await localforage.setItem('players', newPlayers);
  };

  const saveGames = async (newGames) => {
    setGames(newGames);
    await localforage.setItem('games', newGames);
  };

  const addPlayer = async (name) => {
    if (players.some(p => p.id === name)) {
      alert("Hráč s tímto jménem již existuje.");
      return;
    }
    const newPlayer = { id: name, wins: 0, matches: 0, createdAt: Date.now() };
    await savePlayers([...players, newPlayer]);
  };

  const deletePlayer = async (name) => {
    if (window.confirm(`Smazat hráče ${name} a veškeré jeho statistiky?`)) {
      await savePlayers(players.filter(p => p.id !== name));
    }
  };

  const renamePlayer = async (oldName, newName) => {
    if (oldName === newName) return;
    if (players.some(p => p.id === newName)) {
        alert("Jméno již existuje");
        return;
    }

    // 1. Aktualizace seznamu hráčů (přenést statistiky)
    const playerToRename = players.find(p => p.id === oldName);
    const updatedPlayers = players.map(p => 
        p.id === oldName ? { ...p, id: newName } : p
    );
    await savePlayers(updatedPlayers);

    // 2. Aktualizace historie her
    const updatedGames = games.map(g => {
        if (g.players && g.players.includes(oldName)) {
            const updatedPlayerNames = g.players.map(p => p === oldName ? newName : p);
            return {
                ...g,
                players: updatedPlayerNames,
                winner: g.winner === oldName ? newName : g.winner
            };
        }
        return g;
    });
    await saveGames(updatedGames);
  };

  const handleStartGame = async (selectedPlayerIds) => {
    const gameId = uuidv4();
    const newGame = {
      id: gameId,
      players: selectedPlayerIds,
      targetSets: tSets,
      legsPerSet: lPerSet,
      gameType: gType,
      doubleIn: dIn,
      doubleOut: dOut,
      status: 'playing',
      scores: selectedPlayerIds.map(() => ({ sets: 0, legs: 0 })),
      history: [],
      createdAt: Date.now()
    };

    // Aktualizace statistik - počet zápasů
    const updatedPlayers = players.map(p => {
        if (selectedPlayerIds.includes(p.id)) {
            return { ...p, matches: (p.matches || 0) + 1 };
        }
        return p;
    });
    await savePlayers(updatedPlayers);
    
    // Přidání hry
    await saveGames([...games, newGame]);

    setActiveGame(newGame);
    setView('board');
  };

  const recordLegWin = async (playerIdx) => {
    if (!activeGame || activeGame.status === 'finished') return;

    const nextScores = JSON.parse(JSON.stringify(activeGame.scores));
    // Uložíme hlubokou kopii aktuálního stavu do historie pro UNDO
    const nextHistory = [...(activeGame.history || []), JSON.parse(JSON.stringify(activeGame.scores))];
    
    nextScores[playerIdx].legs += 1;

    if (nextScores[playerIdx].legs >= activeGame.legsPerSet) {
      nextScores[playerIdx].sets += 1;
      nextScores.forEach(s => s.legs = 0);
    }

    let nextStatus = 'playing';
    let winner = null;
    if (nextScores[playerIdx].sets >= activeGame.targetSets) {
      nextStatus = 'finished';
      winner = activeGame.players[playerIdx];
      
      // Aktualizace statistik - výhry
      const updatedPlayers = players.map(p => {
          if (p.id === winner) {
              return { ...p, wins: (p.wins || 0) + 1 };
          }
          return p;
      });
      await savePlayers(updatedPlayers);
    }

    const updatedGame = { ...activeGame, scores: nextScores, history: nextHistory, status: nextStatus, winner };
    
    // Update active game locally and in storage
    setActiveGame(updatedGame);
    const updatedGamesList = games.map(g => g.id === activeGame.id ? updatedGame : g);
    await saveGames(updatedGamesList);
  };

  const undoLastMove = async () => {
    if (!activeGame.history || activeGame.history.length === 0) return;
    
    const newHistory = [...activeGame.history];
    const prevScores = newHistory.pop();
    const wasFinished = activeGame.status === 'finished';
    const oldWinner = activeGame.winner;

    if (wasFinished && oldWinner) {
      // Revert statistic win
      const updatedPlayers = players.map(p => {
          if (p.id === oldWinner) {
              return { ...p, wins: Math.max(0, (p.wins || 0) - 1) };
          }
          return p;
      });
      await savePlayers(updatedPlayers);
    }

    const updatedGame = { ...activeGame, scores: prevScores, history: newHistory, status: 'playing', winner: null };
    
    setActiveGame(updatedGame);
    const updatedGamesList = games.map(g => g.id === activeGame.id ? updatedGame : g);
    await saveGames(updatedGamesList);
  };

  const deleteGame = async (gameId) => {
    const confirmDelete = window.confirm('Opravdu chcete smazat tento zápas z historie?');
    if (!confirmDelete) return;

    await saveGames(games.filter(g => g.id !== gameId));
    if (activeGame && activeGame.id === gameId) {
        setView('list');
        setActiveGame(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-black opacity-30 italic animate-pulse tracking-widest uppercase text-sm">Načítání systému...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 font-sans select-none pb-20">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 pt-4">
          <h1 className="text-5xl font-black tracking-tighter flex items-center justify-center gap-3 italic">
            <span className="text-red-600 drop-shadow-lg">🎯</span> DARTS TRACKER
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 mt-2">Professional Score System</p>
        </header>

        {view === 'list' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <PlayerManager 
              players={players} 
              onAdd={addPlayer} 
              onDelete={deletePlayer} 
              onRename={renamePlayer}
            />
            
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight"><History className="text-blue-500" /> Poslední hry</h2>
              <button 
                onClick={() => setView('setup')} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs"
              >
                <Plus size={18} /> NOVÝ ZÁPAS
              </button>
            </div>

            <div className="grid gap-3">
              {games.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 opacity-50">
                  <p className="text-xs font-black opacity-30 uppercase tracking-widest">ŽÁDNÁ HISTORIE ZÁPASŮ</p>
                </div>
              ) : (
                [...games].sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 10).map(g => (
                  <div key={g.id} className={`bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between border-l-8 transition-all hover:shadow-md ${g.status === 'finished' ? 'border-slate-300' : 'border-blue-500'}`}>
                    <div className="cursor-pointer flex-1 min-w-0" onClick={() => { setActiveGame(g); setView('board'); }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black bg-blue-100 dark:bg-blue-900/40 text-blue-600 px-1.5 py-0.5 rounded uppercase">{g.gameType || 'X'}</span>
                        <div className="font-black text-lg truncate uppercase italic tracking-tight">{g.players?.join(' vs ') || 'ZÁPAS'}</div>
                      </div>
                      <div className="text-[10px] opacity-40 font-black tracking-widest uppercase">
                        {g.createdAt ? new Date(g.createdAt).toLocaleDateString() : 'Neznámé datum'} • {g.status === 'finished' ? 'DOKONČENO' : 'PROBÍHÁ'}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => { setActiveGame(g); setView('board'); }} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl hover:text-blue-500 transition-colors shadow-sm"><Play size={20} /></button>
                      <button onClick={() => deleteGame(g.id)} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl hover:text-red-500 transition-colors shadow-sm"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {players.length > 0 && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-black mb-6 flex items-center gap-2 uppercase tracking-widest"><BarChart3 size={20} className="text-orange-500" /> Síň slávy</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {players.sort((a,b) => b.wins - a.wins).map(p => (
                    <div key={p.id} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                      <div className="flex justify-between items-center relative z-10">
                        <span className="truncate pr-2 font-black text-lg uppercase italic">{p.id}</span>
                        <div className="text-blue-600 dark:text-blue-400 font-black text-2xl tracking-tighter">{p.wins}V</div>
                      </div>
                      <div className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mt-2 flex justify-between">
                        <span>ZÁPASY: {p.matches || 0}</span>
                        <span>{p.matches > 0 ? Math.round((p.wins/p.matches)*100) : 0}% WIN RATE</span>
                      </div>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'setup' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <SetupScreen 
              availablePlayers={players}
              targetSets={tSets} setTargetSets={setTSets}
              legsPerSet={lPerSet} setLegsPerSet={setLPerSet}
              gameType={gType} setGameType={setGType}
              doubleIn={dIn} setDoubleIn={setDIn}
              doubleOut={dOut} setDoubleOut={setDOut}
              startGame={handleStartGame}
              onCancel={() => setView('list')}
            />
          </div>
        )}

        {view === 'board' && activeGame && (
          <div className="animate-in fade-in duration-300 space-y-6">
            {activeGame.status === 'finished' ? (
              <div className="max-w-md mx-auto text-center space-y-8 bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl border-b-8 border-yellow-500/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-white to-yellow-400"></div>
                <div className="relative inline-block">
                  <Trophy size={100} className="text-yellow-400 animate-bounce drop-shadow-xl" />
                  <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xs font-black italic tracking-[0.5em] opacity-40 uppercase">Vítěz zápasu</h2>
                  <p className="text-6xl font-black text-blue-600 dark:text-blue-400 break-words drop-shadow-md uppercase italic tracking-tighter">{activeGame.winner}</p>
                </div>
                <div className="py-4 px-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl font-black text-5xl tracking-widest text-slate-400">
                   {activeGame.scores.map(s => s.sets).join(' : ')}
                </div>
                <div className="space-y-4 pt-6">
                  <button onClick={() => setView('list')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black transition-all shadow-xl active:scale-95 uppercase tracking-[0.2em] text-sm">Zavřít</button>
                  <button onClick={undoLastMove} className="flex items-center justify-center gap-2 text-[10px] font-black uppercase opacity-40 hover:opacity-100 mx-auto transition-opacity tracking-[0.3em]">
                    <Undo2 size={14} /> Opravit výsledek
                  </button>
                </div>
              </div>
            ) : (
              <ScoreBoard 
                game={activeGame} 
                recordLegWin={recordLegWin} 
                undoLastMove={undoLastMove} 
                resetMatch={() => setView('list')} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
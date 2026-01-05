import React, { useState, useEffect } from 'react';
import { 
  Trophy, User, Settings, ChevronRight, 
  Undo2, Target, Plus, List, Trash2, Play, BarChart3, Users, Check, X, History, Edit2,
  Moon, Sun, Dices
} from 'lucide-react';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

// --- UI Komponenty ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, icon: Icon }) => {
  const baseStyle = "flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all active:scale-95 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30",
    secondary: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30",
    outline: "border-2 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-500 hover:text-blue-500 bg-transparent shadow-none"
  };
  
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className} py-3 px-6`}>
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

// --- Komponenty ---

const SettingsScreen = ({ darkMode, setDarkMode, onBack }) => {
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
          <Settings className="text-slate-400" /> Nastavení
        </h2>
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="text-blue-500" /> : <Sun className="text-orange-500" />}
            <div>
              <p className="font-bold">Tmavý režim</p>
              <p className="text-xs opacity-50 uppercase tracking-wider">Vzhled aplikace</p>
            </div>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-blue-600' : 'bg-slate-300'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
      
      <div className="pt-4 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-20">Verze 1.1.0</p>
      </div>
    </div>
  );
};

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
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
      <h3 className="text-lg font-black flex items-center gap-2 uppercase tracking-wide opacity-80">
        <Users size={20} className="text-blue-500" /> Správa hráčů
      </h3>
      <div className="flex gap-2">
        <input 
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Jméno nového hráče"
          className="flex-1 bg-slate-100 dark:bg-slate-700 p-3 rounded-xl outline-none focus:ring-2 ring-blue-500 text-slate-900 dark:text-white font-bold placeholder:font-normal"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
          <Plus size={24} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
        {players.map(p => (
          <div key={p.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl group border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all">
            {editingId === p.id ? (
              <div className="flex gap-2 w-full">
                <input 
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 bg-white dark:bg-slate-800 text-sm p-1 rounded border border-blue-500 outline-none font-bold"
                  onKeyDown={(e) => e.key === 'Enter' && submitRename()}
                  onBlur={submitRename}
                />
              </div>
            ) : (
              <>
                <span className="truncate font-bold text-sm pl-1">{p.id}</span>
                <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startRename(p)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => onDelete(p.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                    <Trash2 size={16} />
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

// --- Konstanty her ---



const GAME_CATEGORIES = [

  { id: '01', name: '01 Games (301-901)', games: [

    { id: 1, name: '301' }, { id: 2, name: '401' }, { id: 3, name: '501' }, 

    { id: 4, name: '601' }, { id: 5, name: '701' }, { id: 6, name: '801' }, { id: 7, name: '901' }

  ]},

  { id: 'cricket', name: 'Cricket', games: [

    { id: 8, name: 'CRICKET' }, { id: 9, name: 'NO-SCORE CRICKET' }, 

    { id: 10, name: 'SCRAM' }, { id: 11, name: 'CUT-THROAT CRICKET' }

  ]},

  { id: 'countup', name: 'Count-Up', games: [

    { id: 12, name: 'COUNT-UP 300' }, { id: 13, name: 'COUNT-UP 400' }, { id: 14, name: 'COUNT-UP 500' },

    { id: 15, name: 'COUNT-UP 600' }, { id: 16, name: 'COUNT-UP 700' }, { id: 17, name: 'COUNT-UP 800' },

    { id: 18, name: 'COUNT-UP 900' }, { id: 19, name: 'COUNT-UP 999' }

  ]},

  { id: 'highscore', name: 'High Score', games: [

    { id: 20, name: 'HIGH SCORE 3R' }, { id: 21, name: 'HIGH SCORE 4R' }, { id: 22, name: 'HIGH SCORE 5R' },

    { id: 23, name: 'HIGH SCORE 6R' }, { id: 24, name: 'HIGH SCORE 7R' }, { id: 25, name: 'HIGH SCORE 8R' },

    { id: 26, name: 'HIGH SCORE 9R' }, { id: 27, name: 'HIGH SCORE 10R' }, { id: 28, name: 'HIGH SCORE 11R' },

    { id: 29, name: 'HIGH SCORE 12R' }, { id: 30, name: 'HIGH SCORE 13R' }, { id: 31, name: 'HIGH SCORE 14R' }

  ]},

  { id: 'clock', name: 'Round The Clock', games: [

    { id: 32, name: 'CLOCK 1-5' }, { id: 33, name: 'CLOCK 1-10' }, { id: 34, name: 'CLOCK 1-15' }, { id: 35, name: 'CLOCK 1-20' },

    { id: 36, name: 'CLOCK 20-1' }, { id: 37, name: 'CLOCK 20-5' }, { id: 38, name: 'CLOCK 20-10' }, { id: 39, name: 'CLOCK 20-15' },

    { id: 40, name: 'CLOCK 5-1' }, { id: 41, name: 'CLOCK 10-1' }, { id: 42, name: 'CLOCK 15-1' }, { id: 43, name: 'CLOCK 10-15' } // Custom mappings for simplicity

  ]},

  { id: 'other', name: 'Ostatní hry', games: [

    { id: 44, name: 'KILLER' }, { id: 45, name: 'DOUBLE DOWN' }, { id: 46, name: 'FORTY ONE' },

    { id: 47, name: 'ALL FIVES 51' }, { id: 48, name: 'ALL FIVES 61' }, { id: 49, name: 'ALL FIVES 71' },

    { id: 50, name: 'ALL FIVES 81' }, { id: 51, name: 'ALL FIVES 91' },

    { id: 52, name: 'SHANGHAI 1' }, { id: 53, name: 'SHANGHAI 5' }, { id: 54, name: 'SHANGHAI 10' }, { id: 55, name: 'SHANGHAI 15' },

    { id: 56, name: 'GOLF 9H' }, { id: 57, name: 'GOLF 18H' },

    { id: 58, name: 'FOOTBALL' }, { id: 59, name: 'BOWLING' },

    { id: 60, name: 'BASEBALL 6' }, { id: 61, name: 'BASEBALL 9' },

    { id: 62, name: 'STEEPLECHASE' }, { id: 63, name: 'SHOVE A PENNY' },

    { id: 64, name: 'NINE-DART CENTURY' }, { id: 65, name: 'GREEN VS. RED' }

  ]}

];



// --- Komponenty ---



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

  const [startingIndex, setStartingIndex] = useState(0);

  const [isTossing, setIsTossing] = useState(false);

  const [coinTossMode, setCoinTossMode] = useState('random'); 

  const [headsPlayerIndex, setHeadsPlayerIndex] = useState(0);

  

  // Game Selection State

  const [selectedCategory, setSelectedCategory] = useState('01');

  const [selectedGameId, setSelectedGameId] = useState(3); // Default 501



  // Effect to update parent gameType when selection changes

  useEffect(() => {

    const category = GAME_CATEGORIES.find(c => c.id === selectedCategory);

    const game = category?.games.find(g => g.id === Number(selectedGameId));

    if (game) {

        setGameType(`${game.id} ${game.name}`);

    }

  }, [selectedCategory, selectedGameId, setGameType]);



  const togglePlayer = (id) => {

    if (selectedIds.includes(id)) {

      const newSelected = selectedIds.filter(i => i !== id);

      setSelectedIds(newSelected);

      if (startingIndex >= newSelected.length) setStartingIndex(0);

      if (headsPlayerIndex >= newSelected.length) setHeadsPlayerIndex(0);

    } else if (selectedIds.length < 4) {

      setSelectedIds([...selectedIds, id]);

    }

  };



  const handleCoinToss = () => {

    if (selectedIds.length < 2) return;

    setIsTossing(true);

    let interval;

    let counter = 0;

    

    interval = setInterval(() => {

        setStartingIndex(prev => (prev + 1) % selectedIds.length);

        counter++;

        if (counter > 15) {

            clearInterval(interval);

            let finalWinnerIndex;

            if (coinTossMode === 'assign' && selectedIds.length === 2) {

                const tossResult = Math.random() < 0.5 ? 0 : 1; 

                finalWinnerIndex = (tossResult === 0) ? headsPlayerIndex : (1 - headsPlayerIndex);

            } else {

                finalWinnerIndex = Math.floor(Math.random() * selectedIds.length);

            }

            setStartingIndex(finalWinnerIndex);

            setIsTossing(false);

        }

    }, 80);

  };



  const isX01 = selectedCategory === '01';



  return (

    <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-[2rem] shadow-2xl space-y-8 animate-in slide-in-from-bottom-10 duration-500 max-h-[90vh] overflow-y-auto custom-scrollbar">

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-3">

          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl">

             <Settings className="text-blue-600 dark:text-blue-400" size={24} />

          </div>

          <h2 className="text-2xl font-black uppercase tracking-tighter">Nastavení zápasu</h2>

        </div>

        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all">

          <X size={28} />

        </button>

      </div>

      

      <div className="space-y-6">

        <div>

          <label className="flex justify-between items-center text-xs font-black uppercase tracking-widest mb-3 opacity-60">

            <span>Hráči ({selectedIds.length}/4)</span>

            {selectedIds.length < 2 && <span className="text-red-500">Vyberte min. 2</span>}

          </label>

          {availablePlayers.length === 0 ? (

            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl text-center border border-red-100 dark:border-red-900/30">

               <p className="text-sm text-red-600 dark:text-red-400 font-bold">Nejdříve musíte vytvořit hráče v menu.</p>

            </div>

          ) : (

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">

              {availablePlayers.map(p => (

                <button

                  key={p.id}

                  onClick={() => togglePlayer(p.id)}

                  className={`relative flex items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${selectedIds.includes(p.id) ? 'border-blue-500 bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 shadow-md shadow-blue-500/10' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-600'}`}

                >

                  <span className="truncate font-bold text-sm">{p.id}</span>

                  {selectedIds.includes(p.id) && (

                    <div className="absolute top-2 right-2">

                        <Check size={14} className="text-blue-500" strokeWidth={4} />

                    </div>

                  )}

                </button>

              ))}

            </div>

          )}

        </div>



        {/* Starting Player Section */}

        {selectedIds.length >= 2 && (

            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">

                <div className="flex justify-between items-center mb-3">

                    <label className="block text-xs font-black uppercase tracking-widest opacity-50">Kdo začíná?</label>

                    <button 

                        onClick={handleCoinToss}

                        disabled={isTossing}

                        className="flex items-center gap-1 text-[10px] font-black uppercase bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"

                    >

                        <Dices size={14} /> Hod mincí

                    </button>

                </div>



                {selectedIds.length === 2 && (

                    <div className="mb-4">

                        <div className="flex gap-4">

                            <label className="flex items-center gap-2">

                                <input 

                                    type="radio" 

                                    name="coinTossMode" 

                                    value="random" 

                                    checked={coinTossMode === 'random'} 

                                    onChange={() => setCoinTossMode('random')}

                                    className="form-radio text-blue-600"

                                />

                                <span className="text-xs font-bold uppercase">Náhodně</span>

                            </label>

                            <label className="flex items-center gap-2">

                                <input 

                                    type="radio" 

                                    name="coinTossMode" 

                                    value="assign" 

                                    checked={coinTossMode === 'assign'} 

                                    onChange={() => setCoinTossMode('assign')}

                                    className="form-radio text-blue-600"

                                />

                                <span className="text-xs font-bold uppercase">Přiřadit</span>

                            </label>

                        </div>



                        {coinTossMode === 'assign' && selectedIds.length === 2 && (

                            <div className="flex justify-around items-center mt-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">

                                <label className="flex flex-col items-center gap-1 cursor-pointer">

                                    <input 

                                        type="radio" 

                                        name="headsPlayer" 

                                        checked={headsPlayerIndex === 0} 

                                        onChange={() => setHeadsPlayerIndex(0)} 

                                        className="form-radio text-blue-600"

                                    />

                                    <span className="font-bold text-xs">{selectedIds[0]} (Panna)</span>

                                </label>

                                <label className="flex flex-col items-center gap-1 cursor-pointer">

                                    <input 

                                        type="radio" 

                                        name="headsPlayer" 

                                        checked={headsPlayerIndex === 1} 

                                        onChange={() => setHeadsPlayerIndex(1)} 

                                        className="form-radio text-blue-600"

                                    />

                                    <span className="font-bold text-xs">{selectedIds[1]} (Orel)</span>

                                </label>

                            </div>

                        )}

                    </div>

                )}

                

                <div className="flex gap-2 flex-wrap">

                    {selectedIds.map((id, idx) => (

                        <button

                            key={id}

                            onClick={() => setStartingIndex(idx)}

                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 ${startingIndex === idx ? 'bg-white dark:bg-slate-800 border-blue-500 text-blue-600 shadow-sm' : 'border-transparent opacity-50 hover:opacity-100'}`}

                        >

                            {id}

                        </button>

                    ))}

                </div>

            </div>

        )}



        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <div className="space-y-4">

             <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">

                <div>

                    <label className="block text-xs font-black uppercase tracking-widest mb-2 opacity-50">Kategorie</label>

                    <select 

                        value={selectedCategory} 

                        onChange={(e) => {

                            setSelectedCategory(e.target.value);

                            const firstGame = GAME_CATEGORIES.find(c => c.id === e.target.value)?.games[0];

                            if(firstGame) setSelectedGameId(firstGame.id);

                        }}

                        className="w-full bg-slate-200 dark:bg-slate-800 p-3 rounded-xl font-bold border-none outline-none text-sm"

                    >

                        {GAME_CATEGORIES.map(cat => (

                            <option key={cat.id} value={cat.id}>{cat.name}</option>

                        ))}

                    </select>

                </div>

                <div>

                    <label className="block text-xs font-black uppercase tracking-widest mb-2 opacity-50">Hra</label>

                    <select 

                        value={selectedGameId} 

                        onChange={(e) => setSelectedGameId(Number(e.target.value))}

                        className="w-full bg-slate-200 dark:bg-slate-800 p-3 rounded-xl font-bold border-none outline-none text-sm"

                    >

                        {GAME_CATEGORIES.find(c => c.id === selectedCategory)?.games.map(g => (

                            <option key={g.id} value={g.id}>{g.id}. {g.name}</option>

                        ))}

                    </select>

                </div>

             </div>



             {isX01 && (

                 <div className="flex flex-col gap-2">

                   <button 

                    onClick={() => setDoubleIn(!doubleIn)}

                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wider ${doubleIn ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-slate-200 dark:border-slate-700 opacity-60'}`}

                   >

                     <span>Double In</span>

                     {doubleIn && <Check size={16} />}

                   </button>

                   <button 

                    onClick={() => setDoubleOut(!doubleOut)}

                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wider ${doubleOut ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-slate-200 dark:border-slate-700 opacity-60'}`}

                   >

                     <span>Double Out</span>

                     {doubleOut && <Check size={16} />}

                   </button>

                </div>

             )}

          </div>



          <div className="space-y-4">

            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">

                <label className="block text-xs font-black uppercase tracking-widest mb-2 opacity-50">Sety k výhře</label>

                <div className="flex items-center gap-4">

                    <button onClick={() => setTargetSets(Math.max(1, targetSets - 1))} className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-300">-</button>

                    <span className="text-2xl font-black w-8 text-center">{targetSets}</span>

                    <button onClick={() => setTargetSets(Math.min(20, targetSets + 1))} className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 shadow-lg shadow-blue-500/30">+</button>

                </div>

            </div>

             <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">

                <label className="block text-xs font-black uppercase tracking-widest mb-2 opacity-50">Legy v setu</label>

                <div className="flex items-center gap-4">

                    <button onClick={() => setLegsPerSet(Math.max(1, legsPerSet - 1))} className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-300">-</button>

                    <span className="text-2xl font-black w-8 text-center">{legsPerSet}</span>

                    <button onClick={() => setLegsPerSet(Math.min(20, legsPerSet + 1))} className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 shadow-lg shadow-blue-500/30">+</button>

                </div>

            </div>

          </div>

        </div>

      </div>



      <Button 

        onClick={() => startGame(selectedIds, startingIndex)}

        disabled={selectedIds.length < 2 || isTossing}

        className="w-full text-lg py-4"

        icon={ChevronRight}

      >

        SPUSTIT ZÁPAS

      </Button>

    </div>

  );

};



const ScoreBoard = ({ 
  game, recordLegWin, undoLastMove, resetMatch 
}) => {
  const currentTotalLegs = game.history?.length || 0;
  const turnIndex = (currentTotalLegs + (game.startingIndex || 0)) % game.players.length;

  return (
    <div className="max-w-5xl mx-auto space-y-4 h-full flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <button onClick={resetMatch} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-500">
          <List size={24} />
        </button>
        
        <div className="flex flex-col items-center">
            <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-40">Best of {game.targetSets} Sets</div>
            <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-blue-600 dark:text-blue-400">{game.gameType}</span>
                <div className="flex gap-1">
                     {game.doubleIn && <span className="text-[10px] font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600 px-1.5 rounded">DI</span>}
                     {game.doubleOut && <span className="text-[10px] font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600 px-1.5 rounded">DO</span>}
                </div>
            </div>
        </div>

        <button 
          onClick={undoLastMove} 
          disabled={!game.history || game.history.length === 0}
          className={`p-2 rounded-xl transition-colors ${(!game.history || game.history.length === 0) ? 'opacity-20 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-500'}`}
        >
          <Undo2 size={24} />
        </button>
      </div>

      {/* Players Grid */}
      <div className={`grid gap-4 flex-1 ${game.players.length > 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'} content-start`}>
        {game.players.map((playerName, idx) => {
          const isWinning = game.scores[idx].sets === Math.max(...game.scores.map(s => s.sets)) && game.scores[idx].sets > 0;
          const isOnTurn = turnIndex === idx;

          return (
            <div 
              key={idx}
              className={`relative overflow-hidden rounded-[2rem] transition-all duration-300 cursor-pointer select-none group
                ${isOnTurn 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl shadow-blue-500/30 scale-[1.01] ring-4 ring-blue-200 dark:ring-blue-900' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                }
              `}
              onClick={() => recordLegWin(idx)}
            >
              {/* Background Decoration */}
              {isOnTurn && (
                  <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-10 -translate-y-10">
                      <Target size={200} />
                  </div>
              )}

              <div className="p-6 sm:p-8 flex flex-col h-full justify-between relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <div className={`text-xs font-black uppercase tracking-[0.2em] mb-1 ${isOnTurn ? 'text-blue-200' : 'text-slate-400'}`}>
                            Hráč {idx + 1}
                        </div>
                        <h3 className="text-2xl sm:text-4xl font-black truncate pr-2 italic tracking-tight">{playerName}</h3>
                    </div>
                    {isOnTurn && <div className="animate-pulse"><Target size={32} className="text-white" /></div>}
                </div>

                {/* Score Area */}
                <div className="flex items-end justify-between mt-8">
                    {/* SETS - Main Counter */}
                    <div className="flex flex-col">
                         <span className={`text-[10px] font-black uppercase tracking-widest mb-[-5px] ml-1 ${isOnTurn ? 'text-blue-200' : 'text-slate-400'}`}>Sety</span>
                         <span className={`text-7xl sm:text-8xl font-black leading-none tracking-tighter ${isOnTurn ? 'text-white drop-shadow-lg' : 'text-slate-900 dark:text-white'}`}>
                             {game.scores[idx].sets}
                         </span>
                    </div>

                    {/* LEGS - Secondary Counter */}
                    <div className={`flex flex-col items-end px-4 py-2 rounded-2xl ${isOnTurn ? 'bg-blue-500/30 backdrop-blur-sm' : 'bg-slate-100 dark:bg-slate-900'}`}>
                         <span className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isOnTurn ? 'text-blue-100' : 'text-slate-400'}`}>Legy ({game.legsPerSet})</span>
                         <div className="flex items-center gap-3">
                             <span className={`text-4xl sm:text-5xl font-black leading-none ${isOnTurn ? 'text-white' : 'text-slate-500'}`}>
                                 {game.scores[idx].legs}
                             </span>
                         </div>
                    </div>
                </div>

                {/* Leg Progress Dots (Visual Aid) */}
                <div className="flex gap-1 mt-6 opacity-60">
                    {Array.from({length: game.legsPerSet}).map((_, i) => (
                        <div key={i} className={`h-2 flex-1 rounded-full transition-all ${i < game.scores[idx].legs ? (isOnTurn ? 'bg-white' : 'bg-blue-500') : (isOnTurn ? 'bg-blue-900' : 'bg-slate-200 dark:bg-slate-700')}`} />
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MatchDetail = ({ game, onClose }) => {
  if (!game) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-[2rem] shadow-2xl space-y-8 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
            <History className="text-blue-500" /> Detail zápasu
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X size={24} />
        </button>
      </div>

      <div className="text-center space-y-2 py-4">
         <p className="text-xs font-black uppercase tracking-widest opacity-40">Výsledek</p>
         <div className="flex justify-center items-center gap-8">
            <div className={`text-right ${game.scores[0].sets > game.scores[1].sets ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                <p className="text-2xl font-black">{game.players[0]}</p>
                <p className="text-6xl font-black leading-none">{game.scores[0].sets}</p>
            </div>
            <div className="text-2xl font-black opacity-20">:</div>
            <div className={`text-left ${game.scores[1].sets > game.scores[0].sets ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                <p className="text-2xl font-black">{game.players[1]}</p>
                <p className="text-6xl font-black leading-none">{game.scores[1].sets}</p>
            </div>
         </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3">
          <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-2">Informace</p>
          <div className="flex justify-between text-sm">
              <span className="opacity-60">Datum:</span>
              <span className="font-bold">{new Date(game.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
              <span className="opacity-60">Typ hry:</span>
              <span className="font-bold">{game.gameType} {game.doubleIn ? 'DI' : ''}{game.doubleOut ? 'DO' : ''}</span>
          </div>
          <div className="flex justify-between text-sm">
              <span className="opacity-60">Formát:</span>
              <span className="font-bold">Best of {game.targetSets} Sets ({game.legsPerSet} legs)</span>
          </div>
           <div className="flex justify-between text-sm">
              <span className="opacity-60">Délka:</span>
              <span className="font-bold">{game.history ? game.history.length : 0} odehraných legů</span>
          </div>
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
  
  // Theme State
  const [darkMode, setDarkMode] = useState(false);

  // Settings State
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
        const savedTheme = await localforage.getItem('darkMode');
        
        setGames(loadedGames);
        setPlayers(loadedPlayers);
        setDarkMode(savedTheme === true);
      } catch (err) {
        console.error("Chyba při načítání dat:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- Theme Effect ---
  useEffect(() => {
     if (darkMode) {
       document.documentElement.classList.add('dark');
     } else {
       document.documentElement.classList.remove('dark');
     }
     localforage.setItem('darkMode', darkMode);
  }, [darkMode]);

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

    const updatedPlayers = players.map(p => 
        p.id === oldName ? { ...p, id: newName } : p
    );
    await savePlayers(updatedPlayers);

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

    const updatedPlayers = players.map(p => {
        if (selectedPlayerIds.includes(p.id)) {
            return { ...p, matches: (p.matches || 0) + 1 };
        }
        return p;
    });
    await savePlayers(updatedPlayers);
    
    await saveGames([...games, newGame]);

    setActiveGame(newGame);
    setView('board');
  };

  const recordLegWin = async (playerIdx) => {
    if (!activeGame || activeGame.status === 'finished') return;

    const nextScores = JSON.parse(JSON.stringify(activeGame.scores));
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
      
      const updatedPlayers = players.map(p => {
          if (p.id === winner) {
              return { ...p, wins: (p.wins || 0) + 1 };
          }
          return p;
      });
      await savePlayers(updatedPlayers);
    }

    const updatedGame = { ...activeGame, scores: nextScores, history: nextHistory, status: nextStatus, winner };
    
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
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none transition-colors duration-500`}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-24">
        
        {/* Header */}
        {view !== 'board' && (
            <header className="flex justify-between items-center mb-8 pt-2">
            <div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tighter flex items-center gap-2 italic">
                    <span className="text-red-600 drop-shadow-lg">🎯</span> 
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">DARTS</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 ml-1">Tracker Pro</p>
            </div>
            <button 
                onClick={() => setView('settings')}
                className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-400 hover:text-blue-500"
            >
                <Settings size={24} />
            </button>
            </header>
        )}

        {view === 'list' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* Stats Summary - New addition for "Graphics" */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-5 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy size={80} /></div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Odehráno her</p>
                    <p className="text-4xl font-black">{games.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Users size={80} /></div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Aktivní hráči</p>
                    <p className="text-4xl font-black text-slate-800 dark:text-slate-200">{players.length}</p>
                </div>
            </div>

            <PlayerManager 
              players={players} 
              onAdd={addPlayer} 
              onDelete={deletePlayer} 
              onRename={renamePlayer}
            />
            
            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                 <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight opacity-80"><History className="text-blue-500" /> Historie</h2>
              </div>

              <div className="grid gap-4">
                {games.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 opacity-50">
                    <p className="text-xs font-black opacity-40 uppercase tracking-widest">Zatím žádné zápasy</p>
                  </div>
                ) : (
                  [...games].sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 5).map(g => (
                    <div key={g.id} className={`bg-white dark:bg-slate-800 p-5 rounded-[1.5rem] shadow-sm flex items-center justify-between group transition-all hover:shadow-md border border-slate-100 dark:border-slate-800`}>
                      <div className="cursor-pointer flex-1 min-w-0" onClick={() => { setActiveGame(g); setView(g.status === 'finished' ? 'detail' : 'board'); }}>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${g.status === 'finished' ? 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300' : 'bg-green-100 text-green-600 dark:bg-green-900/30'}`}>
                              {g.status === 'finished' ? 'Dokončeno' : 'Hraje se'}
                          </span>
                          <span className="text-[10px] font-black text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">{g.gameType}</span>
                        </div>
                        <div className="font-black text-lg truncate uppercase italic tracking-tight text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {g.players?.join(' vs ') || 'ZÁPAS'}
                        </div>
                        <div className="text-[10px] opacity-40 font-bold mt-1">
                          {g.createdAt ? new Date(g.createdAt).toLocaleDateString() : 'Neznámé datum'}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button onClick={() => deleteGame(g.id)} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Floating Action Button for New Game */}
        {view === 'list' && (
             <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
                <Button onClick={() => setView('setup')} className="w-full text-lg shadow-2xl shadow-blue-600/40 rounded-2xl py-4" icon={Play}>
                    NOVÝ ZÁPAS
                </Button>
            </div>
        )}

        {view === 'settings' && (
            <SettingsScreen darkMode={darkMode} setDarkMode={setDarkMode} onBack={() => setView('list')} />
        )}

        {view === 'detail' && activeGame && (
            <MatchDetail game={activeGame} onClose={() => { setActiveGame(null); setView('list'); }} />
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
          <div className="animate-in fade-in duration-300 space-y-6 h-full">
            {activeGame.status === 'finished' ? (
              <div className="max-w-md mx-auto text-center space-y-8 bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border-b-8 border-yellow-500/50 relative overflow-hidden mt-10">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-white to-yellow-400"></div>
                <div className="relative inline-block">
                  <Trophy size={100} className="text-yellow-400 animate-bounce drop-shadow-xl" />
                  <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xs font-black italic tracking-[0.5em] opacity-40 uppercase">Vítěz zápasu</h2>
                  <p className="text-5xl sm:text-6xl font-black text-blue-600 dark:text-blue-400 break-words drop-shadow-md uppercase italic tracking-tighter">{activeGame.winner}</p>
                </div>
                <div className="py-6 px-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl font-black text-6xl tracking-widest text-slate-400 border border-slate-100 dark:border-slate-800">
                   {activeGame.scores.map(s => s.sets).join('-')}
                </div>
                <div className="space-y-4 pt-6">
                  <Button onClick={() => setView('list')} className="w-full text-lg py-4 rounded-2xl">
                    Zavřít
                  </Button>
                  <button onClick={undoLastMove} className="flex items-center justify-center gap-2 text-[10px] font-black uppercase opacity-40 hover:opacity-100 mx-auto transition-opacity tracking-[0.3em] py-4">
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
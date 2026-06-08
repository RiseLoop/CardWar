import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { useGame } from '../GameContext';
import { PlayerCard, CardStats } from '../lib/types';
import { CARDS } from '../lib/data';
import { getCardCurrentStats, getPlayerCardCP, getRankName } from '../lib/utils';
import { ArrowLeft } from 'lucide-react';

type MatchState = 1 | 2 | 3 | 4;

export const MatchScreen = () => {
  const { playerData, updatePlayer, setCurrentScreen } = useGame();
  
  const [matchState, setMatchState] = useState<MatchState>(1);
  const [matchTime, setMatchTime] = useState(0);
  
  const [selectTimeLeft, setSelectTimeLeft] = useState(15);
  const [selectedCard, setSelectedCard] = useState<PlayerCard | null>(null);
  
  const [enemyStats, setEnemyStats] = useState<CardStats | null>(null);
  const [enemyCP, setEnemyCP] = useState<number>(0);
  const [playerCP, setPlayerCP] = useState<number>(0);
  const [isWin, setIsWin] = useState<boolean>(false);
  
  const [pointChange, setPointChange] = useState({ old: 0, new: 0, diff: 0 });

  // State 1: Matching
  useEffect(() => {
    if (matchState !== 1) return;
    
    const interval = setInterval(() => {
      setMatchTime(t => t + 1);
    }, 1000);
    
    const waitTime = Math.floor(Math.random() * 3000) + 3000; // 3~5s
    const timeout = setTimeout(() => {
      setMatchState(2);
    }, waitTime);
    
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [matchState]);

  // State 2: Select Card
  useEffect(() => {
    if (matchState !== 2) return;
    
    if (selectTimeLeft <= 0) {
       // auto select
       let bestCP = -1;
       let bestCards: PlayerCard[] = [];
       playerData.cards.forEach(c => {
         const cp = getPlayerCardCP(c);
         if (cp > bestCP) { bestCP = cp; bestCards = [c]; }
         else if (cp === bestCP) { bestCards.push(c); }
       });
       const picked = bestCards[Math.floor(Math.random() * bestCards.length)];
       handleSelect(picked);
       return;
    }
    
    const interval = setInterval(() => {
       setSelectTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [matchState, selectTimeLeft]);

  const handleSelect = (pc: PlayerCard) => {
     setSelectedCard(pc);
     // Calculate Enemy
     const pCP = getPlayerCardCP(pc);
     setPlayerCP(pCP);
     
     let enemyWinProb = playerData.rankPoints < 2000 ? 0.25 : 0.40;
     const isEnemyStronger = Math.random() < enemyWinProb;
     
     // generate dummy stats that sum up to target CP
     const targetCP = isEnemyStronger ? pCP * (1.05 + Math.random()*0.1) : pCP * (0.8 + Math.random()*0.15);
     setEnemyCP(targetCP);
     
     // Fake stats for display
     const eStats: CardStats = {
       atk: Math.floor(targetCP * 0.4),
       def: Math.floor(targetCP * 0.2),
       rec: Math.floor(targetCP * 0.2),
       crit: Math.floor(targetCP * 0.1),
       critRate: 10
     };
     setEnemyStats(eStats);
     setIsWin(pCP >= targetCP);
     
     setMatchState(3);
  };

  // State 3: Battle transition
  useEffect(() => {
    if (matchState !== 3) return;
    const timeout = setTimeout(() => {
      processResult();
      setMatchState(4);
    }, 3000); // show battle result for 3 seconds before score screen
    return () => clearTimeout(timeout);
  }, [matchState]);

  const processResult = () => {
    const p = playerData.rankPoints;
    let diff = 0;
    
    if (isWin) {
      if (p <= 99) diff = 160;
      else if (p <= 999) diff = 100;
      else if (p <= 1499) diff = 80;
      else if (p <= 1999) diff = 75;
      else if (p <= 2499) diff = 60;
      else if (p <= 2999) diff = 50;
      else if (p <= 3499) diff = 20;
      else if (p <= 3699) diff = 10;
      else if (p <= 3749) diff = 7;
      else diff = 5;
    } else {
      if (p <= 99) { diff = -30; } // bound by 0
      else if (p <= 2999) { diff = -30; }
      else if (p <= 3499) diff = -10;
      else if (p <= 3774) diff = -7;
      else diff = -8;
    }
    
    let newPoints = p + diff;
    if (newPoints < 0) {
      diff = -p;
      newPoints = 0;
    }
    
    setPointChange({ old: p, new: newPoints, diff: diff });
    updatePlayer({ rankPoints: newPoints });
  };


  const fmtTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
  };

  return (
    <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       className="absolute inset-0 bg-gray-900 w-full h-full text-white font-sans flex flex-col items-center justify-center p-6"
    >
      <AnimatePresence mode="wait">
        {matchState === 1 && (
          <motion.div key="state1" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex flex-col items-center gap-8">
             <div className="w-24 h-24 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
             <h2 className="text-4xl font-bold tracking-widest text-red-500">匹配中...</h2>
             <div className="text-3xl font-mono text-gray-400 mt-4">{fmtTime(matchTime)}</div>
          </motion.div>
        )}

        {matchState === 2 && (
          <motion.div key="state2" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex flex-col items-center w-full h-full">
            <h2 className="text-4xl font-bold mb-4">请选择出战卡牌</h2>
            <div className="text-red-400 text-6xl font-black font-mono mb-8">{selectTimeLeft}s</div>
            
            <div className="flex-1 w-full overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4 content-start">
               {playerData.cards.map(pc => {
                  const cdata = CARDS[pc.id];
                  if(!cdata) return null;
                  const cp = getPlayerCardCP(pc);
                  return (
                    <div 
                      key={pc.id} 
                      onClick={() => handleSelect(pc)}
                      className="bg-gray-800 hover:bg-gray-700 transition cursor-pointer border border-gray-600 rounded-2xl p-4 flex flex-col items-center hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <h4 className="text-xl font-bold mb-2">{cdata.name}</h4>
                      <p className="text-sm text-gray-400 mb-2">{cdata.quality} | {pc.tier}阶 {pc.level}级</p>
                      <p className="text-yellow-400 font-mono font-bold">CP: {Math.floor(cp)}</p>
                    </div>
                  );
               })}
            </div>
          </motion.div>
        )}

        {matchState === 3 && selectedCard && enemyStats && (
          <motion.div key="state3" initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:2, opacity:0 }} className="flex items-center justify-center gap-16 w-full">
            {/* Player Card */}
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-4 text-blue-400">我方</h3>
              <div className="bg-gray-800 border-2 border-blue-500 rounded-3xl p-6 w-64 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                 <h4 className="text-3xl font-black mb-6 text-center">{CARDS[selectedCard.id]?.name}</h4>
                 <div className="text-center text-4xl font-mono text-cyan-300 font-bold mb-4">{Math.floor(playerCP)}</div>
                 <div className="text-center text-gray-400 font-bold tracking-widest text-sm">综合战力</div>
              </div>
            </div>

            <div className="text-6xl font-black text-red-500 italic">VS</div>

            {/* Enemy Card */}
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-4 text-red-400">敌方</h3>
              <div className="bg-gray-800 border-2 border-red-500 rounded-3xl p-6 w-64 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                 <h4 className="text-3xl font-black mb-6 text-center">未知对手</h4>
                 <div className="text-center text-4xl font-mono text-orange-400 font-bold mb-4">{Math.floor(enemyCP)}</div>
                 <div className="text-center text-gray-400 font-bold tracking-widest text-sm">综合战力</div>
              </div>
            </div>

            <motion.div 
               initial={{ opacity:0, y:-50 }} animate={{ opacity:1, y:0, transition: { delay: 1 } }} 
               className="absolute top-20 text-6xl font-black text-yellow-400 drop-shadow-xl"
            >
              {isWin ? '胜利！' : '败北！'}
            </motion.div>
          </motion.div>
        )}

        {matchState === 4 && (
          <motion.div key="state4" initial={{ y:50, opacity:0 }} animate={{ y:0, opacity:1 }} className="flex flex-col items-center bg-gray-800 p-12 rounded-3xl border border-gray-700 shadow-2xl">
             <h2 className={`text-6xl font-black mb-10 ${isWin ? 'text-yellow-400' : 'text-gray-500'}`}>
               {isWin ? 'VICTORY' : 'DEFEAT'}
             </h2>
             
             <div className="flex flex-col items-center gap-4 bg-gray-900 p-8 rounded-2xl w-full">
               <div className="text-gray-400 text-lg">段位积分结算</div>
               <div className="flex items-center gap-6 text-4xl font-mono">
                 <span className="text-gray-300">{pointChange.old}</span>
                 <ArrowLeft size={32} className="rotate-180 text-gray-500" />
                 <span className="text-white font-bold">{pointChange.new}</span>
               </div>
               <div className={`text-2xl font-bold mt-2 ${pointChange.diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                 {pointChange.diff >= 0 ? '+' : ''}{pointChange.diff}
               </div>
               
               <div className="mt-6 pt-6 border-t border-gray-800 text-xl flex flex-col items-center">
                 <span className="text-gray-500 mb-2">当前段位</span>
                 <span className="text-3xl font-bold text-cyan-300">{getRankName(pointChange.new)}</span>
               </div>
             </div>

             <button 
               onClick={() => setCurrentScreen('MAIN')}
               className="mt-12 bg-gray-700 hover:bg-gray-600 text-white px-10 py-4 rounded-xl font-bold text-xl transition"
             >
               返回主界面
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

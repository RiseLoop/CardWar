import { motion } from 'motion/react';
import React from 'react';
import { useGame } from '../GameContext';
import { ArrowLeft, Diamond, Hexagon, Octagon } from 'lucide-react';
import { getCardCurrentStats, getPlayerCardCP } from '../lib/utils';
import { CARDS } from '../lib/data';
import { PlayerCard } from '../lib/types';

export const CardsScreen = () => {
  const { playerData, updatePlayer, setCurrentScreen, toast } = useGame();

  const handleRankUp = (pc: PlayerCard) => {
    if (pc.tier >= 5) {
       toast('已达到最高阶。'); return;
    }
    if (pc.fragments < 30) {
       toast('LVL碎片不足，需要30个。'); return;
    }

    updatePlayer(prev => {
      const idx = prev.cards.findIndex(c => c.id === pc.id);
      if (idx === -1) return prev;
      const newCards = [...prev.cards];
      newCards[idx] = { ...newCards[idx], tier: newCards[idx].tier + 1, fragments: newCards[idx].fragments - 30 };
      return { ...prev, cards: newCards };
    });
    toast('升阶成功！');
  };

  const handleLevelUp = (pc: PlayerCard) => {
    if (pc.level >= 25) {
       toast('已达到最高级别。'); return;
    }
    if (playerData.basicParts < 30 || playerData.midParts < 30 || playerData.advParts < 30) {
       toast('升级零件不足，需要初中高级各30个。'); return;
    }

    updatePlayer(prev => {
      const idx = prev.cards.findIndex(c => c.id === pc.id);
      if (idx === -1) return prev;
      const newCards = [...prev.cards];
      newCards[idx] = { ...newCards[idx], level: newCards[idx].level + 1 };
      return { 
        ...prev, 
        cards: newCards,
        basicParts: prev.basicParts - 30,
        midParts: prev.midParts - 30,
        advParts: prev.advParts - 30,
      };
    });
    toast('升级成功！');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="absolute inset-0 bg-gray-900 w-full h-full text-white font-sans flex flex-col p-6 overflow-hidden"
    >
      <div className="flex justify-between items-start mb-6 shrink-0">
        <button 
          onClick={() => setCurrentScreen('MAIN')}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition shadow-lg"
        >
          <ArrowLeft size={28} />
        </button>

        <div className="flex gap-4">
           {/* Parts Displays */}
           <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl border border-gray-700 shadow max-w-fit">
              <span className="text-gray-400 text-sm">初</span>
              <Hexagon size={16} className="text-green-400" />
              <span className="font-mono text-lg">{playerData.basicParts}</span>
           </div>
           <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl border border-gray-700 shadow max-w-fit">
              <span className="text-gray-400 text-sm">中</span>
              <Diamond size={16} className="text-blue-400" />
              <span className="font-mono text-lg">{playerData.midParts}</span>
           </div>
           <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl border border-gray-700 shadow max-w-fit">
              <span className="text-gray-400 text-sm">高</span>
              <Octagon size={16} className="text-purple-400" />
              <span className="font-mono text-lg">{playerData.advParts}</span>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 content-start">
        {playerData.cards.map(pc => {
          const dictCard = CARDS[pc.id];
          if (!dictCard) return null;
          const stats = getCardCurrentStats(pc);
          const cp = getPlayerCardCP(pc);

          return (
            <div key={pc.id} className="bg-gray-800 border border-gray-700 rounded-3xl p-5 shadow-lg flex flex-col items-center">
              <div className="w-full flex justify-between items-start mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  dictCard.quality === '传奇' ? 'bg-orange-600/20 text-orange-400' :
                  dictCard.quality === '稀有' ? 'bg-purple-600/20 text-purple-400' :
                  'bg-blue-600/20 text-blue-400'
                }`}>{dictCard.quality}</span>
                <span className="text-gray-400 text-xs font-mono">CP: {Math.floor(cp)}</span>
              </div>
              
              <h4 className="text-2xl font-black mb-1">{dictCard.name}</h4>
              <div className="flex gap-4 text-sm font-semibold text-gray-300 mb-4">
                <span>{pc.tier} 阶</span>
                <span>{pc.level} 级</span>
              </div>

              <div className="w-full grid grid-cols-2 gap-x-4 gap-y-1 text-sm bg-gray-900/50 p-3 rounded-xl mb-4 font-mono">
                <div className="flex justify-between"><span className="text-gray-500">攻击</span><span>{stats.atk}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">防御</span><span>{stats.def}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">回复</span><span>{stats.rec}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">暴击</span><span>{stats.crit}</span></div>
                <div className="col-span-2 flex justify-between border-t border-gray-700 pt-1 mt-1">
                  <span className="text-gray-500">暴击率</span><span className="text-yellow-400">{stats.critRate}%</span>
                </div>
              </div>

              <div className="text-xs text-center text-gray-400 mb-4">
                碎片: <span className="font-bold text-white">{pc.fragments}</span> / 30
              </div>

              <div className="w-full flex gap-3">
                <button 
                  onClick={() => handleRankUp(pc)}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-2xl font-bold transition shadow-sm flex flex-col items-center justify-center"
                >
                  <span>升阶 (-30碎片)</span>
                  <span className="text-[9px] text-green-300 font-normal leading-tight mx-auto max-w-[100px] text-center flex flex-wrap justify-center mt-1">
                    <span>攻/防/回+20</span>
                    <span>暴+45 暴率+8%</span>
                  </span>
                </button>
                <button 
                  onClick={() => handleLevelUp(pc)}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-2xl font-bold transition shadow-sm flex flex-col items-center justify-center gap-1"
                >
                  <span>升级 (-30/30/30)</span>
                  <span className="text-[10px] text-blue-300 font-normal leading-tight flex-1 flex items-center">
                    {pc.level % 5 === 0 && '攻击+8'}
                    {pc.level % 5 === 1 && '防御+12'}
                    {pc.level % 5 === 2 && '回复+8'}
                    {pc.level % 5 === 3 && '暴击+25'}
                    {pc.level % 5 === 4 && '暴击率+2%'}
                  </span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </motion.div>
  );
};

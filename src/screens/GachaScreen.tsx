import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { ArrowLeft, Check } from 'lucide-react';
import { getCurrentUpCard } from '../lib/utils';
import { CARDS, NORMAL_CARDS, RARE_CARDS, LEGENDARY_CARDS } from '../lib/data';
import { CardData, CardQuality, PlayerData, PlayerCard } from '../lib/types';

export const GachaScreen = () => {
  const { playerData, updatePlayer, setCurrentScreen, toast } = useGame();
  const upCard = getCurrentUpCard();

  const [drawResult, setDrawResult] = useState<CardData[] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [skipAnim, setSkipAnim] = useState(false);

  const drawOne = (): { card: CardData, pityX: number, pityY: number } => {
    let { pityX, pityY } = playerData;
    pityX++;
    pityY++;

    let pulledCard: CardData;

    if (pityY >= 120) {
      pulledCard = upCard;
      pityY = 0;
    } else if (pityX >= 80) {
      // random legendary not UP
      const pool = LEGENDARY_CARDS.filter(c => c.id !== upCard.id);
      pulledCard = pool[Math.floor(Math.random() * pool.length)] || upCard; // fallback if only 1 legend
      pityX = 0;
    } else {
      const rand = Math.random();
      let legProb = (pityX >= 40 || pityY >= 40) ? 0.01 : 0.001;
      let rareProb = 0.10;

      if (rand < legProb) {
        pulledCard = LEGENDARY_CARDS[Math.floor(Math.random() * LEGENDARY_CARDS.length)];
      } else if (rand < legProb + rareProb) {
        pulledCard = RARE_CARDS[Math.floor(Math.random() * RARE_CARDS.length)];
      } else {
        pulledCard = NORMAL_CARDS[Math.floor(Math.random() * NORMAL_CARDS.length)];
      }
    }

    return { card: pulledCard, pityX, pityY };
  };

  const handleDraw = (times: number) => {
    const cost = 200 * times;
    if (playerData.diamonds < cost) {
      toast('钻石不足！');
      return;
    }

    if (!skipAnim) setIsDrawing(true);

    setTimeout(() => {
      let finalCards: CardData[] = [];
      
      let money = playerData.diamonds - cost;
      let pX = playerData.pityX;
      let pY = playerData.pityY;
      let newCards = [...playerData.cards];
      
      let dvip = 0, dblack = 0, dwhite = 0;
      let dfrag: Record<string, number> = {};

      for(let i=0; i<times; i++) {
        pX++;
        pY++;

        let pulledCard: CardData;
        if (pY >= 120) {
          pulledCard = upCard;
          pY = 0;
        } else if (pX >= 80) {
          const pool = LEGENDARY_CARDS.filter(c => c.id !== upCard.id);
          pulledCard = pool[Math.floor(Math.random() * pool.length)] || upCard;
          pX = 0;
        } else {
          const rand = Math.random();
          let legProb = (pX >= 40 || pY >= 40) ? 0.01 : 0.001;
          if (rand < legProb) {
            pulledCard = LEGENDARY_CARDS[Math.floor(Math.random() * LEGENDARY_CARDS.length)];
          } else if (rand < legProb + 0.10) {
            pulledCard = RARE_CARDS[Math.floor(Math.random() * RARE_CARDS.length)];
          } else {
            pulledCard = NORMAL_CARDS[Math.floor(Math.random() * NORMAL_CARDS.length)];
          }
        }
        finalCards.push(pulledCard); // store drawn cards

        // Process duplicate
        const existingIdx = newCards.findIndex(c => c.id === pulledCard.id);
        if (existingIdx !== -1) {
          if (pulledCard.quality === CardQuality.LEGENDARY) {
            dvip += 100; dblack += 30; dwhite += 100;
            dfrag[pulledCard.id] = (dfrag[pulledCard.id] || 0) + 30;
          } else if (pulledCard.quality === CardQuality.RARE) {
            dblack += 15; dwhite += 30;
            dfrag[pulledCard.id] = (dfrag[pulledCard.id] || 0) + 15;
          } else {
            dblack += 2; dwhite += 8;
            dfrag[pulledCard.id] = (dfrag[pulledCard.id] || 0) + 5;
          }
        } else {
          newCards.push({ id: pulledCard.id, tier: 0, level: 0, fragments: 0 });
        }
      }

      // Apply fragments to existing cards
      for (const [id, count] of Object.entries(dfrag)) {
        const idx = newCards.findIndex(c => c.id === id);
        if (idx !== -1) {
          newCards[idx] = { ...newCards[idx], fragments: newCards[idx].fragments + count };
        }
      }

      updatePlayer({
        diamonds: money,
        pityX: pX,
        pityY: pY,
        cards: newCards,
        vipTickets: playerData.vipTickets + dvip,
        blackTickets: playerData.blackTickets + dblack,
        whiteTickets: playerData.whiteTickets + dwhite,
      });

      setDrawResult(finalCards);
      setIsDrawing(false);
      
      if(finalCards.some(c => c.quality === CardQuality.LEGENDARY)) toast('恭喜获得传说卡牌！！！');

    }, skipAnim ? 0 : 800); // anim delay
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="absolute inset-0 bg-gray-900 w-full h-full text-white font-sans flex flex-col p-6"
    >
      <button 
        onClick={() => setCurrentScreen('MAIN')}
        className="absolute top-6 left-6 p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition shadow-lg z-10"
      >
        <ArrowLeft size={28} />
      </button>

      <div className="flex-1 flex items-center justify-center gap-16 ml-10">
        
        {/* UP Card Image (Placeholder) */}
        <div className="relative w-80 h-[450px] bg-gradient-to-br from-yellow-300 to-orange-500 rounded-3xl p-1 shadow-[0_0_40px_rgba(234,179,8,0.4)]">
          <div className="w-full h-full bg-gray-900 rounded-[22px] flex flex-col items-center justify-center overflow-hidden relative">
            {/* simple abstract visual for card */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-100 via-gray-900 to-gray-900"></div>
            <span className="text-xl text-yellow-500 font-bold mb-4 tracking-widest">UP!</span>
            <span className="text-4xl font-black text-gray-100 drop-shadow-lg text-center px-4 z-10">
              {upCard.name}
            </span>
          </div>
        </div>

        {/* UP Card Data & Buttons */}
        <div className="flex flex-col gap-10 min-w-[300px]">
          
          <div className="bg-gray-800/80 p-6 rounded-2xl border border-gray-700 shadow-xl">
            <h3 className="text-2xl font-bold mb-4 text-orange-400">当期 UP 卡牌</h3>
            <div className="flex flex-col gap-2 text-lg text-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-400">品质</span>
                <span className="font-bold text-yellow-400">{upCard.quality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">攻击</span>
                <span className="font-bold">{upCard.baseStats.atk}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">防御</span>
                <span className="font-bold">{upCard.baseStats.def}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">回复</span>
                <span className="font-bold">{upCard.baseStats.rec}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">暴击</span>
                <span className="font-bold">{upCard.baseStats.crit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">暴击率</span>
                <span className="font-bold">{upCard.baseStats.critRate}%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 mt-4 self-end w-full">
            <div className="text-right text-sm text-gray-400 leading-relaxed font-mono bg-gray-800/60 p-3 rounded-lg border border-gray-700 w-full text-right">
              <div>必定获得随机传奇卡牌 <span className="text-white font-bold">{playerData.pityX}/80</span></div>
              <div>必定获得当期up卡牌 <span className="text-yellow-400 font-bold">{playerData.pityY}/120</span></div>
            </div>
            
            <button 
              onClick={() => setSkipAnim(s => !s)}
              className={`py-2 px-4 rounded-xl font-bold flex items-center gap-2 transition self-start ${skipAnim ? 'bg-gray-300 text-gray-900' : 'bg-gray-700 text-gray-300'}`}
            >
              <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${skipAnim ? 'bg-gray-900 border-gray-900' : 'border-gray-500'}`}>
                {skipAnim && <Check size={12} className="text-gray-200" />}
              </div>
              跳过动画
            </button>

            <div className="flex gap-4 w-full">
              <button 
                onClick={() => handleDraw(1)}
                disabled={isDrawing}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition disabled:opacity-50 flex flex-col items-center justify-center"
              >
                <span className="text-lg">抽取1次</span>
                <span className="text-sm font-normal text-blue-200">200 钻石</span>
              </button>
              <button 
                onClick={() => handleDraw(10)}
                disabled={isDrawing}
                className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-xl font-bold transition disabled:opacity-50 flex flex-col items-center justify-center"
              >
                <span className="text-lg">抽取10次</span>
                <span className="text-sm font-normal text-yellow-200">2000 钻石</span>
              </button>
            </div>
          </div>
        </div>

      </div>
      
      {/* Draw Result Overlay */}
      {drawResult && (
        <div className="absolute inset-0 bg-black/80 z-40 flex flex-col items-center justify-center pointer-events-auto backdrop-blur-sm p-10"
             onClick={() => setDrawResult(null)}
        >
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
            {drawResult.map((card, idx) => (
              <motion.div 
                key={idx}
                initial={{ scale: 0.5, y: 100, rotateY: 90 }}
                animate={{ scale: 1, y: 0, rotateY: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`w-40 h-64 rounded-2xl flex flex-col items-center justify-center border-2 shadow-2xl ${
                  card.quality === CardQuality.LEGENDARY ? 'bg-orange-600 border-yellow-300' :
                  card.quality === CardQuality.RARE ? 'bg-purple-700 border-purple-300' :
                  'bg-blue-800 border-blue-300'
                }`}
              >
                 <h2 className="text-xl font-black mb-4 px-2 text-center">{card.name}</h2>
                 <p className="font-bold text-sm bg-black/30 px-3 py-1 rounded-full">{card.quality}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-10 text-lg font-bold text-white/70">点击任意处关闭</p>
        </div>
      )}
      
      {isDrawing && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full"
            />
        </div>
      )}
    </motion.div>
  );
};

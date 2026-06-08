import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { ArrowLeft, Ticket } from 'lucide-react';

type BoxType = 'vip' | 'black' | 'white';

export const ShopScreen = () => {
  const { playerData, updatePlayer, setCurrentScreen, toast } = useGame();
  
  const [openAnim, setOpenAnim] = useState<{type: BoxType, count: number, resultStr: string} | null>(null);

  const buyBox = (type: BoxType, count: number) => {
    let cost = 0;
    if (type === 'vip') cost = 20 * count;
    if (type === 'black') cost = 25 * count;
    if (type === 'white') cost = 50 * count;

    let hasEnough = false;
    if (type === 'vip' && playerData.vipTickets >= cost) hasEnough = true;
    if (type === 'black' && playerData.blackTickets >= cost) hasEnough = true;
    if (type === 'white' && playerData.whiteTickets >= cost) hasEnough = true;

    if (!hasEnough) {
      toast('礼券不足！');
      return;
    }

    // Process Purchase & Open
    let addDia = 0, addBasic = 0, addMid = 0, addAdv = 0;

    for (let i = 0; i < count; i++) {
      const rand = Math.random();
      if (type === 'vip') {
        addDia += 666;
        if (rand < 0.45) { addBasic+=120; addMid+=120; addAdv+=80; }
        else if (rand < 0.60) { addBasic+=388; }
        else if (rand < 0.75) { addMid+=366; }
        else if (rand < 0.90) { addAdv+=288; }
        else if (rand < 1.02) { addBasic+=120; addMid+=120; addAdv+=120; }
        else if (rand < 1.04) { addBasic+=120; addMid+=120; addAdv+=160; }
        else { addBasic+=666; addMid+=666; addAdv+=666; }
      } else if (type === 'black') {
        addDia += 66;
        if (rand < 0.45) { addBasic+=10; addMid+=10; addAdv+=6; }
        else if (rand < 0.60) { addBasic+=28; }
        else if (rand < 0.75) { addMid+=24; }
        else if (rand < 0.90) { addAdv+=18; }
        else if (rand < 1.02) { addBasic+=10; addMid+=10; addAdv+=10; }
        else if (rand < 1.04) { addBasic+=10; addMid+=10; addAdv+=12; }
        else { addBasic+=66; addMid+=66; addAdv+=66; }
      } else if (type === 'white') {
        addDia += 6;
        if (rand < 0.45) { addBasic+=2; addMid+=2; addAdv+=1; }
        else if (rand < 0.60) { addBasic+=6; }
        else if (rand < 0.75) { addMid+=4; }
        else if (rand < 0.90) { addAdv+=3; }
        else if (rand < 1.02) { addBasic+=2; addMid+=2; addAdv+=2; }
        else if (rand < 1.04) { addBasic+=2; addMid+=2; addAdv+=3; }
        else { addBasic+=6; addMid+=6; addAdv+=6; }
      }
    }

    let resultStr = `获得 ${addDia} 钻石\n`;
    if (addBasic) resultStr += `获得 ${addBasic} 初级零件\n`;
    if (addMid) resultStr += `获得 ${addMid} 中级零件\n`;
    if (addAdv) resultStr += `获得 ${addAdv} 高级零件\n`;

    updatePlayer(prev => {
      let v = prev.vipTickets, b = prev.blackTickets, w = prev.whiteTickets;
      if (type === 'vip') v -= cost;
      if (type === 'black') b -= cost;
      if (type === 'white') w -= cost;

      return {
        ...prev,
        vipTickets: v,
        blackTickets: b,
        whiteTickets: w,
        diamonds: prev.diamonds + addDia,
        basicParts: prev.basicParts + addBasic,
        midParts: prev.midParts + addMid,
        advParts: prev.advParts + addAdv,
      };
    });

    setOpenAnim({ type, count, resultStr });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute inset-0 bg-gray-900 w-full h-full text-white font-sans flex flex-col p-6 overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-10 shrink-0">
        <button 
          onClick={() => setCurrentScreen('MAIN')}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition shadow-lg"
        >
          <ArrowLeft size={28} />
        </button>

        <div className="flex gap-4">
           {/* Tickets Displays */}
           <div className="flex flex-col items-center gap-1 bg-gradient-to-b from-orange-400/20 to-gray-800 px-4 py-2 rounded-xl border border-orange-500/30">
              <span className="text-orange-300 text-xs font-bold">尊贵</span>
              <div className="flex items-center gap-2"><Ticket size={16} className="text-orange-400" /><span className="font-mono text-lg">{playerData.vipTickets}</span></div>
           </div>
           <div className="flex flex-col items-center gap-1 bg-gradient-to-b from-gray-500/20 to-gray-800 px-4 py-2 rounded-xl border border-gray-500/30">
              <span className="text-gray-300 text-xs font-bold">黑金</span>
              <div className="flex items-center gap-2"><Ticket size={16} className="text-gray-400" /><span className="font-mono text-lg">{playerData.blackTickets}</span></div>
           </div>
           <div className="flex flex-col items-center gap-1 bg-gradient-to-b from-gray-100/20 to-gray-800 px-4 py-2 rounded-xl border border-gray-100/30">
              <span className="text-white text-xs font-bold">白金</span>
              <div className="flex items-center gap-2"><Ticket size={16} className="text-white" /><span className="font-mono text-lg">{playerData.whiteTickets}</span></div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center gap-8 px-10">
        
        {/* VIP Box */}
        <div className="flex flex-col items-center bg-gray-800 p-8 rounded-3xl border-2 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.3)] w-80">
           <h3 className="text-2xl font-black text-orange-400 mb-6 drop-shadow-sm">尊贵宝箱</h3>
           <div className="w-32 h-32 bg-orange-500/20 rounded-2xl border-4 border-orange-400 mb-8 flex items-center justify-center transform rotate-3">
             <Ticket size={48} className="text-orange-400 drop-shadow-md" />
           </div>
           <div className="text-sm text-gray-400 mb-4 whitespace-pre-line text-center">
             必定获得 <span className="text-cyan-300">666 钻石</span>
             及海量零件
           </div>
           <div className="flex gap-2 w-full mt-4">
             <button onClick={() => buyBox('vip', 1)} className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-xl py-2 font-bold transition flex flex-col items-center">
               <span>开1个</span><span className="text-xs font-mono text-orange-300">20 券</span>
             </button>
             <button onClick={() => buyBox('vip', 10)} className="flex-1 bg-orange-600 hover:bg-orange-500 rounded-xl py-2 font-bold transition flex flex-col items-center">
               <span>开10个</span><span className="text-xs font-mono text-white">200 券</span>
             </button>
           </div>
        </div>

        {/* Black Box */}
        <div className="flex flex-col items-center bg-gray-800 p-8 rounded-3xl border-2 border-gray-500/50 shadow w-80">
           <h3 className="text-2xl font-black text-gray-300 mb-6">黑金宝箱</h3>
           <div className="w-32 h-32 bg-gray-600/20 rounded-2xl border-4 border-gray-400 mb-8 flex items-center justify-center transform -rotate-2">
             <Ticket size={48} className="text-gray-400" />
           </div>
           <div className="text-sm text-gray-400 mb-4 whitespace-pre-line text-center">
             必定获得 <span className="text-cyan-300">66 钻石</span>
             及部分零件
           </div>
           <div className="flex gap-2 w-full mt-4">
             <button onClick={() => buyBox('black', 1)} className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-xl py-2 font-bold transition flex flex-col items-center">
               <span>开1个</span><span className="text-xs font-mono text-gray-300">25 券</span>
             </button>
             <button onClick={() => buyBox('black', 10)} className="flex-1 bg-gray-600 hover:bg-gray-500 rounded-xl py-2 font-bold transition flex flex-col items-center">
               <span>开10个</span><span className="text-xs font-mono text-white">250 券</span>
             </button>
           </div>
        </div>

        {/* White Box */}
        <div className="flex flex-col items-center bg-gray-800 p-8 rounded-3xl border-2 border-gray-200/50 shadow w-80">
           <h3 className="text-2xl font-black text-white mb-6">白金宝箱</h3>
           <div className="w-32 h-32 bg-gray-100/20 rounded-2xl border-4 border-gray-100 mb-8 flex items-center justify-center transform rotate-1">
             <Ticket size={48} className="text-white" />
           </div>
           <div className="text-sm text-gray-400 mb-4 whitespace-pre-line text-center">
             必定获得 <span className="text-cyan-300">6 钻石</span>
             及少量零件
           </div>
           <div className="flex gap-2 w-full mt-4">
             <button onClick={() => buyBox('white', 1)} className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-xl py-2 font-bold transition flex flex-col items-center">
               <span>开1个</span><span className="text-xs font-mono text-white">50 券</span>
             </button>
             <button onClick={() => buyBox('white', 10)} className="flex-1 bg-gray-100 text-gray-900 hover:bg-white rounded-xl py-2 font-bold transition flex flex-col items-center">
               <span>开10个</span><span className="text-xs font-mono text-gray-600">500 券</span>
             </button>
           </div>
        </div>
      </div>

      <AnimatePresence>
      {openAnim && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-md"
          onClick={() => setOpenAnim(null)}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className={`w-[400px] bg-gray-800 p-10 flex flex-col items-center text-center rounded-3xl border-4 shadow-2xl ${
              openAnim.type === 'vip' ? 'border-orange-500' :
              openAnim.type === 'black' ? 'border-gray-500' :
              'border-white'
            }`}
          >
            <h2 className="text-4xl font-black mb-8">
               开启 {openAnim.count} 个宝箱
            </h2>
            <div className="text-lg leading-loose font-mono text-cyan-200">
               {openAnim.resultStr.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
            
            <p className="mt-12 text-sm text-gray-400">点击任意处关闭</p>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

    </motion.div>
  );
};

import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { ArrowLeft, Swords } from 'lucide-react';

export const ModeScreen = () => {
  const { setCurrentScreen } = useGame();
  const [selectedMode, setSelectedMode] = useState<string | null>('rank1v1');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 bg-gray-900 w-full h-full text-white font-sans flex flex-col p-6"
    >
      <div className="flex justify-between items-start shrink-0 h-20">
         <button 
          onClick={() => setCurrentScreen('MAIN')}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition shadow-lg"
        >
          <ArrowLeft size={28} />
        </button>
      </div>
      
      <div className="flex-1 flex w-full">
        {/* Left Tabs */}
        <div className="w-1/4 min-w-[200px] border-r border-gray-700 pr-6 flex flex-col gap-4">
           <button 
             onClick={() => setSelectedMode('rank1v1')}
             className={`w-full py-4 text-xl font-bold rounded-2xl transition flex items-center justify-center gap-3 ${
               selectedMode === 'rank1v1' 
               ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
               : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
             }`}
           >
             <Swords size={24} />
             单人排位
           </button>
        </div>

        {/* Right Content */}
        <div className="flex-1 pl-10 relative">
            {selectedMode === 'rank1v1' && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                 <h2 className="text-5xl font-black mb-8 text-red-500 tracking-widest drop-shadow-md">单人排位</h2>
                 <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                   与其他玩家展开对决！提升排位分，冲击传说级别！每场对战皆由实力决定。
                 </p>
                 
                 <div className="absolute bottom-10 right-10">
                    <button 
                      onClick={() => setCurrentScreen('MATCH')}
                      className="bg-red-600 hover:bg-red-500 active:bg-red-700 text-white px-10 py-5 rounded-2xl font-black text-2xl shadow-[0_0_20px_rgba(220,38,38,0.6)] transition hover:scale-105"
                    >
                      开始匹配
                    </button>
                 </div>
              </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

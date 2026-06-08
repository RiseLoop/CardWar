import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { getRankName, downloadJson } from '../lib/utils';
import { Settings, Coins, Gem } from 'lucide-react';

export const MainScreen = () => {
  const { playerData, updatePlayer, setCurrentScreen, toast } = useGame();
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [newName, setNewName] = useState(playerData.name);

  const handleChangeName = () => {
    if (playerData.diamonds < 666) {
      toast('钻石不足！需要666钻石。');
      return;
    }
    if (!newName.trim()) {
      toast('名字不能为空。');
      return;
    }
    updatePlayer((prev) => ({
      ...prev,
      name: newName,
      diamonds: prev.diamonds - 666
    }));
    setShowNameEdit(false);
    toast('名字修改成功！');
  };

  const handleSave = () => {
    downloadJson(playerData, 'save');
    toast('存档已下载');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute inset-0 bg-gray-900 w-full h-full p-6 text-white font-sans flex flex-col"
    >
      {/* Top Banner Area */}
      <div className="flex justify-between items-start w-full pointer-events-none">
        
        {/* Top Left: Player Info */}
        <div className="pointer-events-auto flex flex-col items-start gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-gray-100">{playerData.name}</h2>
            <button 
              onClick={() => setShowNameEdit(true)}
              className="bg-gray-100 text-gray-900 text-sm font-semibold px-3 py-1 rounded-xl shadow hover:bg-gray-200 transition"
            >
              更改名字
            </button>
          </div>
          <p className="text-xl font-medium text-gray-400 bg-gray-800 px-3 py-1 rounded-lg">
            {getRankName(playerData.rankPoints)}
          </p>

          <div className="flex flex-col gap-3 mt-6">
            <button 
              onClick={() => setCurrentScreen('GACHA')}
              className="w-48 h-12 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold rounded-xl shadow-lg transition"
            >
              卡牌商展
            </button>
            <button 
              onClick={() => setCurrentScreen('SHOP')}
              className="w-24 h-24 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold rounded-2xl shadow-lg transition flex items-center justify-center"
            >
              商城
            </button>
          </div>
        </div>

        {/* Top Right: Resources & System */}
        <div className="pointer-events-auto flex flex-col items-end gap-3">
          <div className="flex items-center gap-4 bg-gray-800/80 p-2 rounded-xl border border-gray-700">
            <div className="flex items-center gap-2 text-yellow-300 font-bold text-lg min-w-24 justify-end">
              <span>{playerData.coins}</span>
              <Coins size={20} />
            </div>
            <div className="w-px h-6 bg-gray-600"></div>
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-lg min-w-24 justify-end">
              <span>{playerData.diamonds}</span>
              <Gem size={20} />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
             <button
              onClick={handleSave}
              className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold px-6 py-2 rounded-xl shadow-lg transition"
            >
              存档
            </button>
            <button 
              onClick={() => setCurrentScreen('SETTINGS')}
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition border border-gray-700 shadow"
            >
              <Settings size={28} className="text-gray-300" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Area */}
      <div className="flex-1 pointer-events-none pb-4 flex justify-between items-end w-full">
        <button
           onClick={() => setCurrentScreen('CARDS')}
           className="pointer-events-auto text-gray-400 hover:text-gray-200 font-bold text-4xl p-6 transition drop-shadow-md"
        >
          卡牌
        </button>

        <button
           onClick={() => setCurrentScreen('MODE')}
           className="pointer-events-auto w-32 h-32 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xl rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        >
          选择模式
        </button>
      </div>

      {/* Name Edit Modal Overlay */}
      {showNameEdit && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center pointer-events-auto">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 flex flex-col gap-6 w-96">
            <h3 className="text-xl font-bold text-center">修改名字</h3>
            <p className="text-sm text-gray-400 text-center">需要消耗666钻石</p>
            <input 
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500 transition"
              autoFocus
            />
            <div className="flex gap-4">
              <button 
                onClick={() => setShowNameEdit(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition"
              >
                取消
              </button>
              <button 
                onClick={handleChangeName}
                className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 rounded-xl font-bold transition flex flex-col items-center justify-center leading-tight"
              >
                <span>确认修改</span>
                <span className="text-[10px] font-normal text-yellow-900">-666 钻石</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
};

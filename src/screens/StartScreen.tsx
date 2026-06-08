import { motion } from 'motion/react';
import React, { useRef } from 'react';
import { useGame } from '../GameContext';
import { DEFAULT_PLAYER_DATA } from '../lib/data';

export const StartScreen = () => {
  const { setPlayerData, setCurrentScreen, toast } = useGame();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startNewGame = () => {
    setPlayerData(DEFAULT_PLAYER_DATA);
    setCurrentScreen('MAIN');
  };

  const loadGameData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data && typeof data === 'object' && ('name' in data)) {
          setPlayerData(data);
          setCurrentScreen('MAIN');
          toast('读取存档成功');
        } else {
          toast('存档格式错误');
        }
      } catch (err) {
        toast('读取失败，非有效JSON文件');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 flex items-center justify-center bg-gray-900"
    >
      <div className="w-[400px] h-[550px] rounded-3xl bg-gradient-to-br from-red-600 to-blue-600 p-2 shadow-2xl">
        <div className="w-full h-full rounded-2xl bg-gray-200 flex flex-col items-center py-20 relative">
          <h1 className="text-6xl font-serif text-gray-800 font-bold tracking-widest drop-shadow-sm italic mb-auto">
            卡牌战争
          </h1>

          <div className="flex flex-col gap-6 w-3/4 mb-10">
            <button
              onClick={startNewGame}
              className="w-full py-4 bg-yellow-100 hover:bg-yellow-200 active:bg-yellow-300 text-gray-800 text-xl font-bold rounded-2xl transition shadow-sm"
            >
              开始新游戏
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 bg-yellow-100 hover:bg-yellow-200 active:bg-yellow-300 text-gray-800 text-xl font-bold rounded-2xl transition shadow-sm"
            >
              读取存档
            </button>
          </div>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            className="hidden"
            onChange={loadGameData}
          />
        </div>
      </div>
    </motion.div>
  );
};

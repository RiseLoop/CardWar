import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { ArrowLeft } from 'lucide-react';

export const SettingsScreen = () => {
  const { updatePlayer, setCurrentScreen, toast } = useGame();
  const [code, setCode] = useState('');

  const handleRedeem = () => {
    const c = code.trim();
    const parts = c.split(' ');
    
    let valid = false;
    let successMsg = '兑换成功';

    try {
      if (parts[0] === '/money' && parts.length === 3) {
        const amt = parseInt(parts[2]);
        if (!isNaN(amt)) {
          if (parts[1] === 'add') { updatePlayer(p => ({ coins: p.coins + amt })); valid = true; }
          if (parts[1] === 'remove') { updatePlayer(p => ({ coins: p.coins - amt })); valid = true; }
          if (parts[1] === 'set') { updatePlayer(p => ({ coins: amt })); valid = true; }
        }
      } else if (parts[0] === '/diamond' && parts.length === 3) {
        const amt = parseInt(parts[2]);
        if (!isNaN(amt)) {
          if (parts[1] === 'add') { updatePlayer(p => ({ diamonds: p.diamonds + amt })); valid = true; }
          if (parts[1] === 'remove') { updatePlayer(p => ({ diamonds: p.diamonds - amt })); valid = true; }
          if (parts[1] === 'set') { updatePlayer(p => ({ diamonds: amt })); valid = true; }
        }
      } else if (parts[0] === '/ticket' && parts.length === 3) {
        const amt = parseInt(parts[2]);
        if (!isNaN(amt) && amt > 0) {
          if (parts[1] === 'vip') { updatePlayer(p => ({ vipTickets: p.vipTickets + amt })); valid = true; }
          if (parts[1] === 'black') { updatePlayer(p => ({ blackTickets: p.blackTickets + amt })); valid = true; }
          if (parts[1] === 'white') { updatePlayer(p => ({ whiteTickets: p.whiteTickets + amt })); valid = true; }
        }
      }
    } catch (err) {}

    if (valid) {
      toast(successMsg);
      setCode('');
    } else {
      toast('兑换失败，格式错误');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="absolute inset-0 bg-gray-900 w-full h-full text-white font-sans flex flex-col p-6"
    >
      <button 
        onClick={() => setCurrentScreen('MAIN')}
        className="absolute top-6 left-6 p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition shadow-lg z-10"
      >
        <ArrowLeft size={28} />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <div className="bg-gray-800 w-[500px] p-10 rounded-3xl border border-gray-700 shadow-xl flex flex-col items-center">
            <h2 className="text-3xl font-black mb-8 tracking-widest text-gray-200">兑换码</h2>
            
            <input 
              type="text" 
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="输入神秘代码..."
              className="w-full bg-gray-900 border-2 border-gray-600 rounded-xl px-4 py-3 text-white text-center font-mono text-lg outline-none focus:border-yellow-500 transition mb-6"
              onKeyDown={e => e.key === 'Enter' && handleRedeem()}
            />

            <button 
              onClick={handleRedeem}
              className="w-full bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700 text-gray-900 font-bold py-4 rounded-xl text-lg transition shadow-md"
            >
              立刻兑换
            </button>
        </div>
      </div>
    </motion.div>
  );
};

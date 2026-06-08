import React, { createContext, useContext, useState, useRef } from 'react';
import { PlayerData, ScreenType } from './lib/types';
import { DEFAULT_PLAYER_DATA } from './lib/data';

interface GameContextState {
  playerData: PlayerData;
  setPlayerData: React.Dispatch<React.SetStateAction<PlayerData>>;
  currentScreen: ScreenType;
  setCurrentScreen: React.Dispatch<React.SetStateAction<ScreenType>>;
  updatePlayer: (updates: Partial<PlayerData> | ((prev: PlayerData) => PlayerData)) => void;
  toast: (msg: string) => void;
}

const GameContext = createContext<GameContextState | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerData, setPlayerData] = useState<PlayerData>(DEFAULT_PLAYER_DATA);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('START');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const updatePlayer = (updates: Partial<PlayerData> | ((prev: PlayerData) => PlayerData)) => {
    setPlayerData(prev => {
      if (typeof updates === 'function') {
        const result = updates(prev);
        return { ...prev, ...result };
      }
      return { ...prev, ...updates };
    });
  };

  const toast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <GameContext.Provider value={{ playerData, setPlayerData, currentScreen, setCurrentScreen, updatePlayer, toast }}>
      {children}
      {toastMsg && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg pointer-events-none animate-in fade-in slide-in-from-top-5">
          {toastMsg}
        </div>
      )}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};

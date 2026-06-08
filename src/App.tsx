/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameProvider, useGame } from './GameContext';
import { StartScreen } from './screens/StartScreen';
import { MainScreen } from './screens/MainScreen';
import { GachaScreen } from './screens/GachaScreen';
import { CardsScreen } from './screens/CardsScreen';
import { ShopScreen } from './screens/ShopScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ModeScreen } from './screens/ModeScreen';
import { MatchScreen } from './screens/MatchScreen';
import { AnimatePresence } from 'motion/react';

function AppContent() {
  const { currentScreen } = useGame();

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center overflow-hidden font-sans relative">
      <AnimatePresence mode="wait">
        {currentScreen === 'START' && <StartScreen key="START" />}
        {currentScreen === 'MAIN' && <MainScreen key="MAIN" />}
        {currentScreen === 'GACHA' && <GachaScreen key="GACHA" />}
        {currentScreen === 'CARDS' && <CardsScreen key="CARDS" />}
        {currentScreen === 'SHOP' && <ShopScreen key="SHOP" />}
        {currentScreen === 'SETTINGS' && <SettingsScreen key="SETTINGS" />}
        {currentScreen === 'MODE' && <ModeScreen key="MODE" />}
        {currentScreen === 'MATCH' && <MatchScreen key="MATCH" />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}


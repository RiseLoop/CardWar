import { CardData, CardQuality, PlayerData, PlayerCard, CardStats } from './types';

export const CARDS: Record<string, CardData> = {
  // 普通卡 (Normal)
  'n_1': { id: 'n_1', name: '步兵', quality: CardQuality.NORMAL, baseStats: { atk: 10, def: 5, rec: 2, crit: 10, critRate: 5 } },
  'n_2': { id: 'n_2', name: '弓箭手', quality: CardQuality.NORMAL, baseStats: { atk: 15, def: 2, rec: 1, crit: 20, critRate: 8 } },
  'n_3': { id: 'n_3', name: '牧师', quality: CardQuality.NORMAL, baseStats: { atk: 5, def: 5, rec: 15, crit: 5, critRate: 2 } },
  
  // 稀有卡 (Rare)
  'r_1': { id: 'r_1', name: '骑士', quality: CardQuality.RARE, baseStats: { atk: 25, def: 20, rec: 5, crit: 30, critRate: 10 } },
  'r_2': { id: 'r_2', name: '刺客', quality: CardQuality.RARE, baseStats: { atk: 35, def: 10, rec: 5, crit: 50, critRate: 20 } },
  'r_3': { id: 'r_3', name: '大魔法师', quality: CardQuality.RARE, baseStats: { atk: 40, def: 15, rec: 10, crit: 40, critRate: 15 } },

  // 传奇卡 (Legendary)
  'l_1': { id: 'l_1', name: '龙骑士', quality: CardQuality.LEGENDARY, baseStats: { atk: 60, def: 40, rec: 20, crit: 80, critRate: 25 } },
  'l_2': { id: 'l_2', name: '堕落天使', quality: CardQuality.LEGENDARY, baseStats: { atk: 80, def: 20, rec: 10, crit: 120, critRate: 35 } },
  'l_3': { id: 'l_3', name: '神圣守护神', quality: CardQuality.LEGENDARY, baseStats: { atk: 40, def: 80, rec: 50, crit: 40, critRate: 15 } },
  'l_4': { id: 'l_4', name: '元素领主', quality: CardQuality.LEGENDARY, baseStats: { atk: 70, def: 30, rec: 30, crit: 100, critRate: 30 } },
};

export const NORMAL_CARDS = Object.values(CARDS).filter(c => c.quality === CardQuality.NORMAL);
export const RARE_CARDS = Object.values(CARDS).filter(c => c.quality === CardQuality.RARE);
export const LEGENDARY_CARDS = Object.values(CARDS).filter(c => c.quality === CardQuality.LEGENDARY);

export const DEFAULT_PLAYER_DATA: PlayerData = {
  name: '新人牌手',
  rankPoints: 0,
  diamonds: 10000, // Starts with some
  coins: 10000,
  cards: [{ id: 'n_1', tier: 0, level: 0, fragments: 0 }],
  pityX: 0,
  pityY: 0,
  basicParts: 0,
  midParts: 0,
  advParts: 0,
  vipTickets: 0,
  blackTickets: 0,
  whiteTickets: 0,
};

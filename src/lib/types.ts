export enum CardQuality {
  NORMAL = '普通',
  RARE = '稀有',
  LEGENDARY = '传奇',
}

export interface CardStats {
  atk: number;
  def: number;
  rec: number;
  crit: number;
  critRate: number; 
}

export interface CardData {
  id: string;
  name: string;
  quality: CardQuality;
  baseStats: CardStats;
}

export interface PlayerCard {
  id: string;
  tier: number; 
  level: number; 
  fragments: number;
}

export interface PlayerData {
  name: string;
  rankPoints: number;
  diamonds: number;
  coins: number;

  cards: PlayerCard[];

  pityX: number; 
  pityY: number; 

  basicParts: number;
  midParts: number;
  advParts: number;

  vipTickets: number; 
  blackTickets: number; 
  whiteTickets: number; 
}

export type ScreenType = 'START' | 'MAIN' | 'GACHA' | 'CARDS' | 'SHOP' | 'SETTINGS' | 'MODE' | 'MATCH';

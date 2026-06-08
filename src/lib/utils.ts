import { PlayerCard, CardStats } from './types';
import { CARDS } from './data';

export function getRankName(points: number): string {
  if (points <= 99) return '初级牌手';
  if (points <= 299) return '中级牌手';
  if (points <= 499) return '高级牌手';
  if (points <= 999) return '资深牌手';
  if (points <= 1499) return '顶尖牌手';
  if (points <= 1999) return '牌圣';
  if (points <= 2499) return '牌神';
  if (points <= 2999) return '无双牌神';
  if (points <= 3499) return '传奇牌神';
  return `巅峰牌神${points - 3500}分`;
}

export function getCurrentUpCard() {
  const epoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 5));
  const lCards = Object.values(CARDS).filter(c => c.quality === '传奇');
  return lCards[epoch % lCards.length];
}

export function getCardCurrentStats(playerCard: PlayerCard): CardStats {
  const baseDef = CARDS[playerCard.id]!.baseStats;
  const stats = { ...baseDef };

  // Tier updates
  stats.atk += playerCard.tier * 20;
  stats.def += playerCard.tier * 20;
  stats.rec += playerCard.tier * 20;
  stats.crit += playerCard.tier * 45;
  stats.critRate += playerCard.tier * 8;

  // Level updates
  for (let i = 0; i < playerCard.level; i++) {
    const r = i % 5;
    if (r === 0) stats.atk += 8;
    else if (r === 1) stats.def += 12;
    else if (r === 2) stats.rec += 8;
    else if (r === 3) stats.crit += 25;
    else if (r === 4) stats.critRate += 2;
  }
  return stats;
}

export function getCardCP(stats: CardStats): number {
  return stats.atk * 1.1 + stats.def + stats.rec + stats.crit * (stats.critRate / 100) * 1.5;
}

export function getPlayerCardCP(playerCard: PlayerCard): number {
  return getCardCP(getCardCurrentStats(playerCard));
}

export function downloadJson(data: any, prefix = 'save') {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  const timeStr = `${yyyy}${mm}${dd}-${hh}${mins}${ss}`;
  
  a.href = url;
  a.download = `${prefix}_${timeStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * 在线抽签（观音签/月老签/关帝签等通用框架）。
 * 逻辑本体是"受控随机 + 签文库"；签文数据由 content 层提供。
 * 支持传入随机源，便于测试与"每日一签"（用日期做种子）等玩法。
 */

export interface QianEntry {
  /** 签号（1 起） */
  no: number;
  /** 吉凶等级：上上/上吉/中吉/中平/下下 等，随签种而定 */
  level: string;
  /** 签诗 */
  poem: string;
  /** 解曰/圣意 */
  explain: string;
  /** 分项解读（事业/姻缘/求财/健康…），可选 */
  aspects?: Record<string, string>;
}

export interface QianSet {
  name: string;
  entries: QianEntry[];
}

export type RandomFn = () => number;

export function drawQian(set: QianSet, random: RandomFn = Math.random): QianEntry {
  if (set.entries.length === 0) throw new Error(`签库 ${set.name} 为空`);
  const idx = Math.floor(random() * set.entries.length);
  return set.entries[Math.min(idx, set.entries.length - 1)]!;
}

/**
 * 确定性签：同一 key（如 用户ID+日期）永远得到同一支签，用于"每日一签"。
 * 使用 FNV-1a 哈希，无需加密强度。
 */
export function drawDailyQian(set: QianSet, key: string): QianEntry {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  const idx = h % set.entries.length;
  return set.entries[idx]!;
}

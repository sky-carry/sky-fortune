import type { WuXing } from '@sky-fortune/engine';
import hanziJson from '../data/hanzi.json';

/**
 * 汉字字典：康熙笔画 + 五行。
 * 数据构建与来源见 data/PROVENANCE.md（8830 常用字，22 字抽样验证通过）。
 */

export interface HanziInfo {
  char: string;
  /** 康熙字典笔画（五格剖象法用） */
  kangxiStrokes: number;
  /** 字的五行属性 */
  wuxing: WuXing;
}

const DICT = hanziJson as unknown as Record<string, { k: number; w: WuXing }>;

export function lookupHanzi(char: string): HanziInfo | null {
  const e = DICT[char];
  if (!e) return null;
  return { char, kangxiStrokes: e.k, wuxing: e.w };
}

/**
 * 整词查询，任何一个字缺失时返回缺失字列表。
 * 用于测名/起名入口的输入校验。
 */
export function lookupName(text: string):
  | { ok: true; chars: HanziInfo[] }
  | { ok: false; missing: string[] } {
  const chars: HanziInfo[] = [];
  const missing: string[] = [];
  for (const ch of Array.from(text)) {
    const info = lookupHanzi(ch);
    if (info) chars.push(info);
    else missing.push(ch);
  }
  return missing.length > 0 ? { ok: false, missing } : { ok: true, chars };
}

export function hanziCount(): number {
  return Object.keys(DICT).length;
}

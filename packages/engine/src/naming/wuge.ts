import { shuLiOf, type ShuLiEntry } from './shuli';

/**
 * 五格剖象法。笔画一律使用《康熙字典》繁体笔画（由调用方通过字典查得）。
 * 计算规则（docs/research/03 §2.3）：
 * - 天格：单姓 = 姓 +1；复姓 = 两字之和
 * - 人格：姓氏末字 + 名首字
 * - 地格：单名 = 名 +1；双名 = 两字之和
 * - 外格：姓首字（单姓计 1）+ 名末字（单名计 1）
 * - 总格：姓名全部笔画之和
 */

export interface CharStroke {
  char: string;
  strokes: number;
}

export interface GeValue {
  value: number;
  shuLi: ShuLiEntry & { value: number };
}

export interface WuGe {
  tian: GeValue;
  ren: GeValue;
  di: GeValue;
  wai: GeValue;
  zong: GeValue;
}

function ge(value: number): GeValue {
  return { value, shuLi: shuLiOf(value) };
}

export function computeWuGe(surname: CharStroke[], given: CharStroke[]): WuGe {
  if (surname.length < 1 || surname.length > 2 || given.length < 1 || given.length > 2) {
    throw new Error('仅支持 1-2 字姓氏与 1-2 字名');
  }
  const s = surname.map((c) => c.strokes);
  const g = given.map((c) => c.strokes);

  const tian = surname.length === 2 ? s[0]! + s[1]! : s[0]! + 1;
  const ren = s[s.length - 1]! + g[0]!;
  const di = given.length === 2 ? g[0]! + g[1]! : g[0]! + 1;
  const wai = (surname.length === 2 ? s[0]! : 1) + (given.length === 2 ? g[g.length - 1]! : 1);
  const zong = [...s, ...g].reduce((a, b) => a + b, 0);

  return { tian: ge(tian), ren: ge(ren), di: ge(di), wai: ge(wai), zong: ge(zong) };
}

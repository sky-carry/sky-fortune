import { type Gan, type Zhi, type WuXing, GAN_WUXING, sheng, ke } from '../bazi/tables';
import type { BaziChart } from '../bazi/chart';

/**
 * 八字合婚打分。
 * 口径（产品自定加权，docs/research/03 §5）：基础分 60，各维度加减后夹到 0-100。
 *   年支（生肖）：六合 +10 / 三合 +8 / 六冲 -12 / 相害 -8 / 相刑 -6
 *   日支：       六合 +10 / 三合 +8 / 六冲 -12 / 相害 -8 / 相刑 -6
 *   日干五合：+10
 *   年柱纳音五行：相生 +6 / 比和 +2 / 相克 -6
 *   用神互补：一方命局最旺五行为另一方喜用神 → 每向 +7（最多 +14）
 * 输出保留逐条明细，供解读文案层引用。文案输出一律为"参考建议"口吻，
 * 禁止"相冲不能结婚"类绝对化表述（合规要求）。
 */

/** 地支六合 */
const LIU_HE: ReadonlyArray<readonly [Zhi, Zhi]> = [
  ['子', '丑'], ['寅', '亥'], ['卯', '戌'], ['辰', '酉'], ['巳', '申'], ['午', '未'],
];

/** 地支三合局 */
const SAN_HE: ReadonlyArray<readonly Zhi[]> = [
  ['申', '子', '辰'], ['寅', '午', '戌'], ['巳', '酉', '丑'], ['亥', '卯', '未'],
];

/** 地支六冲 */
const LIU_CHONG: ReadonlyArray<readonly [Zhi, Zhi]> = [
  ['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥'],
];

/** 地支相害 */
const LIU_HAI: ReadonlyArray<readonly [Zhi, Zhi]> = [
  ['子', '未'], ['丑', '午'], ['寅', '巳'], ['卯', '辰'], ['申', '亥'], ['酉', '戌'],
];

/** 相刑（寅巳申、丑戌未两组两两互刑 + 子卯刑 + 自刑） */
const XING_PAIRS: ReadonlyArray<readonly [Zhi, Zhi]> = [
  ['寅', '巳'], ['巳', '申'], ['寅', '申'],
  ['丑', '戌'], ['戌', '未'], ['丑', '未'],
  ['子', '卯'],
];
const SELF_XING: readonly Zhi[] = ['辰', '午', '酉', '亥'];

/** 天干五合 */
const GAN_WU_HE: ReadonlyArray<readonly [Gan, Gan]> = [
  ['甲', '己'], ['乙', '庚'], ['丙', '辛'], ['丁', '壬'], ['戊', '癸'],
];

function inPairs(pairs: ReadonlyArray<readonly [string, string]>, a: string, b: string): boolean {
  return pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

export function zhiLiuHe(a: Zhi, b: Zhi): boolean { return inPairs(LIU_HE, a, b); }
export function zhiSanHe(a: Zhi, b: Zhi): boolean {
  return a !== b && SAN_HE.some((g) => g.includes(a) && g.includes(b));
}
export function zhiLiuChong(a: Zhi, b: Zhi): boolean { return inPairs(LIU_CHONG, a, b); }
export function zhiLiuHai(a: Zhi, b: Zhi): boolean { return inPairs(LIU_HAI, a, b); }
export function zhiXing(a: Zhi, b: Zhi): boolean {
  if (a === b) return SELF_XING.includes(a);
  return inPairs(XING_PAIRS, a, b);
}
export function ganWuHe(a: Gan, b: Gan): boolean { return inPairs(GAN_WU_HE, a, b); }

/** 纳音名称末字即其五行（如"海中金"→ 金） */
export function naYinElement(naYin: string): WuXing {
  const last = naYin.charAt(naYin.length - 1) as WuXing;
  return last;
}

export interface HehunItem {
  rule: string;
  delta: number;
  desc: string;
}

export interface HehunResult {
  score: number;
  grade: '天作之合' | '相处融洽' | '中平之配' | '需多磨合';
  items: HehunItem[];
}

function zhiRelationItems(label: string, a: Zhi, b: Zhi): HehunItem[] {
  const items: HehunItem[] = [];
  if (zhiLiuHe(a, b)) items.push({ rule: `${label}六合`, delta: 10, desc: `${a}${b}六合，情投意合` });
  if (zhiSanHe(a, b)) items.push({ rule: `${label}三合`, delta: 8, desc: `${a}${b}三合，同心同德` });
  if (zhiLiuChong(a, b)) items.push({ rule: `${label}六冲`, delta: -12, desc: `${a}${b}相冲，观念易有分歧` });
  if (zhiLiuHai(a, b)) items.push({ rule: `${label}相害`, delta: -8, desc: `${a}${b}相害，需注意沟通` });
  if (zhiXing(a, b)) items.push({ rule: `${label}相刑`, delta: -6, desc: `${a}${b}相刑，宜互相包容` });
  return items;
}

function dominantElement(chart: BaziChart): WuXing {
  const entries = Object.entries(chart.strength.scores) as Array<[WuXing, number]>;
  return entries.reduce((max, cur) => (cur[1] > max[1] ? cur : max))[0];
}

export function scoreHehun(a: BaziChart, b: BaziChart): HehunResult {
  const items: HehunItem[] = [];

  items.push(...zhiRelationItems('生肖', a.pillars.year.zhi, b.pillars.year.zhi));
  items.push(...zhiRelationItems('日支', a.pillars.day.zhi, b.pillars.day.zhi));

  if (ganWuHe(a.dayMaster, b.dayMaster)) {
    items.push({ rule: '日干五合', delta: 10, desc: `${a.dayMaster}${b.dayMaster}相合，日主相配` });
  }

  const naA = naYinElement(a.pillars.year.naYin);
  const naB = naYinElement(b.pillars.year.naYin);
  if (sheng(naA, naB) || sheng(naB, naA)) {
    items.push({ rule: '纳音相生', delta: 6, desc: `年命${naA}${naB}相生，互相成就` });
  } else if (naA === naB) {
    items.push({ rule: '纳音比和', delta: 2, desc: `年命同属${naA}，气质相近` });
  } else if (ke(naA, naB) || ke(naB, naA)) {
    items.push({ rule: '纳音相克', delta: -6, desc: `年命${naA}${naB}相克，需互相体谅` });
  }

  const domA = dominantElement(a);
  const domB = dominantElement(b);
  if (a.strength.favorable.includes(domB)) {
    items.push({ rule: '用神互补', delta: 7, desc: `对方${domB}旺，恰为己方喜用` });
  }
  if (b.strength.favorable.includes(domA)) {
    items.push({ rule: '用神互补', delta: 7, desc: `己方${domA}旺，恰为对方喜用` });
  }

  const raw = 60 + items.reduce((s, it) => s + it.delta, 0);
  const score = Math.max(0, Math.min(100, raw));
  const grade: HehunResult['grade'] =
    score >= 85 ? '天作之合' : score >= 70 ? '相处融洽' : score >= 55 ? '中平之配' : '需多磨合';

  return { score, grade, items };
}

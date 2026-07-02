import { type WuXing, sheng, ke } from '../bazi/tables';
import type { WuGe } from './wuge';

/**
 * 三才配置（天格/人格/地格的五行生克）。
 * 口径：数字尾数定五行（1、2木 3、4火 5、6土 7、8金 9、10水，0 按 10），
 * 相邻两对关系（天-人、人-地）打分：相生 2 分、比和 1 分、相克 0 分（不论方向），
 * 合计 4 → 大吉，3 → 吉，2 → 半吉，≤1 → 凶。
 * 说明：传统三才表为 125 组逐条断语且各版本互有出入，本引擎采用纯生克规则推导，
 * 保证确定性与可测试性；逐组断语文案后续由 content 层按组合键补充。
 */

export type SanCaiKind = '大吉' | '吉' | '半吉' | '凶';

export interface SanCaiResult {
  elements: [WuXing, WuXing, WuXing];
  combination: string;
  kind: SanCaiKind;
  score: number;
}

export function digitElement(n: number): WuXing {
  const d = n % 10 === 0 ? 10 : n % 10;
  if (d <= 2) return '木';
  if (d <= 4) return '火';
  if (d <= 6) return '土';
  if (d <= 8) return '金';
  return '水';
}

function pairScore(a: WuXing, b: WuXing): number {
  if (a === b) return 1;
  if (sheng(a, b) || sheng(b, a)) return 2;
  if (ke(a, b) || ke(b, a)) return 0;
  return 1;
}

export const SANCAI_SCORE: Record<SanCaiKind, number> = {
  大吉: 100, 吉: 85, 半吉: 60, 凶: 35,
};

export function computeSanCai(wuGe: WuGe): SanCaiResult {
  const tian = digitElement(wuGe.tian.value);
  const ren = digitElement(wuGe.ren.value);
  const di = digitElement(wuGe.di.value);
  const total = pairScore(tian, ren) + pairScore(ren, di);
  const kind: SanCaiKind = total === 4 ? '大吉' : total === 3 ? '吉' : total === 2 ? '半吉' : '凶';
  return {
    elements: [tian, ren, di],
    combination: `${tian}${ren}${di}`,
    kind,
    score: SANCAI_SCORE[kind],
  };
}

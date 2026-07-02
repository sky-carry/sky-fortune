import type { WuXing } from '../bazi/tables';
import { computeWuGe, type CharStroke, type WuGe } from './wuge';
import { computeSanCai, type SanCaiResult } from './sancai';
import { SHULI_SCORE } from './shuli';

/**
 * 姓名综合打分。
 * 权重口径（产品自定，冻结后不轻易改）：
 *   人格 30% + 总格 20% + 地格 15% + 外格 5% + 天格 5% + 三才 25% = 基础分
 *   若提供八字喜用神与用字五行 → 最终分 = 基础分 × 0.8 + 八字契合分 × 0.2
 * 天格由姓氏决定、不可选，故权重最低，仅作展示。
 */

export interface NameScoreInput {
  surname: CharStroke[];
  given: CharStroke[];
  /** 名字各字的五行（与 given 等长），提供则参与八字契合评分 */
  givenWuXing?: WuXing[];
  /** 八字喜用神（来自 analyzeStrength().favorable） */
  favorable?: WuXing[];
}

export interface NameScoreResult {
  wuGe: WuGe;
  sanCai: SanCaiResult;
  /** 五格数理 + 三才的基础分（0-100） */
  baseScore: number;
  /** 八字契合分（0-100），未提供喜用神时为 null */
  baziFitScore: number | null;
  /** 最终得分（0-100，整数） */
  total: number;
}

const WEIGHTS = { ren: 0.3, zong: 0.2, di: 0.15, wai: 0.05, tian: 0.05, sanCai: 0.25 } as const;

export function scoreName(input: NameScoreInput): NameScoreResult {
  const wuGe = computeWuGe(input.surname, input.given);
  const sanCai = computeSanCai(wuGe);

  const baseScore =
    SHULI_SCORE[wuGe.ren.shuLi.kind] * WEIGHTS.ren +
    SHULI_SCORE[wuGe.zong.shuLi.kind] * WEIGHTS.zong +
    SHULI_SCORE[wuGe.di.shuLi.kind] * WEIGHTS.di +
    SHULI_SCORE[wuGe.wai.shuLi.kind] * WEIGHTS.wai +
    SHULI_SCORE[wuGe.tian.shuLi.kind] * WEIGHTS.tian +
    sanCai.score * WEIGHTS.sanCai;

  let baziFitScore: number | null = null;
  if (input.favorable?.length && input.givenWuXing?.length) {
    const hit = input.givenWuXing.filter((w) => input.favorable!.includes(w)).length;
    baziFitScore = Math.round((hit / input.givenWuXing.length) * 100);
  }

  const total = Math.round(
    baziFitScore === null ? baseScore : baseScore * 0.8 + baziFitScore * 0.2,
  );

  return { wuGe, sanCai, baseScore: Math.round(baseScore), baziFitScore, total };
}

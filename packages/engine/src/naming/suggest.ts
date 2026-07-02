import { computeWuGe, type CharStroke } from './wuge';
import { computeSanCai } from './sancai';
import { SHULI_SCORE } from './shuli';

/**
 * 起名的第一步：给定姓氏笔画，枚举"名字各字用几画"的吉利组合。
 * 过滤条件：人格、地格、总格数理均为吉/大吉，且三才为吉/大吉。
 * 返回按数理得分降序的笔画组合，供内容层用字池填充成候选名。
 */

export interface StrokeCombo {
  /** 名字各字笔画数（1-2 个） */
  strokes: number[];
  /** 数理+三才综合分（与 scoreName 基础分同口径） */
  score: number;
  sanCai: string;
}

const STRICT = new Set(['大吉', '吉']);
const RELAXED = new Set(['大吉', '吉', '半吉']);

export function suggestStrokeCombos(
  surnameStrokes: number[],
  givenLength: 1 | 2,
  options?: { minStrokes?: number; maxStrokes?: number; limit?: number },
): StrokeCombo[] {
  const min = options?.minStrokes ?? 2;
  const max = options?.maxStrokes ?? 24;
  const limit = options?.limit ?? 30;

  const surname: CharStroke[] = surnameStrokes.map((s) => ({ char: '姓', strokes: s }));

  // 部分姓氏笔画在严格条件（人/地/总格+三才全吉）下无解（组合本身稀疏），
  // 逐级放宽：1) 地格/三才允许半吉 → 2) 全部允许半吉
  const levels: Array<{ core: Set<string>; soft: Set<string> }> = [
    { core: STRICT, soft: STRICT },
    { core: STRICT, soft: RELAXED },
    { core: RELAXED, soft: RELAXED },
  ];

  for (const level of levels) {
    const combos: StrokeCombo[] = [];

    const evaluate = (strokes: number[]) => {
      const given: CharStroke[] = strokes.map((s) => ({ char: '名', strokes: s }));
      const wuGe = computeWuGe(surname, given);
      if (!level.core.has(wuGe.ren.shuLi.kind)) return;
      if (!level.core.has(wuGe.zong.shuLi.kind)) return;
      if (!level.soft.has(wuGe.di.shuLi.kind)) return;
      const sanCai = computeSanCai(wuGe);
      if (!level.soft.has(sanCai.kind)) return;

      const score =
        SHULI_SCORE[wuGe.ren.shuLi.kind] * 0.3 +
        SHULI_SCORE[wuGe.zong.shuLi.kind] * 0.2 +
        SHULI_SCORE[wuGe.di.shuLi.kind] * 0.15 +
        SHULI_SCORE[wuGe.wai.shuLi.kind] * 0.05 +
        SHULI_SCORE[wuGe.tian.shuLi.kind] * 0.05 +
        sanCai.score * 0.25;
      combos.push({ strokes, score: Math.round(score * 10) / 10, sanCai: sanCai.combination });
    };

    if (givenLength === 1) {
      for (let a = min; a <= max; a++) evaluate([a]);
    } else {
      for (let a = min; a <= max; a++) {
        for (let b = min; b <= max; b++) evaluate([a, b]);
      }
    }

    if (combos.length > 0) {
      combos.sort((x, y) => y.score - x.score);
      return combos.slice(0, limit);
    }
  }
  return [];
}

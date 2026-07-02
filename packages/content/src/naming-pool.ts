import {
  scoreName, suggestStrokeCombos,
  type WuXing, type CharStroke, type NameScoreResult,
} from '@sky-fortune/engine';
import nameCharsJson from '../data/name-chars.json';
import { lookupHanzi, lookupName, type HanziInfo } from './hanzi';

/**
 * 起名推荐：引擎给出吉利笔画组合 → 从人工字池按笔画+五行取字 → 全量打分排序。
 */

export type NameStyle = 'male' | 'female' | 'neutral';

interface RawPool {
  male: string;
  female: string;
  neutral: string;
}

const rawPool = nameCharsJson as unknown as RawPool;

const poolCache = new Map<string, Map<number, HanziInfo[]>>();

/** 字池按笔画索引（风格 male/female 各自叠加 neutral） */
function poolByStroke(style: NameStyle): Map<number, HanziInfo[]> {
  const key = style;
  const cached = poolCache.get(key);
  if (cached) return cached;

  const chars = new Set<string>([
    ...Array.from(rawPool[style]),
    ...(style === 'neutral' ? [] : Array.from(rawPool.neutral)),
  ]);
  const index = new Map<number, HanziInfo[]>();
  for (const ch of chars) {
    const info = lookupHanzi(ch);
    if (!info) continue;
    const list = index.get(info.kangxiStrokes) ?? [];
    list.push(info);
    index.set(info.kangxiStrokes, list);
  }
  poolCache.set(key, index);
  return index;
}

export interface NameSuggestion {
  given: string;
  chars: HanziInfo[];
  result: NameScoreResult;
}

export interface SuggestNamesOptions {
  surname: string;
  style?: NameStyle;
  givenLength?: 1 | 2;
  /** 八字喜用神；提供则名字用字优先匹配 */
  favorable?: WuXing[];
  limit?: number;
  /** 换一批：不同 seed 从候选中取不同切片 */
  seed?: number;
}

export function suggestNames(options: SuggestNamesOptions):
  | { ok: true; suggestions: NameSuggestion[] }
  | { ok: false; error: string } {
  const { surname, favorable } = options;
  const style = options.style ?? 'neutral';
  const givenLength = options.givenLength ?? 2;
  const limit = options.limit ?? 12;
  const seed = options.seed ?? 0;

  const s = lookupName(surname);
  if (!s.ok) return { ok: false, error: `字库中暂未收录姓氏用字：${s.missing.join('、')}` };
  if (s.chars.length < 1 || s.chars.length > 2) return { ok: false, error: '姓氏支持 1-2 个汉字' };

  const surnameStrokes = s.chars.map((c) => c.kangxiStrokes);
  const combos = suggestStrokeCombos(surnameStrokes, givenLength, { limit: 40 });
  const pool = poolByStroke(style);

  const pickChars = (strokes: number, offset: number): HanziInfo[] => {
    const all = pool.get(strokes) ?? [];
    const preferred = favorable?.length ? all.filter((c) => favorable.includes(c.wuxing)) : all;
    const list = preferred.length > 0 ? preferred : all;
    // 按 seed 轮转切片，"换一批"时取不同的字
    const rotated = list.length > 0 ? [...list.slice(offset % list.length), ...list.slice(0, offset % list.length)] : [];
    return rotated.slice(0, 4);
  };

  const seen = new Set<string>();
  const suggestions: NameSuggestion[] = [];

  for (const combo of combos) {
    const candidatesPerPos = combo.strokes.map((st, i) => pickChars(st, seed + i));
    if (candidatesPerPos.some((c) => c.length === 0)) continue;

    const names: HanziInfo[][] =
      givenLength === 1
        ? candidatesPerPos[0]!.map((c) => [c])
        : candidatesPerPos[0]!.flatMap((a) =>
            candidatesPerPos[1]!.filter((b) => b.char !== a.char).map((b) => [a, b]),
          );

    for (const chars of names) {
      const given = chars.map((c) => c.char).join('');
      if (seen.has(given)) continue;
      seen.add(given);
      const result = scoreName({
        surname: s.chars.map((c): CharStroke => ({ char: c.char, strokes: c.kangxiStrokes })),
        given: chars.map((c): CharStroke => ({ char: c.char, strokes: c.kangxiStrokes })),
        givenWuXing: chars.map((c) => c.wuxing),
        favorable,
      });
      suggestions.push({ given, chars, result });
    }
    if (suggestions.length >= limit * 6) break;
  }

  suggestions.sort((a, b) => b.result.total - a.result.total);
  return { ok: true, suggestions: suggestions.slice(0, limit) };
}

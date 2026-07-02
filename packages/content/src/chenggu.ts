import type { ChengGuData } from '@sky-fortune/engine';
import chengguJson from '../data/chenggu.json';

/**
 * 称骨数据（骨重四表 + 男女两套称骨歌）。
 * 来源与交叉核对记录见 data/PROVENANCE.md。
 * 注意：歌诀批语为传统原文，含宿命化表述（"短命""无婚"等），
 * 展示层必须软化处理并标注"传统文本原文，仅供文化参考"——不得直接原样输出给用户。
 */

interface RawChengGu {
  yearWeight: Record<string, number>;
  monthWeight: Record<string, number>;
  dayWeight: Record<string, number>;
  hourWeight: Record<string, number>;
  verses: {
    male: Record<string, { ge: string; comment: string }>;
    female: Record<string, { ge: string; comment: string }>;
  };
}

const raw = chengguJson as unknown as RawChengGu;

export function getChengGuData(gender: 'male' | 'female'): ChengGuData {
  return {
    yearWeight: raw.yearWeight,
    monthWeight: raw.monthWeight,
    dayWeight: raw.dayWeight,
    hourWeight: raw.hourWeight,
    verses: raw.verses[gender],
  };
}

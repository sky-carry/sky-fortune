import { Solar } from 'lunar-typescript';

/**
 * 袁天罡称骨算命。
 * 逻辑：农历年干支、农历月、农历日、时辰各查一张骨重表，四者相加得总骨重，
 * 查称骨歌批语。骨重以"钱"为整数单位（1 两 = 10 钱），范围 21（2两1钱）~ 71（7两1钱）。
 * 四张表 + 骨歌数据由 @sky-fortune/content 提供（传统公版内容，交叉核对后冻结），
 * 本模块只负责历法换算与查表。
 */

export interface ChengGuData {
  /** 干支年 → 钱数，如 { 甲子: 12 } */
  yearWeight: Record<string, number>;
  /** 农历月 1-12 → 钱数（闰月按前月计） */
  monthWeight: Record<string, number>;
  /** 农历日 1-30 → 钱数 */
  dayWeight: Record<string, number>;
  /** 时辰地支 → 钱数 */
  hourWeight: Record<string, number>;
  /** 总骨重（钱）→ 歌诀与批语 */
  verses: Record<string, { ge: string; comment: string }>;
}

export interface ChengGuResult {
  /** 总骨重（钱） */
  totalQian: number;
  /** 展示用："三两六钱" */
  display: string;
  parts: { year: number; month: number; day: number; hour: number };
  ganZhiYear: string;
  lunarMonth: number;
  lunarDay: number;
  hourZhi: string;
  verse: { ge: string; comment: string };
}

const CN_NUM = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

export function formatBoneWeight(qian: number): string {
  const liang = Math.floor(qian / 10);
  const q = qian % 10;
  return q === 0 ? `${CN_NUM[liang]}两` : `${CN_NUM[liang]}两${CN_NUM[q]}钱`;
}

export function computeChengGu(
  input: { year: number; month: number; day: number; hour: number },
  data: ChengGuData,
): ChengGuResult {
  const solar = Solar.fromYmdHms(input.year, input.month, input.day, input.hour, 0, 0);
  const lunar = solar.getLunar();

  const ganZhiYear = lunar.getYearInGanZhi();
  // 闰月为负数，按对应正月计
  const lunarMonth = Math.abs(lunar.getMonth());
  const lunarDay = lunar.getDay();
  const hourZhi = lunar.getTimeZhi();

  const year = data.yearWeight[ganZhiYear];
  const month = data.monthWeight[String(lunarMonth)];
  const day = data.dayWeight[String(lunarDay)];
  const hour = data.hourWeight[hourZhi];
  if (year === undefined || month === undefined || day === undefined || hour === undefined) {
    throw new Error(`称骨表缺数据: ${ganZhiYear}年 ${lunarMonth}月 ${lunarDay}日 ${hourZhi}时`);
  }

  const totalQian = year + month + day + hour;
  const verse = data.verses[String(totalQian)];
  if (!verse) {
    throw new Error(`称骨歌缺 ${totalQian} 钱的条目`);
  }

  return {
    totalQian,
    display: formatBoneWeight(totalQian),
    parts: { year, month, day, hour },
    ganZhiYear,
    lunarMonth,
    lunarDay,
    hourZhi,
    verse,
  };
}

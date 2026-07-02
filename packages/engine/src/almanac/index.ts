import { Solar } from 'lunar-typescript';

/**
 * 老黄历（每日宜忌 + 择日反查）。数据全部来自 lunar-typescript 内置的
 * 《协纪辨方书》神煞体系，本层只做结构化封装。
 */

export interface DailyAlmanac {
  /** 公历 yyyy-MM-dd */
  date: string;
  lunarDate: string;
  ganZhi: { year: string; month: string; day: string };
  /** 宜 */
  yi: string[];
  /** 忌 */
  ji: string[];
  /** 冲煞：如"冲猴 煞北" */
  chong: string;
  chongZodiac: string;
  sha: string;
  /** 建除十二值星 */
  zhiXing: string;
  /** 值日天神及黄道/黑道 */
  tianShen: string;
  tianShenType: string;
  tianShenLuck: string;
  /** 彭祖百忌 */
  pengZu: [string, string];
  /** 二十八宿及吉凶 */
  xiu: string;
  xiuLuck: string;
  /** 吉神宜趋 / 凶煞宜忌 */
  jiShen: string[];
  xiongSha: string[];
  /** 财神/喜神方位 */
  caiPosition: string;
  xiPosition: string;
}

export function getDailyAlmanac(year: number, month: number, day: number): DailyAlmanac {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  return {
    date: solar.toYmd(),
    lunarDate: lunar.toString(),
    ganZhi: {
      year: lunar.getYearInGanZhi(),
      month: lunar.getMonthInGanZhi(),
      day: lunar.getDayInGanZhi(),
    },
    yi: lunar.getDayYi(),
    ji: lunar.getDayJi(),
    chong: `冲${lunar.getDayChongShengXiao()} 煞${lunar.getDaySha()}`,
    chongZodiac: lunar.getDayChongShengXiao(),
    sha: lunar.getDaySha(),
    zhiXing: lunar.getZhiXing(),
    tianShen: lunar.getDayTianShen(),
    tianShenType: lunar.getDayTianShenType(),
    tianShenLuck: lunar.getDayTianShenLuck(),
    pengZu: [lunar.getPengZuGan(), lunar.getPengZuZhi()],
    xiu: lunar.getXiu(),
    xiuLuck: lunar.getXiuLuck(),
    jiShen: lunar.getDayJiShen(),
    xiongSha: lunar.getDayXiongSha(),
    caiPosition: lunar.getDayPositionCaiDesc(),
    xiPosition: lunar.getDayPositionXiDesc(),
  };
}

export interface FindDaysOptions {
  /** 事项须出现在"宜"中，如 嫁娶 / 开市 / 动土 / 安床 / 出行 */
  activity: string;
  /** 排除冲该生肖的日子（如新人属相） */
  avoidChongZodiac?: string[];
  /** 只要黄道日 */
  huangDaoOnly?: boolean;
  /** 最多返回条数，默认 30 */
  limit?: number;
}

/** 择日反查：在 [start, end] 日期区间内找"宜"含指定事项的日子 */
export function findAuspiciousDays(
  start: { year: number; month: number; day: number },
  end: { year: number; month: number; day: number },
  options: FindDaysOptions,
): DailyAlmanac[] {
  const limit = options.limit ?? 30;
  const results: DailyAlmanac[] = [];
  let cur = Solar.fromYmd(start.year, start.month, start.day);
  const endSolar = Solar.fromYmd(end.year, end.month, end.day);

  while (cur.toYmd() <= endSolar.toYmd() && results.length < limit) {
    const a = getDailyAlmanac(cur.getYear(), cur.getMonth(), cur.getDay());
    const ok =
      a.yi.includes(options.activity) &&
      !(options.avoidChongZodiac ?? []).includes(a.chongZodiac) &&
      (!options.huangDaoOnly || a.tianShenType === '黄道');
    if (ok) results.push(a);
    cur = cur.next(1);
  }
  return results;
}

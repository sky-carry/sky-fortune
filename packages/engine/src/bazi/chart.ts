import { Solar } from 'lunar-typescript';
import { type Gan, type Zhi, type WuXing, GAN_WUXING, ZHI_HIDE_GAN, ZHI_SHENGXIAO } from './tables';
import { type ShiShen, shiShenOfGan, shiShenOfZhi } from './shishen';
import { analyzeStrength, type StrengthResult } from './strength';

export type Gender = 'male' | 'female';

export interface BaziInput {
  /** 公历出生时间（东八区）。真太阳时校正由上层完成后再传入。 */
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  gender: Gender;
}

export interface Pillar {
  gan: Gan;
  zhi: Zhi;
  ganZhi: string;
  naYin: string;
  hideGan: Gan[];
  /** 天干十神；日柱天干为日主，值为 null */
  shiShenGan: ShiShen | null;
  /** 地支藏干十神（本气在前） */
  shiShenZhi: ShiShen[];
}

export interface DaYun {
  /** 该步大运起始虚岁 */
  startAge: number;
  startYear: number;
  endYear: number;
  ganZhi: string;
}

export interface BaziChart {
  input: Required<BaziInput>;
  lunarDate: string;
  zodiac: string;
  pillars: { year: Pillar; month: Pillar; day: Pillar; time: Pillar };
  dayMaster: Gan;
  dayMasterElement: WuXing;
  strength: StrengthResult;
  /** 起运虚岁（约） */
  qiYunAge: number;
  daYun: DaYun[];
}

/**
 * 八字排盘。口径（docs/plan/01 §四）：
 * - 年柱以立春交节时刻为界，月柱以节（非中气）交节时刻为界 —— lunar 默认行为。
 * - 晚子时（23:00-24:00）：日柱用当日，时柱起子时 —— EightChar sect 2。
 * - 真太阳时默认关闭；如需启用由调用方先校正时间。
 */
export function computeBaziChart(input: BaziInput): BaziChart {
  const minute = input.minute ?? 0;
  const solar = Solar.fromYmdHms(input.year, input.month, input.day, input.hour, minute, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();
  ec.setSect(2); // 晚子时日柱算当天

  const dayGan = ec.getDayGan() as Gan;

  const buildPillar = (gan: Gan, zhi: Zhi, naYin: string, isDay: boolean): Pillar => ({
    gan,
    zhi,
    ganZhi: gan + zhi,
    naYin,
    hideGan: ZHI_HIDE_GAN[zhi].map((h) => h.gan),
    shiShenGan: isDay ? null : shiShenOfGan(dayGan, gan),
    shiShenZhi: shiShenOfZhi(dayGan, zhi),
  });

  const pillars = {
    year: buildPillar(ec.getYearGan() as Gan, ec.getYearZhi() as Zhi, ec.getYearNaYin(), false),
    month: buildPillar(ec.getMonthGan() as Gan, ec.getMonthZhi() as Zhi, ec.getMonthNaYin(), false),
    day: buildPillar(dayGan, ec.getDayZhi() as Zhi, ec.getDayNaYin(), true),
    time: buildPillar(ec.getTimeGan() as Gan, ec.getTimeZhi() as Zhi, ec.getTimeNaYin(), false),
  };

  // 大运：阳年男/阴年女顺排，阴年男/阳年女逆排 —— lunar 内部处理
  const yun = ec.getYun(input.gender === 'male' ? 1 : 0);
  const daYunAll = yun.getDaYun();
  // 第 0 步是起运前的时段，从第 1 步开始才是真正的大运
  const daYun: DaYun[] = daYunAll.slice(1, 9).map((d) => ({
    startAge: d.getStartAge(),
    startYear: d.getStartYear(),
    endYear: d.getEndYear(),
    ganZhi: d.getGanZhi(),
  }));

  return {
    input: { ...input, minute },
    lunarDate: lunar.toString(),
    // 生肖直接从年柱地支推导，保证与年柱换界口径（立春交节时刻）严格一致；
    // lunar 的 getYearShengXiaoByLiChun 按立春"当天"整天切换，立春当天上午会不一致
    zodiac: ZHI_SHENGXIAO[pillars.year.zhi],
    pillars,
    dayMaster: dayGan,
    dayMasterElement: GAN_WUXING[dayGan],
    strength: analyzeStrength(pillars),
    qiYunAge: daYun[0]?.startAge ?? 0,
    daYun,
  };
}

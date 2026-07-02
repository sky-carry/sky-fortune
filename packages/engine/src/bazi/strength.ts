import {
  type Gan, type Zhi, type WuXing,
  GAN_WUXING, ZHI_HIDE_GAN, SHENG_NEXT, KE_NEXT, WUXING_ALL,
} from './tables';

/**
 * 五行旺衰打分与喜用神推导。
 *
 * 口径（见 docs/plan/01 §四，选定后不再摇摆）：
 * - 天干每字计 100 分，记入其五行。
 * - 地支按藏干权重计分（本气 60~100 / 中气 30 / 余气 10）。
 * - 月支（月令）分值 ×1.5。
 * - 判定日主强弱时，日主自身天干不计入（看"其余七字"对日主的生扶/克泄）。
 * - 同党 = 与日主同五行（比劫）+ 生日主的五行（印）；异党 = 其余三行。
 *   同党占比 ≥ 0.5 判偏强，否则偏弱。
 * - 喜用神：偏弱 → 印、比劫；偏强 → 按"强因"取舍——比劫重则先官杀后食伤，
 *   印重则先财后食伤。输出为按推荐顺序排列的五行数组。
 */

export interface PillarGanZhi {
  gan: Gan;
  zhi: Zhi;
}

export interface StrengthResult {
  /** 各五行得分（含日主天干，供展示"五行分布"用） */
  scores: Record<WuXing, number>;
  /** 各五行占比（0~1，四舍五入到 3 位） */
  ratios: Record<WuXing, number>;
  /** 八个字面上（天干+地支本气）未出现的五行，即传统"五行缺X" */
  missing: WuXing[];
  /** 同党占比（不含日主自身） */
  supportRatio: number;
  strength: 'strong' | 'weak';
  /** 喜用神（按推荐顺序） */
  favorable: WuXing[];
  /** 忌神 */
  unfavorable: WuXing[];
}

const GAN_SCORE = 100;
const MONTH_ZHI_FACTOR = 1.5;

export function analyzeStrength(
  pillars: { year: PillarGanZhi; month: PillarGanZhi; day: PillarGanZhi; time: PillarGanZhi },
): StrengthResult {
  const dayMasterElement = GAN_WUXING[pillars.day.gan];

  const scores: Record<WuXing, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  /** 判强弱用的分数：不含日主自身天干 */
  const judge: Record<WuXing, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };

  const addGan = (gan: Gan, isDayMaster: boolean) => {
    const el = GAN_WUXING[gan];
    scores[el] += GAN_SCORE;
    if (!isDayMaster) judge[el] += GAN_SCORE;
  };
  const addZhi = (zhi: Zhi, factor: number) => {
    for (const h of ZHI_HIDE_GAN[zhi]) {
      const el = GAN_WUXING[h.gan];
      scores[el] += h.weight * factor;
      judge[el] += h.weight * factor;
    }
  };

  addGan(pillars.year.gan, false);
  addGan(pillars.month.gan, false);
  addGan(pillars.day.gan, true);
  addGan(pillars.time.gan, false);
  addZhi(pillars.year.zhi, 1);
  addZhi(pillars.month.zhi, MONTH_ZHI_FACTOR);
  addZhi(pillars.day.zhi, 1);
  addZhi(pillars.time.zhi, 1);

  const total = WUXING_ALL.reduce((s, el) => s + scores[el], 0);
  const ratios = Object.fromEntries(
    WUXING_ALL.map((el) => [el, Math.round((scores[el] / total) * 1000) / 1000]),
  ) as Record<WuXing, number>;

  // 生我者（印）
  const motherElement = WUXING_ALL.find((el) => SHENG_NEXT[el] === dayMasterElement)!;
  const judgeTotal = WUXING_ALL.reduce((s, el) => s + judge[el], 0);
  const supportScore = judge[dayMasterElement] + judge[motherElement];
  const supportRatio = judgeTotal > 0 ? supportScore / judgeTotal : 0;
  const strength: 'strong' | 'weak' = supportRatio >= 0.5 ? 'strong' : 'weak';

  const childElement = SHENG_NEXT[dayMasterElement]; // 我生（食伤）
  const wealthElement = KE_NEXT[dayMasterElement]; // 我克（财）
  const officerElement = WUXING_ALL.find((el) => KE_NEXT[el] === dayMasterElement)!; // 克我（官杀）

  let favorable: WuXing[];
  if (strength === 'weak') {
    favorable = [motherElement, dayMasterElement];
  } else if (judge[dayMasterElement] >= judge[motherElement]) {
    // 比劫重：先克后泄再耗
    favorable = [officerElement, childElement, wealthElement];
  } else {
    // 印重：先耗（财坏印）再泄
    favorable = [wealthElement, childElement, officerElement];
  }
  const unfavorable = WUXING_ALL.filter((el) => !favorable.includes(el));

  // 五行缺失：只看八个字面（四天干 + 四地支本气）
  const visible = new Set<WuXing>();
  for (const p of [pillars.year, pillars.month, pillars.day, pillars.time]) {
    visible.add(GAN_WUXING[p.gan]);
    visible.add(zhiMainElement(p.zhi));
  }
  const missing = WUXING_ALL.filter((el) => !visible.has(el));

  return { scores, ratios, missing, supportRatio: Math.round(supportRatio * 1000) / 1000, strength, favorable, unfavorable };
}

function zhiMainElement(zhi: Zhi): WuXing {
  return GAN_WUXING[ZHI_HIDE_GAN[zhi][0]!.gan];
}

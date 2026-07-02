import {
  type Gan, type Zhi,
  GAN_WUXING, GAN_YINYANG, ZHI_HIDE_GAN,
  sheng, ke,
} from './tables';

export type ShiShen =
  | '比肩' | '劫财'
  | '食神' | '伤官'
  | '正财' | '偏财'
  | '正官' | '七杀'
  | '正印' | '偏印';

/**
 * 以日主天干为基准，求另一天干的十神。
 * 规则：五行关系定大类（同我/我生/我克/克我/生我），阴阳同异定正偏。
 */
export function shiShenOfGan(dayGan: Gan, other: Gan): ShiShen {
  const me = GAN_WUXING[dayGan];
  const it = GAN_WUXING[other];
  const samePolarity = GAN_YINYANG[dayGan] === GAN_YINYANG[other];

  if (me === it) return samePolarity ? '比肩' : '劫财';
  if (sheng(me, it)) return samePolarity ? '食神' : '伤官';
  if (ke(me, it)) return samePolarity ? '偏财' : '正财';
  if (ke(it, me)) return samePolarity ? '七杀' : '正官';
  if (sheng(it, me)) return samePolarity ? '偏印' : '正印';
  /* istanbul ignore next -- 五行关系穷尽，不可达 */
  throw new Error(`无法判定十神: ${dayGan} vs ${other}`);
}

/** 地支十神：按藏干逐个求十神（本气在前） */
export function shiShenOfZhi(dayGan: Gan, zhi: Zhi): ShiShen[] {
  return ZHI_HIDE_GAN[zhi].map((h) => shiShenOfGan(dayGan, h.gan));
}

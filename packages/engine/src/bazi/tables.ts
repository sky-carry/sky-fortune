/**
 * 干支基础表。引擎自带这些领域数据（而非依赖 lunar 库的内部表），
 * 保证十神/旺衰等规则层可独立单测、口径可控。
 */

export type WuXing = '木' | '火' | '土' | '金' | '水';
export type YinYang = '阳' | '阴';

export const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

export type Gan = (typeof GAN)[number];
export type Zhi = (typeof ZHI)[number];

/** 天干 → 五行 */
export const GAN_WUXING: Record<Gan, WuXing> = {
  甲: '木', 乙: '木',
  丙: '火', 丁: '火',
  戊: '土', 己: '土',
  庚: '金', 辛: '金',
  壬: '水', 癸: '水',
};

/** 天干 → 阴阳（甲丙戊庚壬为阳） */
export const GAN_YINYANG: Record<Gan, YinYang> = {
  甲: '阳', 乙: '阴',
  丙: '阳', 丁: '阴',
  戊: '阳', 己: '阴',
  庚: '阳', 辛: '阴',
  壬: '阳', 癸: '阴',
};

/** 地支 → 本气五行 */
export const ZHI_WUXING: Record<Zhi, WuXing> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
};

/**
 * 地支藏干及权重（本气/中气/余气）。
 * 权重用于五行旺衰打分，总量以本气 100 为基准。
 */
export const ZHI_HIDE_GAN: Record<Zhi, ReadonlyArray<{ gan: Gan; weight: number }>> = {
  子: [{ gan: '癸', weight: 100 }],
  丑: [{ gan: '己', weight: 60 }, { gan: '癸', weight: 30 }, { gan: '辛', weight: 10 }],
  寅: [{ gan: '甲', weight: 60 }, { gan: '丙', weight: 30 }, { gan: '戊', weight: 10 }],
  卯: [{ gan: '乙', weight: 100 }],
  辰: [{ gan: '戊', weight: 60 }, { gan: '乙', weight: 30 }, { gan: '癸', weight: 10 }],
  巳: [{ gan: '丙', weight: 60 }, { gan: '庚', weight: 30 }, { gan: '戊', weight: 10 }],
  午: [{ gan: '丁', weight: 70 }, { gan: '己', weight: 30 }],
  未: [{ gan: '己', weight: 60 }, { gan: '丁', weight: 30 }, { gan: '乙', weight: 10 }],
  申: [{ gan: '庚', weight: 60 }, { gan: '壬', weight: 30 }, { gan: '戊', weight: 10 }],
  酉: [{ gan: '辛', weight: 100 }],
  戌: [{ gan: '戊', weight: 60 }, { gan: '辛', weight: 30 }, { gan: '丁', weight: 10 }],
  亥: [{ gan: '壬', weight: 70 }, { gan: '甲', weight: 30 }],
};

/** 地支 → 生肖 */
export const ZHI_SHENGXIAO: Record<Zhi, string> = {
  子: '鼠', 丑: '牛', 寅: '虎', 卯: '兔', 辰: '龙', 巳: '蛇',
  午: '马', 未: '羊', 申: '猴', 酉: '鸡', 戌: '狗', 亥: '猪',
};

/** 五行相生：木→火→土→金→水→木 */
export const SHENG_NEXT: Record<WuXing, WuXing> = {
  木: '火', 火: '土', 土: '金', 金: '水', 水: '木',
};

/** 五行相克：木克土、土克水、水克火、火克金、金克木 */
export const KE_NEXT: Record<WuXing, WuXing> = {
  木: '土', 土: '水', 水: '火', 火: '金', 金: '木',
};

export const WUXING_ALL: readonly WuXing[] = ['木', '火', '土', '金', '水'];

/** a 是否生 b */
export function sheng(a: WuXing, b: WuXing): boolean {
  return SHENG_NEXT[a] === b;
}

/** a 是否克 b */
export function ke(a: WuXing, b: WuXing): boolean {
  return KE_NEXT[a] === b;
}

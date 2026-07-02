/**
 * 81 数理吉凶表（五格剖象法）。
 * 口径说明：各流派对个别数字（17/25/29/40/53/61/77 等）吉凶判定略有出入，
 * 本表为本产品选定版本，批语为自撰概括语（避免抄录现代命书文本的版权问题），
 * 一经上线不轻易改动。数字 >81 时减 80 循环。
 */

export type ShuLiKind = '大吉' | '吉' | '半吉' | '凶';

export interface ShuLiEntry {
  kind: ShuLiKind;
  /** 传统名目/意象 */
  title: string;
}

export const SHULI_SCORE: Record<ShuLiKind, number> = {
  大吉: 100,
  吉: 85,
  半吉: 65,
  凶: 40,
};

export function normalizeShuLi(n: number): number {
  let v = n;
  while (v > 81) v -= 80;
  return v < 1 ? 1 : v;
}

export const SHULI_81: Record<number, ShuLiEntry> = {
  1: { kind: '大吉', title: '太极之数' },
  2: { kind: '凶', title: '两仪之数' },
  3: { kind: '大吉', title: '三才之数' },
  4: { kind: '凶', title: '四象之数' },
  5: { kind: '大吉', title: '五行之数' },
  6: { kind: '吉', title: '六爻之数' },
  7: { kind: '吉', title: '七政之数' },
  8: { kind: '吉', title: '八卦之数' },
  9: { kind: '凶', title: '大成难持' },
  10: { kind: '凶', title: '终结之数' },
  11: { kind: '吉', title: '旱苗逢雨' },
  12: { kind: '凶', title: '掘井无泉' },
  13: { kind: '大吉', title: '春日牡丹' },
  14: { kind: '凶', title: '破兆之数' },
  15: { kind: '大吉', title: '福寿双全' },
  16: { kind: '大吉', title: '厚重载德' },
  17: { kind: '半吉', title: '刚强之数' },
  18: { kind: '吉', title: '有志竟成' },
  19: { kind: '凶', title: '风云蔽月' },
  20: { kind: '凶', title: '非业破运' },
  21: { kind: '大吉', title: '明月中天' },
  22: { kind: '凶', title: '秋草逢霜' },
  23: { kind: '大吉', title: '旭日东升' },
  24: { kind: '大吉', title: '掘藏得金' },
  25: { kind: '半吉', title: '荣俊之数' },
  26: { kind: '半吉', title: '变怪之数' },
  27: { kind: '半吉', title: '增长之数' },
  28: { kind: '凶', title: '阔水浮萍' },
  29: { kind: '半吉', title: '智谋之数' },
  30: { kind: '半吉', title: '沉浮之数' },
  31: { kind: '大吉', title: '春日花开' },
  32: { kind: '大吉', title: '宝马金鞍' },
  33: { kind: '大吉', title: '旭日升天' },
  34: { kind: '凶', title: '破家之数' },
  35: { kind: '吉', title: '高楼望月' },
  36: { kind: '凶', title: '波澜重叠' },
  37: { kind: '大吉', title: '猛虎出林' },
  38: { kind: '半吉', title: '磨铁成针' },
  39: { kind: '大吉', title: '富贵之数' },
  40: { kind: '半吉', title: '退安之数' },
  41: { kind: '大吉', title: '有德之数' },
  42: { kind: '半吉', title: '寒蝉在柳' },
  43: { kind: '凶', title: '散财之数' },
  44: { kind: '凶', title: '烦闷之数' },
  45: { kind: '大吉', title: '顺风扬帆' },
  46: { kind: '凶', title: '载宝沉舟' },
  47: { kind: '大吉', title: '点石成金' },
  48: { kind: '大吉', title: '古松立鹤' },
  49: { kind: '半吉', title: '转变之数' },
  50: { kind: '凶', title: '一成一败' },
  51: { kind: '半吉', title: '盛衰交加' },
  52: { kind: '大吉', title: '达眼之数' },
  53: { kind: '半吉', title: '外祥内患' },
  54: { kind: '凶', title: '石上栽花' },
  55: { kind: '半吉', title: '善恶并存' },
  56: { kind: '凶', title: '浪里行舟' },
  57: { kind: '吉', title: '日照春松' },
  58: { kind: '半吉', title: '晚行遇月' },
  59: { kind: '凶', title: '寒蝉悲风' },
  60: { kind: '凶', title: '无谋之数' },
  61: { kind: '吉', title: '牡丹芙蓉' },
  62: { kind: '凶', title: '衰败之数' },
  63: { kind: '大吉', title: '舟归平海' },
  64: { kind: '凶', title: '骨肉分离' },
  65: { kind: '大吉', title: '巨流归海' },
  66: { kind: '凶', title: '岩头步马' },
  67: { kind: '大吉', title: '顺风通达' },
  68: { kind: '吉', title: '顺风吹帆' },
  69: { kind: '凶', title: '摇动不安' },
  70: { kind: '凶', title: '残菊逢霜' },
  71: { kind: '半吉', title: '石上金花' },
  72: { kind: '半吉', title: '先甘后苦' },
  73: { kind: '半吉', title: '志高力微' },
  74: { kind: '凶', title: '残花无实' },
  75: { kind: '半吉', title: '退守保吉' },
  76: { kind: '凶', title: '倾覆离散' },
  77: { kind: '半吉', title: '乐极生悲' },
  78: { kind: '半吉', title: '功成渐衰' },
  79: { kind: '凶', title: '云头望月' },
  80: { kind: '凶', title: '遁世之数' },
  81: { kind: '大吉', title: '万物回春' },
};

export function shuLiOf(n: number): ShuLiEntry & { value: number } {
  const v = normalizeShuLi(n);
  return { value: v, ...SHULI_81[v]! };
}

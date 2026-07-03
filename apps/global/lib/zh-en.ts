import type { Gan, Zhi, WuXing, ShiShen } from '@sky-fortune/engine';

/** 中文命理术语 → 英文呈现层映射（出海站专用） */

export const WUXING_EN: Record<WuXing, string> = {
  木: 'Wood', 火: 'Fire', 土: 'Earth', 金: 'Metal', 水: 'Water',
};

export const GAN_EN: Record<Gan, { pinyin: string; meaning: string }> = {
  甲: { pinyin: 'Jiǎ', meaning: 'Yang Wood' },
  乙: { pinyin: 'Yǐ', meaning: 'Yin Wood' },
  丙: { pinyin: 'Bǐng', meaning: 'Yang Fire' },
  丁: { pinyin: 'Dīng', meaning: 'Yin Fire' },
  戊: { pinyin: 'Wù', meaning: 'Yang Earth' },
  己: { pinyin: 'Jǐ', meaning: 'Yin Earth' },
  庚: { pinyin: 'Gēng', meaning: 'Yang Metal' },
  辛: { pinyin: 'Xīn', meaning: 'Yin Metal' },
  壬: { pinyin: 'Rén', meaning: 'Yang Water' },
  癸: { pinyin: 'Guǐ', meaning: 'Yin Water' },
};

export const ZHI_EN: Record<Zhi, { pinyin: string; animal: string }> = {
  子: { pinyin: 'Zǐ', animal: 'Rat' },
  丑: { pinyin: 'Chǒu', animal: 'Ox' },
  寅: { pinyin: 'Yín', animal: 'Tiger' },
  卯: { pinyin: 'Mǎo', animal: 'Rabbit' },
  辰: { pinyin: 'Chén', animal: 'Dragon' },
  巳: { pinyin: 'Sì', animal: 'Snake' },
  午: { pinyin: 'Wǔ', animal: 'Horse' },
  未: { pinyin: 'Wèi', animal: 'Goat' },
  申: { pinyin: 'Shēn', animal: 'Monkey' },
  酉: { pinyin: 'Yǒu', animal: 'Rooster' },
  戌: { pinyin: 'Xū', animal: 'Dog' },
  亥: { pinyin: 'Hài', animal: 'Pig' },
};

export const ZODIAC_EN: Record<string, string> = {
  鼠: 'Rat', 牛: 'Ox', 虎: 'Tiger', 兔: 'Rabbit', 龙: 'Dragon', 蛇: 'Snake',
  马: 'Horse', 羊: 'Goat', 猴: 'Monkey', 鸡: 'Rooster', 狗: 'Dog', 猪: 'Pig',
};

/** 十神通行英译 */
export const SHISHEN_EN: Record<ShiShen, string> = {
  比肩: 'Friend',
  劫财: 'Rob Wealth',
  食神: 'Eating God',
  伤官: 'Hurting Officer',
  正财: 'Direct Wealth',
  偏财: 'Indirect Wealth',
  正官: 'Direct Officer',
  七杀: 'Seven Killings',
  正印: 'Direct Resource',
  偏印: 'Indirect Resource',
};

/** 合婚规则码 → 英文标签与说明 */
export const HEHUN_EN: Record<string, { label: string; desc: string }> = {
  'zodiac-liuhe': { label: 'Zodiac Six Harmony', desc: 'Your zodiac signs form a natural pair — an easy, instinctive affinity.' },
  'zodiac-sanhe': { label: 'Zodiac Trine Harmony', desc: 'Your signs belong to the same harmony trio, sharing values and direction.' },
  'zodiac-liuchong': { label: 'Zodiac Clash', desc: 'Your signs sit opposite each other — expect friction on priorities that needs conscious care.' },
  'zodiac-liuhai': { label: 'Zodiac Harm', desc: 'A subtle friction pattern — small misunderstandings can build up without honest talk.' },
  'zodiac-xing': { label: 'Zodiac Punishment', desc: 'A tension pattern that rewards patience and clear boundaries.' },
  'day-zhi-liuhe': { label: 'Day Branch Harmony', desc: 'Your day branches attract — daily-life rhythms mesh well.' },
  'day-zhi-sanhe': { label: 'Day Branch Trine', desc: 'Day branches in the same trio — cooperation comes naturally.' },
  'day-zhi-liuchong': { label: 'Day Branch Clash', desc: 'Day branches oppose — home routines may pull in different directions.' },
  'day-zhi-liuhai': { label: 'Day Branch Harm', desc: 'A quiet friction in day-to-day matters worth naming early.' },
  'day-zhi-xing': { label: 'Day Branch Punishment', desc: 'Intimate friction pattern — generosity of interpretation helps.' },
  'day-gan-wuhe': { label: 'Day Master Union', desc: 'Your Day Masters form one of the five unions — a classic marker of partnership.' },
  'nayin-sheng': { label: 'Melodic Elements Nourish', desc: 'Your year elements feed each other — you tend to bring out growth in one another.' },
  'nayin-bihe': { label: 'Melodic Elements Match', desc: 'Same year element — similar temperament and pace.' },
  'nayin-ke': { label: 'Melodic Elements Control', desc: 'Year elements in a controlling cycle — complementary if respected, draining if not.' },
  'yongshen-complement': { label: 'Useful God Complement', desc: "One chart's strongest element is exactly what the other chart favors — a supportive fit." },
};

export const GRADE_EN: Record<string, string> = {
  天作之合: 'A match made in heaven',
  相处融洽: 'Naturally compatible',
  中平之配: 'A balanced pairing',
  需多磨合: 'Takes conscious work',
};

export function pillarEn(gan: Gan, zhi: Zhi): string {
  return `${GAN_EN[gan].pinyin} ${ZHI_EN[zhi].pinyin}`;
}

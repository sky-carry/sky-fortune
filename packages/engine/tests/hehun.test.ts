import { describe, it, expect } from 'vitest';
import {
  computeBaziChart, scoreHehun,
  zhiLiuHe, zhiSanHe, zhiLiuChong, zhiLiuHai, zhiXing, ganWuHe, naYinElement,
} from '../src/index';

describe('干支关系表', () => {
  it('六合：子丑、午未合；子午不合', () => {
    expect(zhiLiuHe('子', '丑')).toBe(true);
    expect(zhiLiuHe('午', '未')).toBe(true);
    expect(zhiLiuHe('子', '午')).toBe(false);
  });

  it('三合：申子、子辰同局；子丑不同局', () => {
    expect(zhiSanHe('申', '子')).toBe(true);
    expect(zhiSanHe('子', '辰')).toBe(true);
    expect(zhiSanHe('子', '丑')).toBe(false);
    expect(zhiSanHe('子', '子')).toBe(false);
  });

  it('六冲：子午、卯酉冲', () => {
    expect(zhiLiuChong('子', '午')).toBe(true);
    expect(zhiLiuChong('卯', '酉')).toBe(true);
    expect(zhiLiuChong('子', '丑')).toBe(false);
  });

  it('相害：子未害；相刑：寅巳刑、子卯刑、午午自刑、子子不自刑', () => {
    expect(zhiLiuHai('子', '未')).toBe(true);
    expect(zhiXing('寅', '巳')).toBe(true);
    expect(zhiXing('子', '卯')).toBe(true);
    expect(zhiXing('午', '午')).toBe(true);
    expect(zhiXing('子', '子')).toBe(false);
  });

  it('天干五合：甲己合、丁壬合；甲乙不合', () => {
    expect(ganWuHe('甲', '己')).toBe(true);
    expect(ganWuHe('丁', '壬')).toBe(true);
    expect(ganWuHe('甲', '乙')).toBe(false);
  });

  it('纳音取五行：海中金→金 大林木→木', () => {
    expect(naYinElement('海中金')).toBe('金');
    expect(naYinElement('大林木')).toBe('木');
  });
});

describe('合婚打分', () => {
  // 1996 丙子鼠年、1997 丁丑牛年（子丑六合）、1990 庚午马年（子午六冲）
  const rat = computeBaziChart({ year: 1996, month: 6, day: 10, hour: 10, gender: 'male' });
  const ox = computeBaziChart({ year: 1997, month: 7, day: 12, hour: 14, gender: 'female' });
  const horse = computeBaziChart({ year: 1990, month: 8, day: 20, hour: 16, gender: 'female' });

  it('年支确认：丙子 / 丁丑 / 庚午', () => {
    expect(rat.pillars.year.ganZhi).toBe('丙子');
    expect(ox.pillars.year.ganZhi).toBe('丁丑');
    expect(horse.pillars.year.ganZhi).toBe('庚午');
  });

  it('六合组合得分高于六冲组合，明细含对应规则', () => {
    const he = scoreHehun(rat, ox);
    const chong = scoreHehun(rat, horse);
    expect(he.score).toBeGreaterThan(chong.score);
    expect(he.items.some((i) => i.rule === '生肖六合')).toBe(true);
    expect(chong.items.some((i) => i.rule === '生肖六冲')).toBe(true);
  });

  it('分数夹在 0-100 且有档位', () => {
    const r = scoreHehun(rat, ox);
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
    expect(['天作之合', '相处融洽', '中平之配', '需多磨合']).toContain(r.grade);
  });

  it('打分对称：A×B 与 B×A 相同', () => {
    expect(scoreHehun(rat, ox).score).toBe(scoreHehun(ox, rat).score);
  });
});

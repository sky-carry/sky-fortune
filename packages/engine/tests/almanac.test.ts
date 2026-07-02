import { describe, it, expect } from 'vitest';
import { getDailyAlmanac, findAuspiciousDays } from '../src/index';

describe('每日黄历', () => {
  it('2024-02-10 为甲辰年正月初一', () => {
    const a = getDailyAlmanac(2024, 2, 10);
    expect(a.ganZhi.year).toBe('甲辰');
    expect(a.lunarDate).toContain('正月');
    expect(a.lunarDate).toContain('初一');
  });

  it('结构完整：宜忌、冲煞、建除、黄黑道、彭祖百忌、二十八宿', () => {
    const a = getDailyAlmanac(2026, 7, 2);
    expect(a.yi.length).toBeGreaterThan(0);
    expect(a.ji.length).toBeGreaterThan(0);
    expect(a.chong).toMatch(/^冲.+ 煞[东南西北]$/);
    expect(a.zhiXing.length).toBe(1); // 建除满平定执破危成收开闭 之一
    expect(['黄道', '黑道']).toContain(a.tianShenType);
    expect(a.pengZu[0]!.length).toBeGreaterThan(0);
    expect(a.xiu.length).toBeGreaterThan(0);
  });
});

describe('择日反查', () => {
  it('区间内找"宜嫁娶"的日子，每天的宜都确实包含嫁娶', () => {
    const days = findAuspiciousDays(
      { year: 2026, month: 8, day: 1 },
      { year: 2026, month: 9, day: 30 },
      { activity: '嫁娶' },
    );
    expect(days.length).toBeGreaterThan(0);
    for (const d of days) {
      expect(d.yi).toContain('嫁娶');
    }
  });

  it('避冲生肖 + 只要黄道日的过滤生效', () => {
    const days = findAuspiciousDays(
      { year: 2026, month: 8, day: 1 },
      { year: 2026, month: 12, day: 31 },
      { activity: '嫁娶', avoidChongZodiac: ['马'], huangDaoOnly: true, limit: 10 },
    );
    for (const d of days) {
      expect(d.chongZodiac).not.toBe('马');
      expect(d.tianShenType).toBe('黄道');
    }
  });

  it('limit 生效', () => {
    const days = findAuspiciousDays(
      { year: 2026, month: 1, day: 1 },
      { year: 2026, month: 12, day: 31 },
      { activity: '出行', limit: 5 },
    );
    expect(days.length).toBeLessThanOrEqual(5);
  });
});

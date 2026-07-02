import { describe, it, expect } from 'vitest';
import { computeChengGu, formatBoneWeight, drawQian, drawDailyQian, type ChengGuData, type QianSet } from '../src/index';

/** 测试用最小称骨数据（仅覆盖测试生日所需条目；真实数据在 content 层） */
function fakeChengGuData(): ChengGuData {
  const yearWeight: Record<string, number> = {};
  // 六十甲子全部给 10 钱，个别覆盖
  const gan = '甲乙丙丁戊己庚辛壬癸';
  const zhi = '子丑寅卯辰巳午未申酉戌亥';
  for (let i = 0; i < 60; i++) {
    yearWeight[gan[i % 10]! + zhi[i % 12]!] = 10;
  }
  const monthWeight: Record<string, number> = {};
  for (let m = 1; m <= 12; m++) monthWeight[String(m)] = 5;
  const dayWeight: Record<string, number> = {};
  for (let d = 1; d <= 30; d++) dayWeight[String(d)] = 8;
  const hourWeight: Record<string, number> = {};
  for (const z of zhi) hourWeight[z] = 7;
  const verses: Record<string, { ge: string; comment: string }> = {
    '30': { ge: '测试歌诀三两', comment: '测试批语' },
  };
  return { yearWeight, monthWeight, dayWeight, hourWeight, verses };
}

describe('称骨算命', () => {
  it('骨重 = 年+月+日+时，查歌诀', () => {
    const r = computeChengGu({ year: 2000, month: 6, day: 15, hour: 10 }, fakeChengGuData());
    expect(r.totalQian).toBe(10 + 5 + 8 + 7);
    expect(r.display).toBe('三两');
    expect(r.verse.ge).toBe('测试歌诀三两');
    expect(r.ganZhiYear).toBe('庚辰'); // 2000 年
  });

  it('骨重中文格式化：36 → 三两六钱，21 → 二两一钱', () => {
    expect(formatBoneWeight(36)).toBe('三两六钱');
    expect(formatBoneWeight(21)).toBe('二两一钱');
    expect(formatBoneWeight(70)).toBe('七两');
  });

  it('缺表数据时抛错而非静默', () => {
    const data = fakeChengGuData();
    data.verses = {};
    expect(() => computeChengGu({ year: 2000, month: 6, day: 15, hour: 10 }, data)).toThrow(/称骨歌缺/);
  });
});

describe('抽签', () => {
  const set: QianSet = {
    name: '测试签',
    entries: Array.from({ length: 100 }, (_, i) => ({
      no: i + 1,
      level: '中平',
      poem: `第${i + 1}签`,
      explain: '',
    })),
  };

  it('受控随机：random=0 抽第 1 签，random→1 抽第 100 签', () => {
    expect(drawQian(set, () => 0).no).toBe(1);
    expect(drawQian(set, () => 0.999999).no).toBe(100);
  });

  it('每日一签确定性：同 key 同签，不同 key 大概率不同', () => {
    const a1 = drawDailyQian(set, 'user1:2026-07-02');
    const a2 = drawDailyQian(set, 'user1:2026-07-02');
    expect(a1.no).toBe(a2.no);
    const keys = Array.from({ length: 50 }, (_, i) => `user${i}:2026-07-02`);
    const distinct = new Set(keys.map((k) => drawDailyQian(set, k).no));
    expect(distinct.size).toBeGreaterThan(10);
  });

  it('空签库抛错', () => {
    expect(() => drawQian({ name: '空', entries: [] })).toThrow();
  });
});

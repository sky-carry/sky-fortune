import { describe, it, expect } from 'vitest';
import { lookupHanzi, lookupName, hanziCount, getChengGuData } from '../src/index';
import { computeChengGu } from '@sky-fortune/engine';

describe('汉字字典', () => {
  it('常见姓氏康熙笔画抽查（与多来源核对值一致）', () => {
    const expected: Record<string, number> = {
      王: 4, 李: 7, 张: 11, 陈: 16, 刘: 15, 黄: 12, 林: 8, 吴: 7, 海: 11, 华: 14,
      谢: 17, 赵: 14, 周: 8, 徐: 10, 孙: 10, 马: 10, 郑: 19, 郭: 15, 何: 7, 高: 10,
    };
    for (const [ch, k] of Object.entries(expected)) {
      expect(lookupHanzi(ch)?.kangxiStrokes, `${ch} 康熙笔画`).toBe(k);
    }
  });

  it('五行值合法', () => {
    for (const ch of ['王', '林', '海', '明', '文']) {
      const info = lookupHanzi(ch);
      expect(['金', '木', '水', '火', '土']).toContain(info?.wuxing);
    }
  });

  it('字典规模 ≥ 8000 字', () => {
    expect(hanziCount()).toBeGreaterThanOrEqual(8000);
  });

  it('整词查询：缺字时报告缺失列表', () => {
    const ok = lookupName('王小明');
    expect(ok.ok).toBe(true);
    const bad = lookupName('王𠮷');
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.missing).toContain('𠮷');
  });
});

describe('称骨数据', () => {
  it('四表完整：60 干支年、12 月、30 日、12 时辰', () => {
    const d = getChengGuData('male');
    expect(Object.keys(d.yearWeight).length).toBe(60);
    expect(Object.keys(d.monthWeight).length).toBe(12);
    expect(Object.keys(d.dayWeight).length).toBe(30);
    expect(Object.keys(d.hourWeight).length).toBe(12);
  });

  it('已知值：甲子年 12 钱、癸亥年 6 钱（多数版本裁决）', () => {
    const d = getChengGuData('male');
    expect(d.yearWeight['甲子']).toBe(12);
    expect(d.yearWeight['癸亥']).toBe(6);
  });

  it('与引擎联通：任意生日可算出骨重并查到歌诀（男女两套）', () => {
    for (const gender of ['male', 'female'] as const) {
      const r = computeChengGu({ year: 1995, month: 3, day: 18, hour: 9 }, getChengGuData(gender));
      expect(r.totalQian).toBeGreaterThanOrEqual(21);
      expect(r.totalQian).toBeLessThanOrEqual(72);
      expect(r.verse.ge.length).toBeGreaterThan(0);
    }
  });

  it('全量组合的骨重都能查到歌诀（最小/最大值不越界）', () => {
    const d = getChengGuData('male');
    const yMin = Math.min(...Object.values(d.yearWeight));
    const yMax = Math.max(...Object.values(d.yearWeight));
    const mMin = Math.min(...Object.values(d.monthWeight));
    const mMax = Math.max(...Object.values(d.monthWeight));
    const dMin = Math.min(...Object.values(d.dayWeight));
    const dMax = Math.max(...Object.values(d.dayWeight));
    const hMin = Math.min(...Object.values(d.hourWeight));
    const hMax = Math.max(...Object.values(d.hourWeight));
    const min = yMin + mMin + dMin + hMin;
    const max = yMax + mMax + dMax + hMax;
    for (let q = min; q <= max; q++) {
      expect(d.verses[String(q)], `${q} 钱歌诀`).toBeDefined();
    }
  });
});

import { describe, it, expect } from 'vitest';
import { suggestNames } from '../src/index';
import { suggestStrokeCombos } from '@sky-fortune/engine';

describe('吉利笔画组合（引擎）', () => {
  it('林(8) 双名组合非空，且全部通过吉数过滤', () => {
    const combos = suggestStrokeCombos([8], 2);
    expect(combos.length).toBeGreaterThan(0);
    for (const c of combos) {
      expect(c.strokes.length).toBe(2);
      expect(c.score).toBeGreaterThan(60);
    }
    // 降序
    for (let i = 1; i < combos.length; i++) {
      expect(combos[i]!.score).toBeLessThanOrEqual(combos[i - 1]!.score);
    }
  });

  it('单名组合同样可用（7 画姓氏严格档无解，走放宽档）', () => {
    const combos = suggestStrokeCombos([7], 1);
    expect(combos.length).toBeGreaterThan(0);
  });
});

describe('起名推荐（内容层）', () => {
  it('给出候选名，分数降序，姓名可解析', () => {
    const r = suggestNames({ surname: '林', style: 'female', limit: 10 });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.suggestions.length).toBeGreaterThan(0);
    expect(r.suggestions.length).toBeLessThanOrEqual(10);
    for (let i = 1; i < r.suggestions.length; i++) {
      expect(r.suggestions[i]!.result.total).toBeLessThanOrEqual(r.suggestions[i - 1]!.result.total);
    }
    for (const s of r.suggestions) {
      expect(s.given.length).toBe(2);
      expect(s.chars.length).toBe(2);
    }
  });

  it('提供喜用神时，用字五行优先命中', () => {
    const r = suggestNames({ surname: '王', style: 'male', favorable: ['木', '水'], limit: 10 });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const hitRatio =
      r.suggestions.flatMap((s) => s.chars).filter((c) => ['木', '水'].includes(c.wuxing)).length /
      r.suggestions.flatMap((s) => s.chars).length;
    expect(hitRatio).toBeGreaterThan(0.6);
  });

  it('换一批（seed 不同）给出不同结果', () => {
    const a = suggestNames({ surname: '陈', style: 'neutral', seed: 0, limit: 8 });
    const b = suggestNames({ surname: '陈', style: 'neutral', seed: 3, limit: 8 });
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    const aNames = a.suggestions.map((s) => s.given).join(',');
    const bNames = b.suggestions.map((s) => s.given).join(',');
    expect(aNames).not.toBe(bNames);
  });

  it('未收录姓氏报错而非空结果', () => {
    const r = suggestNames({ surname: '𠮷' });
    expect(r.ok).toBe(false);
  });

  it('单名模式', () => {
    const r = suggestNames({ surname: '李', givenLength: 1, limit: 6 });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    for (const s of r.suggestions) expect(s.given.length).toBe(1);
  });
});

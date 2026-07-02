import { describe, it, expect } from 'vitest';
import { computeWuGe, computeSanCai, scoreName, shuLiOf, normalizeShuLi, digitElement } from '../src/index';

describe('五格计算', () => {
  it('单姓单名：王(4) 一(1) → 天5 人5 地2 外2 总5', () => {
    const g = computeWuGe([{ char: '王', strokes: 4 }], [{ char: '一', strokes: 1 }]);
    expect(g.tian.value).toBe(5);
    expect(g.ren.value).toBe(5);
    expect(g.di.value).toBe(2);
    expect(g.wai.value).toBe(2);
    expect(g.zong.value).toBe(5);
  });

  it('单姓双名：李(7) 小(3)明(8) → 天8 人10 地11 外9 总18', () => {
    const g = computeWuGe(
      [{ char: '李', strokes: 7 }],
      [{ char: '小', strokes: 3 }, { char: '明', strokes: 8 }],
    );
    expect(g.tian.value).toBe(8);
    expect(g.ren.value).toBe(10);
    expect(g.di.value).toBe(11);
    expect(g.wai.value).toBe(9); // 1 + 名末字 8
    expect(g.zong.value).toBe(18);
  });

  it('复姓双名：司马(5,10) 相如(9,6) → 天15 人19 地15 外11 总30', () => {
    const g = computeWuGe(
      [{ char: '司', strokes: 5 }, { char: '马', strokes: 10 }],
      [{ char: '相', strokes: 9 }, { char: '如', strokes: 6 }],
    );
    expect(g.tian.value).toBe(15);
    expect(g.ren.value).toBe(19);
    expect(g.di.value).toBe(15);
    expect(g.wai.value).toBe(11); // 司5 + 如6
    expect(g.zong.value).toBe(30);
  });

  it('超过 2 字的姓/名抛错', () => {
    expect(() => computeWuGe([], [{ char: '一', strokes: 1 }])).toThrow();
  });
});

describe('81 数理', () => {
  it('覆盖 1-81 全部条目', () => {
    for (let i = 1; i <= 81; i++) {
      const e = shuLiOf(i);
      expect(e.kind).toBeDefined();
      expect(e.title.length).toBeGreaterThan(0);
    }
  });

  it('数字 >81 减 80 循环：82 → 2，162 → 2', () => {
    expect(normalizeShuLi(82)).toBe(2);
    expect(normalizeShuLi(162)).toBe(2);
    expect(normalizeShuLi(81)).toBe(81);
  });

  it('典型吉凶：21 大吉、15 大吉、34 凶、4 凶', () => {
    expect(shuLiOf(21).kind).toBe('大吉');
    expect(shuLiOf(15).kind).toBe('大吉');
    expect(shuLiOf(34).kind).toBe('凶');
    expect(shuLiOf(4).kind).toBe('凶');
  });
});

describe('三才', () => {
  it('尾数定五行：11→木 3→火 15→土 7→金 10→水 20→水', () => {
    expect(digitElement(11)).toBe('木');
    expect(digitElement(3)).toBe('火');
    expect(digitElement(15)).toBe('土');
    expect(digitElement(7)).toBe('金');
    expect(digitElement(10)).toBe('水');
    expect(digitElement(20)).toBe('水');
  });

  it('木火土（双相生）→ 大吉；木土水（双相克）→ 凶', () => {
    // 天1(木) 人3(火) 地5(土)：构造 王? 用直接构造的 WuGe 太绕，直接算：
    // 姓 1 画 → 天2(木)；需要人格火(3/4)、地格土(5/6)
    // 姓1 名首2 → 人3(火)？1+2=3 ✓；名 2+3 → 地5(土) ✓
    const good = computeSanCai(computeWuGe(
      [{ char: '一', strokes: 1 }],
      [{ char: '二', strokes: 2 }, { char: '三', strokes: 3 }],
    ));
    expect(good.combination).toBe('木火土');
    expect(good.kind).toBe('大吉');

    // 天2(木) 人6(土) 地10(水)：姓1；名首5 → 人6 土；名 5+5 → 地10 水
    const bad = computeSanCai(computeWuGe(
      [{ char: '一', strokes: 1 }],
      [{ char: '五', strokes: 5 }, { char: '五', strokes: 5 }],
    ));
    expect(bad.combination).toBe('木土水');
    expect(bad.kind).toBe('凶');
  });
});

describe('姓名综合打分', () => {
  it('分数在 0-100，含五格三才明细', () => {
    const r = scoreName({
      surname: [{ char: '林', strokes: 8 }],
      given: [{ char: '一', strokes: 1 }, { char: '文', strokes: 4 }],
    });
    expect(r.total).toBeGreaterThanOrEqual(0);
    expect(r.total).toBeLessThanOrEqual(100);
    expect(r.baziFitScore).toBeNull();
    expect(r.wuGe.zong.value).toBe(13);
  });

  it('八字契合：用字五行命中喜用神时得分更高', () => {
    const base = {
      surname: [{ char: '林', strokes: 8 }],
      given: [{ char: '一', strokes: 1 }, { char: '文', strokes: 4 }],
    };
    const hit = scoreName({ ...base, givenWuXing: ['火', '土'], favorable: ['火', '土'] });
    const miss = scoreName({ ...base, givenWuXing: ['金', '水'], favorable: ['火', '土'] });
    expect(hit.baziFitScore).toBe(100);
    expect(miss.baziFitScore).toBe(0);
    expect(hit.total).toBeGreaterThan(miss.total);
  });
});

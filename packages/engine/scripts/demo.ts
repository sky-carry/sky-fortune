import {
  computeBaziChart, scoreHehun, scoreName, getDailyAlmanac, findAuspiciousDays,
} from '../src/index';

// ── 八字排盘 ──────────────────────────────
const chart = computeBaziChart({ year: 1993, month: 8, day: 16, hour: 14, minute: 30, gender: 'female' });
console.log('◆ 八字排盘');
console.log(`  农历：${chart.lunarDate}  生肖：${chart.zodiac}`);
console.log(`  四柱：${chart.pillars.year.ganZhi} ${chart.pillars.month.ganZhi} ${chart.pillars.day.ganZhi} ${chart.pillars.time.ganZhi}`);
console.log(`  日主：${chart.dayMaster}（${chart.dayMasterElement}）  旺衰：${chart.strength.strength === 'strong' ? '偏强' : '偏弱'}（同党 ${(chart.strength.supportRatio * 100).toFixed(1)}%）`);
console.log(`  五行：${Object.entries(chart.strength.ratios).map(([k, v]) => `${k}${(v * 100).toFixed(0)}%`).join(' ')}  缺：${chart.strength.missing.join('') || '无'}  喜用：${chart.strength.favorable.join('')}`);
console.log(`  大运：${chart.daYun.slice(0, 4).map((d) => `${d.ganZhi}(${d.startAge})`).join(' → ')} …`);

// ── 姓名打分 ──────────────────────────────
const name = scoreName({
  surname: [{ char: '林', strokes: 8 }],
  given: [{ char: '晚', strokes: 11 }, { char: '晴', strokes: 12 }],
  givenWuXing: ['火', '火'],
  favorable: chart.strength.favorable,
});
console.log('\n◆ 姓名测试：林晚晴');
console.log(`  五格：天${name.wuGe.tian.value} 人${name.wuGe.ren.value} 地${name.wuGe.di.value} 外${name.wuGe.wai.value} 总${name.wuGe.zong.value}`);
console.log(`  人格数理：${name.wuGe.ren.shuLi.title}（${name.wuGe.ren.shuLi.kind}）  三才：${name.sanCai.combination}（${name.sanCai.kind}）`);
console.log(`  基础分 ${name.baseScore}  八字契合 ${name.baziFitScore}  总分 ${name.total}`);

// ── 八字合婚 ──────────────────────────────
const partner = computeBaziChart({ year: 1992, month: 3, day: 8, hour: 9, gender: 'male' });
const hehun = scoreHehun(chart, partner);
console.log('\n◆ 八字合婚');
console.log(`  ${chart.pillars.year.ganZhi}年 × ${partner.pillars.year.ganZhi}年  得分 ${hehun.score}（${hehun.grade}）`);
for (const it of hehun.items) console.log(`  ${it.delta > 0 ? '+' : ''}${it.delta}  ${it.rule}：${it.desc}`);

// ── 老黄历与择日 ──────────────────────────
const today = getDailyAlmanac(2026, 7, 2);
console.log('\n◆ 今日黄历（2026-07-02）');
console.log(`  ${today.lunarDate}`);
console.log(`  宜：${today.yi.slice(0, 6).join(' ')}`);
console.log(`  忌：${today.ji.slice(0, 6).join(' ')}`);
console.log(`  ${today.chong}  值神：${today.tianShen}（${today.tianShenType}）  建除：${today.zhiXing}`);

const weddingDays = findAuspiciousDays(
  { year: 2026, month: 10, day: 1 },
  { year: 2026, month: 12, day: 31 },
  { activity: '嫁娶', huangDaoOnly: true, limit: 5 },
);
console.log(`  2026 Q4 宜嫁娶黄道日（前5）：${weddingDays.map((d) => d.date).join('、')}`);

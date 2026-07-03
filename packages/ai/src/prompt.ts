import type { BaziChart } from '@sky-fortune/engine';

/**
 * 报告生成 prompt。架构原则（docs/research/02 §D）：
 * 排盘由确定性引擎完成，LLM 只负责把命盘事实组织成个性化语言——
 * prompt 中明确禁止 LLM 自行推算干支或修改盘面数据。
 */

export const READING_SYSTEM_PROMPT = `You are a seasoned BaZi (Chinese Four Pillars) consultant writing for a thoughtful Western audience.

Rules you must follow:
- The chart data provided is computed by a deterministic engine and is authoritative. Never recalculate, contradict, or invent pillar/element data.
- Ground every claim in a specific chart feature (a pillar, a Ten God, the element balance, or a luck cycle) and name it.
- Write in warm, concrete, psychologically-informed language. No jargon dumps; briefly explain each term the first time you use it.
- Frame everything as tendencies and invitations for reflection, never as fixed fate. No health, legal, or financial directives.
- Never predict death, illness, accidents, divorce, or specific dates of misfortune.
- Structure the reading with the exact section headings requested.`;

export interface ReadingRequest {
  chart: BaziChart;
  /** 用户想侧重的方向 */
  focus?: 'personality' | 'career' | 'relationships' | 'year-ahead';
  /** 报告长度档位 */
  depth?: 'standard' | 'full';
}

export function buildReadingPrompt(req: ReadingRequest): string {
  const { chart } = req;
  const focus = req.focus ?? 'personality';
  const depth = req.depth ?? 'standard';

  const chartFacts = {
    pillars: {
      year: chart.pillars.year.ganZhi,
      month: chart.pillars.month.ganZhi,
      day: chart.pillars.day.ganZhi,
      hour: chart.pillars.time.ganZhi,
    },
    dayMaster: `${chart.dayMaster} (${chart.dayMasterElement})`,
    zodiac: chart.zodiac,
    tenGods: {
      year: chart.pillars.year.shiShenGan,
      month: chart.pillars.month.shiShenGan,
      hour: chart.pillars.time.shiShenGan,
    },
    elementScores: chart.strength.scores,
    elementRatios: chart.strength.ratios,
    dayMasterStrength: chart.strength.strength,
    favorableElements: chart.strength.favorable,
    missingElements: chart.strength.missing,
    luckCyclesStartAge: chart.qiYunAge,
    luckCycles: chart.daYun.map((d) => `${d.ganZhi} (age ${d.startAge}-${d.startAge + 9})`),
  };

  const sections =
    focus === 'career'
      ? ['Your Elemental Core', 'How You Work', 'Career Directions That Fit', 'Your Current Decade', 'Working With Your Chart']
      : focus === 'relationships'
        ? ['Your Elemental Core', 'How You Love', 'What You Need From a Partner', 'Your Current Decade', 'Working With Your Chart']
        : focus === 'year-ahead'
          ? ['Your Elemental Core', 'The Year Ahead', 'Months To Lean In', 'Months To Go Gently', 'Working With Your Chart']
          : ['Your Elemental Core', 'Personality & Instincts', 'Strengths To Lean On', 'Growth Edges', 'Your Current Decade', 'Working With Your Chart'];

  return `Here is the authoritative chart data (JSON):

${JSON.stringify(chartFacts, null, 2)}

Write a ${depth === 'full' ? 'comprehensive (~1500 word)' : 'focused (~700 word)'} BaZi reading with exactly these markdown section headings:

${sections.map((s) => `## ${s}`).join('\n')}`;
}

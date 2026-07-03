import { describe, it, expect } from 'vitest';
import { computeBaziChart } from '@sky-fortune/engine';
import { buildReadingPrompt, isAiConfigured, generateBaziReading, AiNotConfiguredError } from '../src/index';

const chart = computeBaziChart({ year: 1993, month: 8, day: 16, hour: 14, gender: 'female' });

describe('报告 prompt', () => {
  it('包含权威命盘数据与全部章节标题', () => {
    const p = buildReadingPrompt({ chart });
    expect(p).toContain('癸酉');
    expect(p).toContain('"dayMaster": "己 (土)"');
    expect(p).toContain('## Your Elemental Core');
    expect(p).toContain('## Working With Your Chart');
  });

  it('不同 focus 生成不同章节', () => {
    const career = buildReadingPrompt({ chart, focus: 'career' });
    expect(career).toContain('## Career Directions That Fit');
    expect(career).not.toContain('## How You Love');
  });
});

describe('未配置 API key 时的行为', () => {
  it('isAiConfigured 为 false 且调用抛 AiNotConfiguredError', async () => {
    if (process.env.ANTHROPIC_API_KEY) return; // 已配置环境跳过
    expect(isAiConfigured()).toBe(false);
    await expect(generateBaziReading({ chart })).rejects.toBeInstanceOf(AiNotConfiguredError);
  });
});

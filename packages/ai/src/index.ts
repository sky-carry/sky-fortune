import Anthropic from '@anthropic-ai/sdk';
import { READING_SYSTEM_PROMPT, buildReadingPrompt, type ReadingRequest } from './prompt';

export { READING_SYSTEM_PROMPT, buildReadingPrompt, type ReadingRequest } from './prompt';

export class AiNotConfiguredError extends Error {
  constructor() {
    super('ANTHROPIC_API_KEY is not set — AI readings are disabled.');
    this.name = 'AiNotConfiguredError';
  }
}

export function isAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

const MODEL_BY_DEPTH = {
  standard: 'claude-sonnet-5',
  full: 'claude-sonnet-5',
} as const;

/**
 * 生成八字解读报告（markdown）。
 * 命盘数据来自确定性引擎；LLM 仅负责语言组织（见 prompt.ts 的约束）。
 */
export async function generateBaziReading(req: ReadingRequest): Promise<string> {
  if (!isAiConfigured()) throw new AiNotConfiguredError();

  const client = new Anthropic();
  const depth = req.depth ?? 'standard';
  const response = await client.messages.create({
    model: MODEL_BY_DEPTH[depth],
    max_tokens: depth === 'full' ? 4096 : 2048,
    system: READING_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildReadingPrompt(req) }],
  });

  const text = response.content
    .filter((b): b is Extract<typeof b, { type: 'text' }> => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
  if (!text.trim()) throw new Error('Empty reading returned from model');
  return text;
}

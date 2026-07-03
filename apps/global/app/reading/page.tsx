import type { Metadata } from 'next';
import Link from 'next/link';
import { computeBaziChart } from '@sky-fortune/engine';
import { generateBaziReading, isAiConfigured, type ReadingRequest } from '@sky-fortune/ai';
import { parseBirth, toChinaTime } from '@/lib/birth';
import { renderMarkdown } from '@/lib/markdown';
import { GAN_EN } from '@/lib/zh-en';

export const metadata: Metadata = {
  title: 'Your Personal Reading',
  description: 'A personalized BaZi reading written for your exact Four Pillars chart.',
};

export const maxDuration = 120;

interface Search {
  date?: string;
  time?: string;
  tz?: string;
  gender?: string;
  focus?: string;
}

const FOCUS_OPTIONS = [
  { value: 'personality', label: 'Personality' },
  { value: 'career', label: 'Career' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'year-ahead', label: 'Year ahead' },
] as const;

export default async function ReadingPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const birth = parseBirth(sp);

  if (!birth) {
    return (
      <p className="text-stone-400">
        We couldn&apos;t read that birth data. <Link href="/" className="underline">Start over</Link>.
      </p>
    );
  }

  const backParams = new URLSearchParams({
    date: sp.date!, time: sp.time ?? '12:00', tz: sp.tz ?? '8', gender: sp.gender ?? 'female',
  });

  if (!isAiConfigured()) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-stone-700 bg-stone-900/50 p-10 text-center">
        <h1 className="text-2xl text-stone-50">Personal readings are almost here</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-stone-400">
          We&apos;re putting the final touches on AI-crafted readings written for your exact chart —
          personality, career, relationships, and the year ahead.
        </p>
        <Link
          href={`/bazi?${backParams.toString()}`}
          className="mt-6 inline-block rounded border border-stone-600 px-6 py-2 text-sm text-stone-200 transition hover:border-stone-400"
        >
          Back to your chart
        </Link>
      </div>
    );
  }

  const cst = toChinaTime(birth);
  const chart = computeBaziChart({
    year: cst.year, month: cst.month, day: cst.day, hour: cst.hour, minute: cst.minute,
    gender: sp.gender === 'male' ? 'male' : 'female',
  });
  const focus = (FOCUS_OPTIONS.some((f) => f.value === sp.focus) ? sp.focus : 'personality') as ReadingRequest['focus'];
  const reading = await generateBaziReading({ chart, focus });

  return (
    <article className="mx-auto max-w-2xl">
      <header className="border-b border-stone-800 pb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-stone-500">Personal Reading</p>
        <h1 className="mt-3 text-3xl text-stone-50">{GAN_EN[chart.dayMaster].meaning} Day Master</h1>
        <nav className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
          {FOCUS_OPTIONS.map((f) => (
            <Link
              key={f.value}
              href={`/reading?${backParams.toString()}&focus=${f.value}`}
              className={`rounded-full border px-4 py-1.5 transition ${
                f.value === focus
                  ? 'border-stone-300 text-stone-100'
                  : 'border-stone-700 text-stone-500 hover:border-stone-500'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="pb-10">{renderMarkdown(reading)}</div>
      <p className="border-t border-stone-800 pt-6 text-center text-xs text-stone-600">
        AI-generated from your chart data · tendencies for reflection, not fixed fate.
      </p>
    </article>
  );
}

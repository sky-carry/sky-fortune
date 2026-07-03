import type { Metadata } from 'next';
import Link from 'next/link';
import { computeBaziChart, WUXING_ALL, type Pillar } from '@sky-fortune/engine';
import { parseBirth, toChinaTime } from '@/lib/birth';
import { GAN_EN, ZHI_EN, WUXING_EN, SHISHEN_EN, ZODIAC_EN } from '@/lib/zh-en';

export const metadata: Metadata = {
  title: 'Your Four Pillars Chart',
  description: 'Free BaZi birth chart: four pillars, day master, five elements balance, and decade luck cycles.',
};

interface Search {
  date?: string;
  time?: string;
  tz?: string;
  gender?: string;
}

export default async function BaziPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const birth = parseBirth(sp);

  if (!birth) {
    return (
      <p className="text-stone-400">
        We couldn&apos;t read that birth data.{' '}
        <Link href="/" className="underline">Try again</Link>.
      </p>
    );
  }

  const cst = toChinaTime(birth);
  const chart = computeBaziChart({
    year: cst.year, month: cst.month, day: cst.day, hour: cst.hour, minute: cst.minute,
    gender: sp.gender === 'male' ? 'male' : 'female',
  });

  const dm = GAN_EN[chart.dayMaster];
  const pillars: Array<[string, Pillar]> = [
    ['Year', chart.pillars.year],
    ['Month', chart.pillars.month],
    ['Day', chart.pillars.day],
    ['Hour', chart.pillars.time],
  ];
  const maxScore = Math.max(...WUXING_ALL.map((el) => chart.strength.scores[el]));

  return (
    <div className="space-y-10">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-stone-500">Your Four Pillars</p>
        <h1 className="mt-3 text-3xl text-stone-50">
          {dm.meaning} Day Master
        </h1>
        <p className="mt-2 text-sm text-stone-400">
          Born {sp.date} at {sp.time ?? '12:00'} (UTC{Number(sp.tz ?? 8) >= 0 ? '+' : ''}{sp.tz ?? 8}) ·
          Year of the {ZODIAC_EN[chart.zodiac] ?? chart.zodiac}
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {pillars.map(([label, p]) => (
          <div key={label} className="rounded-lg border border-stone-800 bg-stone-900/50 p-4 text-center">
            <p className="text-xs uppercase tracking-widest text-stone-500">{label}</p>
            <p className="mt-3 text-4xl text-stone-50">{p.gan}{p.zhi}</p>
            <p className="mt-2 text-xs text-stone-400">
              {GAN_EN[p.gan].pinyin} · {GAN_EN[p.gan].meaning}
            </p>
            <p className="text-xs text-stone-400">
              {ZHI_EN[p.zhi].pinyin} · {ZHI_EN[p.zhi].animal}
            </p>
            <p className="mt-2 text-xs text-stone-500">
              {p.shiShenGan ? SHISHEN_EN[p.shiShenGan] : 'Day Master'}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-stone-800 bg-stone-900/50 p-6">
        <h2 className="text-lg text-stone-100">Five elements balance</h2>
        <div className="mt-4 space-y-3">
          {WUXING_ALL.map((el) => {
            const pct = Math.round(chart.strength.ratios[el] * 100);
            return (
              <div key={el} className="flex items-center gap-3 text-sm">
                <span className="w-16 text-stone-300">{WUXING_EN[el]}</span>
                <div className="h-2 flex-1 overflow-hidden rounded bg-stone-800">
                  <div
                    className="h-full rounded bg-stone-300"
                    style={{ width: `${Math.max(2, (chart.strength.scores[el] / maxScore) * 100)}%` }}
                  />
                </div>
                <span className="w-10 text-right text-stone-500">{pct}%</span>
              </div>
            );
          })}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-stone-400">
          Your {WUXING_EN[chart.dayMasterElement]} Day Master is{' '}
          <span className="text-stone-200">
            {chart.strength.strength === 'strong' ? 'strong' : 'gentle'}
          </span>{' '}
          in this chart. The elements that support you most:{' '}
          <span className="text-stone-200">
            {chart.strength.favorable.map((el) => WUXING_EN[el]).join(' & ')}
          </span>
          {chart.strength.missing.length > 0 && (
            <> · Missing from the visible chart: {chart.strength.missing.map((el) => WUXING_EN[el]).join(', ')}</>
          )}
        </p>
      </section>

      <section className="rounded-lg border border-stone-800 bg-stone-900/50 p-6">
        <h2 className="text-lg text-stone-100">Decade luck cycles</h2>
        <p className="mt-1 text-sm text-stone-500">
          Starting around age {chart.qiYunAge}, a new pillar colors each decade.
        </p>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center sm:grid-cols-8">
          {chart.daYun.map((d) => (
            <div key={d.ganZhi + d.startAge} className="rounded border border-stone-800 p-2">
              <p className="text-lg text-stone-100">{d.ganZhi}</p>
              <p className="mt-1 text-xs text-stone-500">age {d.startAge}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-stone-700 bg-gradient-to-b from-stone-900 to-stone-950 p-8 text-center">
        <h2 className="text-xl text-stone-50">Your full reading is being crafted</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone-400">
          Personality, career leanings, relationship patterns, and a year-by-year outlook —
          written for your exact chart. Personalized AI readings are coming soon.
        </p>
        <Link
          href="/compatibility"
          className="mt-6 inline-block rounded border border-stone-600 px-6 py-2 text-sm text-stone-200 transition hover:border-stone-400"
        >
          Meanwhile — check your compatibility
        </Link>
      </section>
    </div>
  );
}

import type { Metadata } from 'next';
import { computeBaziChart, scoreHehun } from '@sky-fortune/engine';
import { parseBirth, toChinaTime, type BirthInput } from '@/lib/birth';
import { BirthFields } from '@/components/BirthForm';
import { HEHUN_EN, GRADE_EN, ZODIAC_EN } from '@/lib/zh-en';

export const metadata: Metadata = {
  title: 'BaZi Compatibility',
  description:
    'Traditional Chinese marriage compatibility (He Hun): zodiac harmonies, day master unions, and elemental complements between two birth charts.',
};

interface Search {
  a_date?: string; a_time?: string; a_tz?: string; a_gender?: string;
  b_date?: string; b_time?: string; b_tz?: string; b_gender?: string;
}

function chartFrom(birth: BirthInput, gender: string | undefined) {
  const cst = toChinaTime(birth);
  return computeBaziChart({
    year: cst.year, month: cst.month, day: cst.day, hour: cst.hour, minute: cst.minute,
    gender: gender === 'male' ? 'male' : 'female',
  });
}

export default async function CompatibilityPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const birthA = parseBirth({ date: sp.a_date, time: sp.a_time, tz: sp.a_tz });
  const birthB = parseBirth({ date: sp.b_date, time: sp.b_time, tz: sp.b_tz });

  let result: ReturnType<typeof scoreHehun> | null = null;
  let zodiacA = '';
  let zodiacB = '';
  if (birthA && birthB) {
    const chartA = chartFrom(birthA, sp.a_gender);
    const chartB = chartFrom(birthB, sp.b_gender);
    zodiacA = ZODIAC_EN[chartA.zodiac] ?? chartA.zodiac;
    zodiacB = ZODIAC_EN[chartB.zodiac] ?? chartB.zodiac;
    result = scoreHehun(chartA, chartB);
  }

  return (
    <div className="space-y-10">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-stone-500">He Hun · 合婚</p>
        <h1 className="mt-3 text-3xl text-stone-50">Two charts, one story</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-stone-400">
          Traditional matchmakers compared two Four Pillars charts before a betrothal.
          Enter two birth moments to see the classical harmonies and frictions between them.
        </p>
      </header>

      <form method="get" className="rounded-lg border border-stone-800 bg-stone-900/50 p-6">
        <div className="grid gap-8 sm:grid-cols-2">
          <fieldset>
            <legend className="mb-4 text-stone-100">Person one</legend>
            <BirthFields prefix="a_" defaults={{ date: sp.a_date, time: sp.a_time, tz: sp.a_tz, gender: sp.a_gender }} />
          </fieldset>
          <fieldset>
            <legend className="mb-4 text-stone-100">Person two</legend>
            <BirthFields prefix="b_" defaults={{ date: sp.b_date, time: sp.b_time, tz: sp.b_tz, gender: sp.b_gender ?? 'male' }} />
          </fieldset>
        </div>
        <button
          type="submit"
          className="mt-6 w-full rounded bg-stone-100 px-6 py-3 text-sm font-semibold tracking-wide text-stone-950 transition hover:bg-white sm:w-auto"
        >
          Compare charts
        </button>
      </form>

      {result && (
        <section className="space-y-6">
          <div className="rounded-lg border border-stone-800 bg-stone-900/50 p-8 text-center">
            <p className="text-sm text-stone-500">{zodiacA} × {zodiacB}</p>
            <p className="mt-2 text-6xl text-stone-50">{result.score}</p>
            <p className="mt-2 text-lg text-stone-300">{GRADE_EN[result.grade] ?? result.grade}</p>
          </div>

          {result.items.length > 0 ? (
            <ul className="space-y-3">
              {result.items.map((item, i) => {
                const en = HEHUN_EN[item.code];
                return (
                  <li key={`${item.code}-${i}`} className="flex items-start gap-4 rounded-lg border border-stone-800 p-4">
                    <span
                      className={`mt-0.5 w-12 shrink-0 text-right text-lg ${item.delta > 0 ? 'text-emerald-400' : 'text-rose-400'}`}
                    >
                      {item.delta > 0 ? `+${item.delta}` : item.delta}
                    </span>
                    <div>
                      <p className="text-stone-100">{en?.label ?? item.rule}</p>
                      <p className="mt-1 text-sm leading-relaxed text-stone-400">{en?.desc ?? ''}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-center text-sm text-stone-400">
              No classical harmony or friction patterns between these charts — a neutral, open pairing.
            </p>
          )}

          <p className="text-center text-xs leading-relaxed text-stone-600">
            Classical patterns describe tendencies, not destinies. Every pairing is what two people build together.
          </p>
        </section>
      )}
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { computeBaziChart, type WuXing } from '@sky-fortune/engine';
import { suggestNames, type NameStyle } from '@sky-fortune/content';
import { parseYmd } from '@/lib/date';

export const metadata: Metadata = {
  title: '宝宝起名参考',
  description:
    '基于五格数理与三才配置的起名参考工具：按姓氏推荐笔画搭配吉利、可结合生辰五行的候选名字。仅供传统文化参考。',
};

interface Search {
  surname?: string;
  style?: string;
  len?: string;
  birth?: string;
  hour?: string;
  gender?: string;
  seed?: string;
}

export default async function QimingPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const surname = (sp.surname ?? '').trim();
  const style: NameStyle = sp.style === 'male' || sp.style === 'female' ? sp.style : 'neutral';
  const givenLength = sp.len === '1' ? 1 : 2;
  const seed = Number.isFinite(Number(sp.seed)) ? Number(sp.seed) : 0;

  let favorable: WuXing[] | undefined;
  let error: string | null = null;
  let suggestions: ReturnType<typeof suggestNames> | null = null;

  if (surname) {
    const birth = sp.birth ? parseYmd(sp.birth) : null;
    if (birth) {
      const hour = Number(sp.hour ?? 12);
      const gender = sp.gender === 'female' ? 'female' : 'male';
      favorable = computeBaziChart({ ...birth, hour: Number.isFinite(hour) ? hour : 12, gender }).strength.favorable;
    }
    suggestions = suggestNames({ surname, style, givenLength, favorable, limit: 12, seed });
    if (!suggestions.ok) error = suggestions.error;
  }

  const nextSeedParams = new URLSearchParams({
    surname,
    style,
    len: String(givenLength),
    ...(sp.birth ? { birth: sp.birth } : {}),
    ...(sp.hour ? { hour: sp.hour } : {}),
    ...(sp.gender ? { gender: sp.gender } : {}),
    seed: String(seed + 1),
  });

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-stone-300 bg-stone-50 p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-stone-900">宝宝起名参考</h1>
        <p className="mt-1 text-sm text-stone-500">
          先按五格数理与三才配置筛出吉利的笔画搭配，再从常用起名字库中选字组合；
          填写出生日期可让用字五行贴合生辰五行分布。
        </p>

        <form method="get" className="mt-6 grid gap-4 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="text-stone-600">姓氏（1-2 字）</span>
            <input
              name="surname" defaultValue={surname} required maxLength={2}
              className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2"
              placeholder="如：陈"
            />
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">风格</span>
            <select name="style" defaultValue={style} className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2">
              <option value="neutral">中性/现代</option>
              <option value="male">偏男孩</option>
              <option value="female">偏女孩</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">名字字数</span>
            <select name="len" defaultValue={String(givenLength)} className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2">
              <option value="2">双字名</option>
              <option value="1">单字名</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">出生日期（选填）</span>
            <input type="date" name="birth" defaultValue={sp.birth ?? ''} className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">出生时辰</span>
            <select name="hour" defaultValue={sp.hour ?? '12'} className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2">
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={h}>{String(h).padStart(2, '0')} 时</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">宝宝性别</span>
            <select name="gender" defaultValue={sp.gender ?? 'male'} className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2">
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </label>
          <button
            type="submit"
            className="rounded bg-stone-800 px-6 py-2 text-sm text-stone-50 hover:bg-stone-700 sm:w-40"
          >
            推荐名字
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}
      </section>

      {suggestions?.ok && suggestions.suggestions.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900">
              「{surname}」姓候选名
              {favorable && <span className="ml-2 text-sm font-normal text-stone-500">（生辰所喜五行：{favorable.join('、')}）</span>}
            </h2>
            <Link href={`/qiming?${nextSeedParams.toString()}`} className="text-sm text-stone-500 underline hover:text-stone-900">
              换一批
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {suggestions.suggestions.map((s) => {
              const detail = new URLSearchParams({
                surname,
                given: s.given,
                ...(sp.birth ? { birth: sp.birth } : {}),
                ...(sp.hour ? { hour: sp.hour } : {}),
                ...(sp.gender ? { gender: sp.gender } : {}),
              });
              return (
                <li key={s.given}>
                  <Link
                    href={`/ceming?${detail.toString()}`}
                    className="block rounded-lg border border-stone-300 bg-stone-50 p-4 text-center shadow-sm transition hover:border-stone-400"
                  >
                    <div className="text-2xl text-stone-900">{surname}{s.given}</div>
                    <div className="mt-1 text-xs text-stone-500">
                      {s.chars.map((c) => `${c.char}·${c.wuxing}`).join('  ')}
                    </div>
                    <div className="mt-2 text-sm text-stone-700">数理 {s.result.total} 分</div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-stone-400">
            候选名基于五格数理与常用起名用字自动组合，仅供起名思路参考；名字承载家人的期望与祝福，最终请以家庭意愿为准。
          </p>
        </section>
      )}
    </div>
  );
}

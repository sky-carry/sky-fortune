import Link from 'next/link';
import type { DailyAlmanac } from '@sky-fortune/engine';
import { shiftYmd } from '@/lib/date';

export function AlmanacCard({ almanac, withNav }: { almanac: DailyAlmanac; withNav?: boolean }) {
  const a = almanac;
  return (
    <article className="rounded-lg border border-stone-300 bg-stone-50 shadow-sm">
      <header className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">{a.date}</h1>
          <p className="mt-1 text-sm text-stone-500">
            {a.lunarDate} ｜ {a.ganZhi.year}年 {a.ganZhi.month}月 {a.ganZhi.day}日
          </p>
        </div>
        {withNav && (
          <nav className="flex gap-3 text-sm">
            <Link className="text-stone-500 hover:text-stone-900" href={`/huangli/${shiftYmd(a.date, -1)}`}>
              ← 前一日
            </Link>
            <Link className="text-stone-500 hover:text-stone-900" href={`/huangli/${shiftYmd(a.date, 1)}`}>
              后一日 →
            </Link>
          </nav>
        )}
      </header>

      <div className="grid gap-0 sm:grid-cols-2">
        <section className="border-b border-stone-200 p-6 sm:border-b-0 sm:border-r">
          <h2 className="mb-2 text-sm font-semibold text-emerald-700">宜</h2>
          <p className="leading-loose text-stone-800">{a.yi.join('　')}</p>
        </section>
        <section className="p-6">
          <h2 className="mb-2 text-sm font-semibold text-rose-700">忌</h2>
          <p className="leading-loose text-stone-800">{a.ji.join('　')}</p>
        </section>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-stone-200 px-6 py-4 text-sm sm:grid-cols-3">
        <Item label="冲煞" value={a.chong} />
        <Item label="值神" value={`${a.tianShen}（${a.tianShenType}）`} />
        <Item label="建除" value={`${a.zhiXing}日`} />
        <Item label="二十八宿" value={`${a.xiu}宿（${a.xiuLuck}）`} />
        <Item label="彭祖百忌" value={a.pengZu.join('，')} />
        <Item label="财神方位" value={a.caiPosition} />
        <Item label="喜神方位" value={a.xiPosition} />
        <Item label="吉神宜趋" value={a.jiShen.slice(0, 4).join(' ')} />
        <Item label="凶煞宜忌" value={a.xiongSha.slice(0, 4).join(' ')} />
      </dl>
    </article>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-stone-400">{label}</dt>
      <dd className="mt-0.5 text-stone-700">{value}</dd>
    </div>
  );
}

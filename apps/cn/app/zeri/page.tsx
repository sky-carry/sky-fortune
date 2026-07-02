import type { Metadata } from 'next';
import Link from 'next/link';
import { findAuspiciousDays } from '@sky-fortune/engine';
import { parseYmd, todayInChina, toYmd, shiftYmd } from '@/lib/date';

export const metadata: Metadata = {
  title: '传统择日',
  description: '按嫁娶、开市、出行、动土等事项查询传统历法中的黄道吉日，支持避开属相冲日。',
};

const ACTIVITIES = ['嫁娶', '开市', '出行', '动土', '安床', '入宅', '订盟', '纳采', '祭祀', '祈福', '交易', '修造'];
const ZODIACS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

interface Search {
  activity?: string;
  start?: string;
  end?: string;
  huangdao?: string;
  avoid?: string | string[];
}

export default async function ZeriPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const today = toYmd(todayInChina());
  const activity = sp.activity && ACTIVITIES.includes(sp.activity) ? sp.activity : '';
  const start = sp.start && parseYmd(sp.start) ? sp.start : today;
  const end = sp.end && parseYmd(sp.end) ? sp.end : shiftYmd(today, 90);
  const huangdao = sp.huangdao === '1';
  const avoid = (Array.isArray(sp.avoid) ? sp.avoid : sp.avoid ? [sp.avoid] : []).filter((z) =>
    ZODIACS.includes(z),
  );

  const results = activity
    ? findAuspiciousDays(parseYmd(start)!, parseYmd(end)!, {
        activity,
        avoidChongZodiac: avoid,
        huangDaoOnly: huangdao,
        limit: 30,
      })
    : null;

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-stone-300 bg-stone-50 p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-stone-900">传统择日查询</h1>
        <p className="mt-1 text-sm text-stone-500">
          依《协纪辨方书》神煞体系，查询指定事项在传统历法中的适宜日期。
        </p>

        <form method="get" className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-stone-600">事项</span>
            <select
              name="activity"
              defaultValue={activity}
              className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2"
            >
              <option value="">请选择</option>
              {ACTIVITIES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-stone-600">只看黄道日</span>
            <select
              name="huangdao"
              defaultValue={huangdao ? '1' : ''}
              className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2"
            >
              <option value="">不限</option>
              <option value="1">仅黄道日</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-stone-600">开始日期</span>
            <input
              type="date" name="start" defaultValue={start}
              className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            <span className="text-stone-600">结束日期</span>
            <input
              type="date" name="end" defaultValue={end}
              className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2"
            />
          </label>

          <fieldset className="sm:col-span-2 text-sm">
            <legend className="text-stone-600">避开冲以下属相的日子（可多选）</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              {ZODIACS.map((z) => (
                <label key={z} className="flex items-center gap-1">
                  <input type="checkbox" name="avoid" value={z} defaultChecked={avoid.includes(z)} />
                  {z}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            className="rounded bg-stone-800 px-6 py-2 text-sm text-stone-50 hover:bg-stone-700 sm:col-span-2 sm:w-40"
          >
            查询
          </button>
        </form>
      </section>

      {results && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-stone-900">
            {start} ~ {end} 宜「{activity}」的日子（{results.length} 天）
          </h2>
          {results.length === 0 ? (
            <p className="text-sm text-stone-500">该范围内没有符合条件的日子，试试放宽条件或延长日期范围。</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {results.map((d) => (
                <li key={d.date}>
                  <Link
                    href={`/huangli/${d.date}`}
                    className="block rounded-lg border border-stone-300 bg-stone-50 p-4 text-sm shadow-sm transition hover:border-stone-400"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-semibold text-stone-900">{d.date}</span>
                      <span className={d.tianShenType === '黄道' ? 'text-emerald-700' : 'text-stone-400'}>
                        {d.tianShen}（{d.tianShenType}）
                      </span>
                    </div>
                    <p className="mt-1 text-stone-500">{d.lunarDate}</p>
                    <p className="mt-1 text-stone-600">{d.chong} ｜ 建除：{d.zhiXing}日</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

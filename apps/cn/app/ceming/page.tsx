import type { Metadata } from 'next';
import { scoreName, computeBaziChart, type WuXing, type CharStroke } from '@sky-fortune/engine';
import { lookupName, type HanziInfo } from '@sky-fortune/content';
import { parseYmd } from '@/lib/date';

export const metadata: Metadata = {
  title: '姓名文化解析',
  description:
    '基于五格剖象法与三才配置的姓名文化解析：康熙字典笔画、81 数理、三才五行，可结合出生日期分析用字五行。仅供传统文化学习参考。',
};

interface Search {
  surname?: string;
  given?: string;
  birth?: string;
  hour?: string;
  gender?: string;
}

export default async function CemingPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const surname = (sp.surname ?? '').trim();
  const given = (sp.given ?? '').trim();

  let error: string | null = null;
  let result: ReturnType<typeof scoreName> | null = null;
  let surnameChars: HanziInfo[] = [];
  let givenChars: HanziInfo[] = [];
  let favorable: WuXing[] | null = null;

  if (surname && given) {
    if (surname.length > 2 || given.length > 2 || given.length < 1) {
      error = '姓氏与名字各支持 1-2 个汉字。';
    } else {
      const s = lookupName(surname);
      const g = lookupName(given);
      if (!s.ok || !g.ok) {
        const missing = [...(s.ok ? [] : s.missing), ...(g.ok ? [] : g.missing)];
        error = `字库中暂未收录：${missing.join('、')}，请确认输入为常用汉字。`;
      } else {
        surnameChars = s.chars;
        givenChars = g.chars;

        const birth = sp.birth ? parseYmd(sp.birth) : null;
        if (birth) {
          const hour = Number(sp.hour ?? 12);
          const gender = sp.gender === 'female' ? 'female' : 'male';
          const chart = computeBaziChart({ ...birth, hour: Number.isFinite(hour) ? hour : 12, gender });
          favorable = chart.strength.favorable;
        }

        const toStroke = (c: HanziInfo): CharStroke => ({ char: c.char, strokes: c.kangxiStrokes });
        result = scoreName({
          surname: surnameChars.map(toStroke),
          given: givenChars.map(toStroke),
          givenWuXing: givenChars.map((c) => c.wuxing),
          favorable: favorable ?? undefined,
        });
      }
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-stone-300 bg-stone-50 p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-stone-900">姓名文化解析</h1>
        <p className="mt-1 text-sm text-stone-500">
          按五格剖象法（康熙字典笔画）与三才配置解析名字中的传统数理文化，可选填出生日期查看用字五行与命理五行的对应关系。
        </p>

        <form method="get" className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-stone-600">姓氏（1-2 字）</span>
            <input
              name="surname" defaultValue={surname} required maxLength={2}
              className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2"
              placeholder="如：林"
            />
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">名字（1-2 字）</span>
            <input
              name="given" defaultValue={given} required maxLength={2}
              className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2"
              placeholder="如：晚晴"
            />
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">出生日期（选填）</span>
            <input
              type="date" name="birth" defaultValue={sp.birth ?? ''}
              className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm">
              <span className="text-stone-600">出生时辰</span>
              <select name="hour" defaultValue={sp.hour ?? '12'} className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2">
                {Array.from({ length: 24 }, (_, h) => (
                  <option key={h} value={h}>{String(h).padStart(2, '0')} 时</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-stone-600">性别</span>
              <select name="gender" defaultValue={sp.gender ?? 'male'} className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2">
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </label>
          </div>
          <button
            type="submit"
            className="rounded bg-stone-800 px-6 py-2 text-sm text-stone-50 hover:bg-stone-700 sm:col-span-2 sm:w-40"
          >
            解析
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}
      </section>

      {result && (
        <section className="space-y-6">
          <div className="rounded-lg border border-stone-300 bg-stone-50 p-6 text-center shadow-sm">
            <p className="text-sm text-stone-500">
              「{surname}{given}」综合数理评分
            </p>
            <p className="mt-2 text-5xl font-semibold text-stone-900">{result.total}</p>
            {result.baziFitScore !== null && (
              <p className="mt-2 text-sm text-stone-500">
                其中用字五行与命局五行契合度 {result.baziFitScore}/100
                {favorable && `（命局所喜五行：${favorable.join('、')}）`}
              </p>
            )}
          </div>

          <div className="rounded-lg border border-stone-300 bg-stone-50 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-stone-900">用字解析</h2>
            <div className="flex flex-wrap gap-4">
              {[...surnameChars, ...givenChars].map((c, i) => (
                <div key={`${c.char}-${i}`} className="rounded border border-stone-200 bg-white px-5 py-3 text-center">
                  <div className="text-3xl text-stone-900">{c.char}</div>
                  <div className="mt-1 text-xs text-stone-500">康熙 {c.kangxiStrokes} 画 ｜ 属{c.wuxing}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-stone-300 bg-stone-50 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-stone-900">五格与三才</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-5">
              {(
                [
                  ['天格', result.wuGe.tian],
                  ['人格', result.wuGe.ren],
                  ['地格', result.wuGe.di],
                  ['外格', result.wuGe.wai],
                  ['总格', result.wuGe.zong],
                ] as const
              ).map(([label, ge]) => (
                <div key={label} className="rounded border border-stone-200 bg-white p-3 text-center">
                  <dt className="text-xs text-stone-400">{label}</dt>
                  <dd className="mt-1 text-2xl text-stone-900">{ge.value}</dd>
                  <dd className="mt-1 text-xs text-stone-500">
                    {ge.shuLi.title}
                    <span className={ge.shuLi.kind.includes('吉') ? 'text-emerald-700' : 'text-rose-700'}>
                      （{ge.shuLi.kind}）
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-stone-700">
              三才配置：<span className="font-semibold">{result.sanCai.combination}</span>（{result.sanCai.kind}）
              —— 天格、人格、地格的五行相互关系，传统上视相生为顺、相克为逆。
            </p>
          </div>

          <p className="text-xs leading-relaxed text-stone-400">
            五格剖象法为近代形成的姓名数理学说，本解析仅呈现其计算规则与传统文化含义，
            不构成对姓名好坏的判定，也不构成任何现实建议。
          </p>
        </section>
      )}
    </div>
  );
}

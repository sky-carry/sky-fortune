import Link from 'next/link';
import { getDailyAlmanac } from '@sky-fortune/engine';
import { AlmanacCard } from '@/components/AlmanacCard';
import { todayInChina } from '@/lib/date';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const today = todayInChina();
  const almanac = getDailyAlmanac(today.year, today.month, today.day);

  return (
    <div className="space-y-8">
      <AlmanacCard almanac={almanac} withNav />

      <section className="grid gap-4 sm:grid-cols-2">
        <FeatureLink
          href="/zeri"
          title="传统择日"
          desc="按嫁娶、开市、出行等事项，在日期范围内查询传统历法中的黄道吉日。"
        />
        <FeatureLink
          href="/ceming"
          title="姓名文化"
          desc="基于五格剖象与三才配置的姓名文化解析，了解名字里的传统数理学问。"
        />
      </section>
    </div>
  );
}

function FeatureLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-stone-300 bg-stone-50 p-6 shadow-sm transition hover:border-stone-400 hover:shadow"
    >
      <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{desc}</p>
    </Link>
  );
}

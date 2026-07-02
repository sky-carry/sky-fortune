import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDailyAlmanac } from '@sky-fortune/engine';
import { AlmanacCard } from '@/components/AlmanacCard';
import { parseYmd } from '@/lib/date';

interface Props {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  return {
    title: `${date} 黄历宜忌`,
    description: `${date} 老黄历：当日宜忌、冲煞、值神、建除十二值星与二十八宿查询。`,
  };
}

export default async function HuangliDatePage({ params }: Props) {
  const { date } = await params;
  const d = parseYmd(date);
  if (!d) notFound();
  const almanac = getDailyAlmanac(d.year, d.month, d.day);
  return <AlmanacCard almanac={almanac} withNav />;
}

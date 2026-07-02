/** 以东八区（Asia/Shanghai）为准取"今天"，避免部署时区影响黄历口径 */
export function todayInChina(): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

export function toYmd(d: { year: number; month: number; day: number }): string {
  const mm = String(d.month).padStart(2, '0');
  const dd = String(d.day).padStart(2, '0');
  return `${d.year}-${mm}-${dd}`;
}

export function parseYmd(s: string): { year: number; month: number; day: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

export function shiftYmd(s: string, days: number): string {
  const d = parseYmd(s);
  if (!d) return s;
  const date = new Date(Date.UTC(d.year, d.month - 1, d.day));
  date.setUTCDate(date.getUTCDate() + days);
  return toYmd({ year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() });
}

/**
 * 出生时间输入解析与时区换算。
 * 引擎的节气/日柱计算以东八区（UTC+8）为基准，海外出生时间先按
 * "绝对时刻"换算到 UTC+8 再排盘（真太阳时校正后续版本提供）。
 */

export interface BirthInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  /** 出生地 UTC 偏移（小时，可半时区如 5.5） */
  tzOffset: number;
}

export function parseBirth(sp: {
  date?: string;
  time?: string;
  tz?: string;
}): BirthInput | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(sp.date ?? '');
  if (!m) return null;
  const t = /^(\d{1,2}):(\d{2})$/.exec(sp.time ?? '12:00');
  const tz = Number(sp.tz ?? '8');
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const hour = t ? Number(t[1]) : 12;
  const minute = t ? Number(t[2]) : 0;
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  if (!Number.isFinite(tz) || tz < -12 || tz > 14) return null;
  return { year, month, day, hour, minute, tzOffset: tz };
}

/** 转成东八区墙上时间，供引擎排盘 */
export function toChinaTime(b: BirthInput): { year: number; month: number; day: number; hour: number; minute: number } {
  const utcMs = Date.UTC(b.year, b.month - 1, b.day, b.hour, b.minute) - b.tzOffset * 3600_000;
  const cst = new Date(utcMs + 8 * 3600_000);
  return {
    year: cst.getUTCFullYear(),
    month: cst.getUTCMonth() + 1,
    day: cst.getUTCDate(),
    hour: cst.getUTCHours(),
    minute: cst.getUTCMinutes(),
  };
}

export const TZ_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '-8', label: 'UTC−8 · Los Angeles' },
  { value: '-7', label: 'UTC−7 · Denver' },
  { value: '-6', label: 'UTC−6 · Chicago / Mexico City' },
  { value: '-5', label: 'UTC−5 · New York / Toronto' },
  { value: '-3', label: 'UTC−3 · São Paulo / Buenos Aires' },
  { value: '0', label: 'UTC±0 · London' },
  { value: '1', label: 'UTC+1 · Paris / Berlin' },
  { value: '2', label: 'UTC+2 · Athens / Cairo' },
  { value: '3', label: 'UTC+3 · Moscow / Riyadh' },
  { value: '5.5', label: 'UTC+5:30 · Mumbai / Delhi' },
  { value: '7', label: 'UTC+7 · Bangkok / Jakarta' },
  { value: '8', label: 'UTC+8 · Beijing / Singapore / Taipei' },
  { value: '9', label: 'UTC+9 · Tokyo / Seoul' },
  { value: '10', label: 'UTC+10 · Sydney' },
  { value: '12', label: 'UTC+12 · Auckland' },
];

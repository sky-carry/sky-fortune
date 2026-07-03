import { TZ_OPTIONS } from '@/lib/birth';

/** 出生信息表单字段组（GET 提交）。prefix 用于合婚页的双人表单。 */
export function BirthFields({
  prefix = '',
  defaults,
}: {
  prefix?: string;
  defaults?: { date?: string; time?: string; tz?: string; gender?: string };
}) {
  const n = (name: string) => `${prefix}${name}`;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm">
        <span className="text-stone-400">Date of birth</span>
        <input
          type="date" name={n('date')} required defaultValue={defaults?.date ?? ''}
          className="mt-1 w-full rounded border border-stone-700 bg-stone-900 px-3 py-2 text-stone-100 [color-scheme:dark]"
        />
      </label>
      <label className="block text-sm">
        <span className="text-stone-400">Time of birth</span>
        <input
          type="time" name={n('time')} defaultValue={defaults?.time ?? '12:00'}
          className="mt-1 w-full rounded border border-stone-700 bg-stone-900 px-3 py-2 text-stone-100 [color-scheme:dark]"
        />
      </label>
      <label className="block text-sm">
        <span className="text-stone-400">Birth timezone</span>
        <select
          name={n('tz')} defaultValue={defaults?.tz ?? '8'}
          className="mt-1 w-full rounded border border-stone-700 bg-stone-900 px-3 py-2 text-stone-100"
        >
          {TZ_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="text-stone-400">Sex at birth</span>
        <select
          name={n('gender')} defaultValue={defaults?.gender ?? 'female'}
          className="mt-1 w-full rounded border border-stone-700 bg-stone-900 px-3 py-2 text-stone-100"
        >
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </label>
    </div>
  );
}

export default function ReadingLoading() {
  return (
    <div className="mx-auto max-w-xl py-24 text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-stone-700 border-t-stone-200" />
      <p className="mt-6 text-sm tracking-wide text-stone-400">
        Reading your pillars — weighing the elements…
      </p>
      <p className="mt-2 text-xs text-stone-600">This usually takes under a minute.</p>
    </div>
  );
}

// Mockup kartu NFC (CSS only)
export default function NFCCard() {
  return (
    <div className="relative mx-auto w-72 rotate-[-6deg] sm:w-80">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-500/20 to-violet-500/20 blur-2xl" />
      <div className="relative aspect-[8/5] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-5 text-white shadow-2xl">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/30 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-violet-500/20 blur-2xl" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-indigo-300">TapReview</p>
              <p className="mt-1 text-lg font-bold">Tap untuk Review</p>
            </div>
            {/* Simbol NFC */}
            <svg className="h-8 w-8 text-indigo-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 8.5a7 7 0 0 1 0 7M9.5 6a11 11 0 0 1 0 12M13 3.5a15 15 0 0 1 0 17" />
              <circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div>
            <div className="h-8 w-12 rounded-md bg-gradient-to-br from-amber-200 to-amber-400" />
            <p className="mt-3 font-mono text-sm tracking-[0.3em] text-indigo-200">•••• A1B2C3</p>
          </div>
        </div>
      </div>
    </div>
  );
}

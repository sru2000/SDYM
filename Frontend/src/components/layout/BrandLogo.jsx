function BrandMark({ className = "h-11 w-11" }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className} fill="none">
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="14"
        fill="url(#km-bg)"
      />
      <path
        d="M17 42.5 31.8 17 47 42.5H17Z"
        fill="url(#km-field)"
        stroke="rgba(255,255,255,.72)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M24.2 42.5 32 29.2l7.8 13.3M19.8 42.5h24.4M32 17v12.2"
        stroke="#ecfdf5"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 23.5c6.8-8.4 18.4-8.4 25.2 0-7.7.4-14.5 4.2-18.3 10.4A23.5 23.5 0 0 1 20 23.5Z"
        fill="#d9f99d"
        fillOpacity=".88"
      />
      <path
        d="M17 47h30M32 29.2l11-7.6M32 29.2l-11-7.6"
        stroke="#052e22"
        strokeOpacity=".36"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="20.8" cy="21.6" r="2.6" fill="#ecfdf5" />
      <circle cx="43.2" cy="21.6" r="2.6" fill="#ecfdf5" />
      <circle cx="32" cy="29.2" r="3" fill="#ecfdf5" />
      <defs>
        <linearGradient id="km-bg" x1="8" y1="8" x2="56" y2="58">
          <stop stopColor="#064e3b" />
          <stop offset=".5" stopColor="#047857" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="km-field" x1="19" y1="18" x2="45" y2="45">
          <stop stopColor="#34d399" />
          <stop offset=".55" stopColor="#10b981" />
          <stop offset="1" stopColor="#065f46" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BrandLogo({ collapsed = false, compact = false }) {
  return (
    <div className={`flex min-w-0 items-center ${collapsed ? "justify-center" : "gap-3"}`}>
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 shadow-lg shadow-emerald-950/18 ring-1 ring-emerald-300/20 dark:bg-black">
        <BrandMark className="h-10 w-10" />
      </div>

      {!collapsed && !compact && (
        <div className="min-w-0">
          <p className="truncate text-lg font-black tracking-tight text-slate-950 dark:text-white">
            KrishiMitra AI
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-300">
            Agro intelligence
          </p>
        </div>
      )}
    </div>
  );
}

export default BrandLogo;

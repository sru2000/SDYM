import BrandLogo from "../layout/BrandLogo.jsx";

function LoadingState({ label = "Fetching AI insights..." }) {
  return (
    <div className="grid min-h-72 place-items-center rounded-3xl border border-emerald-100 bg-white/80 p-8 text-center shadow-xl shadow-emerald-950/5 backdrop-blur dark:border-emerald-900/50 dark:bg-slate-900/80">
      <div>
        <div className="mx-auto animate-pulse">
          <BrandLogo collapsed compact />
        </div>
        <p className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-200">
          {label}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Satellite, weather, field, and crop signals are being blended.
        </p>
      </div>
    </div>
  );
}

export default LoadingState;

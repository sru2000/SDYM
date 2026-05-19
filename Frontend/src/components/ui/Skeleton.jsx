function Skeleton({ className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 ${className}`}>
      <div className="shimmer absolute inset-0" />
    </div>
  );
}

export function CardSkeleton({ height = "h-40" }) {
  return (
    <div className={`rounded-3xl border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-950/5 dark:border-emerald-900/50 dark:bg-slate-900 ${height}`}>
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-5 h-10 w-24" />
      <Skeleton className="mt-6 h-4 w-full" />
      <Skeleton className="mt-3 h-4 w-3/4" />
    </div>
  );
}

export default Skeleton;

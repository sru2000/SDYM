import { motion } from "framer-motion";

const toneClasses = {
  emerald: "from-emerald-50 to-white text-emerald-700",
  rose: "from-rose-50 to-white text-rose-600",
  teal: "from-teal-50 to-white text-teal-700",
  amber: "from-amber-50 to-white text-amber-600",
  lime: "from-lime-50 to-white text-lime-700",
  sky: "from-sky-50 to-white text-sky-700",
};

function StatCard({ stat, icon: Icon, delay = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`min-w-0 rounded-3xl border border-emerald-100 bg-gradient-to-br p-5 shadow-lg shadow-emerald-950/5 backdrop-blur dark:border-emerald-900/50 dark:from-slate-900 dark:to-slate-950 dark:shadow-emerald-950/20 ${
        toneClasses[stat.tone]
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-sm">
          <Icon className="text-xl" />
        </div>
        <span className="shrink-0 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          Live
        </span>
      </div>

      <p className="mt-5 min-h-10 text-sm font-semibold leading-5 text-slate-500 dark:text-slate-400">
        {stat.label}
      </p>
      <p className="mt-2 text-[clamp(1.45rem,1.55vw,2rem)] font-black leading-tight tracking-tight text-slate-950 dark:text-white">
        {stat.value}
      </p>
      <p className="mt-2 min-h-8 text-xs font-semibold leading-4">{stat.change}</p>
    </motion.article>
  );
}

export default StatCard;

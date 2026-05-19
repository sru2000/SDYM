import { motion } from "framer-motion";

function PageScaffold({ title, eyebrow, description, cards = [] }) {
  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[2rem] border border-emerald-100 bg-white/90 p-8 shadow-xl shadow-emerald-950/5 backdrop-blur dark:border-emerald-900/50 dark:bg-slate-900/90"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-white">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </motion.section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-950/5 hover:-translate-y-1 hover:shadow-xl dark:border-emerald-900/50 dark:bg-slate-900"
          >
            <p className="text-sm font-semibold text-emerald-700">
              {card.kicker}
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">
              {card.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {card.copy}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default PageScaffold;

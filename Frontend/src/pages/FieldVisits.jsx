import { useEffect, useState } from "react";
import PageScaffold from "../components/layout/PageScaffold.jsx";
import { fetchMLOptimizedRoute } from "../services/api.js";
import { FiAlertCircle, FiCheckCircle, FiCompass, FiDollarSign, FiMapPin, FiTruck } from "react-icons/fi";
import LoadingState from "../components/ui/LoadingState.jsx";

function FieldVisits() {
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoute() {
      try {
        const data = await fetchMLOptimizedRoute();
        const sorted = data.sort((a, b) => a.visit_order - b.visit_order);
        setRoute(sorted);
      } catch (err) {
        console.error("Failed to load ML route:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRoute();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageScaffold
          eyebrow="Field operations"
          title="Field Visits & Route Optimizer"
          description="Plan inspections, route agronomists, capture visit outcomes, and close the loop between AI recommendations and ground reality."
        />
        <LoadingState label="Analyzing distributor maps and generating optimized travel itinerary..." />
      </div>
    );
  }

  // Calculate summary metrics
  const totalSalesAtRisk = route.reduce(
    (sum, item) => sum + (item.stockout_count > 3 ? item.total_sales : 0),
    0,
  );
  const totalStockouts = route.reduce((sum, item) => sum + item.stockout_count, 0);
  const maxPriorityScore = route.length > 0 ? Math.max(...route.map((r) => r.priority_score)) : 0;

  return (
    <div className="space-y-6">
      <PageScaffold
        eyebrow="Field operations"
        title="Field Visits & Route Optimizer"
        description="VQE supply-chain inspired machine learning router dynamically ordering field-visits for agronomists based on sales, stockouts, and regional crop risk."
      />

      {/* ML Overview Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-lg dark:border-emerald-900/50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <FiCompass className="text-2xl" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Route Efficiency</p>
              <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">96.8%</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-lg dark:border-emerald-900/50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-rose-50 p-3 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              <FiAlertCircle className="text-2xl" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Critical Stockouts</p>
              <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                {totalStockouts} Cases
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-lg dark:border-emerald-900/50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <FiDollarSign className="text-2xl" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Revenue Protected</p>
              <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white font-mono">
                ₹{(totalSalesAtRisk / 100000).toFixed(1)}L
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-lg dark:border-emerald-900/50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-50 p-3 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
              <FiTruck className="text-2xl" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Max Priority Score</p>
              <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white font-mono">
                {(maxPriorityScore * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Timeline View */}
      <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl dark:border-emerald-900/50 dark:bg-slate-900">
        <div className="mb-6 flex flex-col justify-between gap-3 border-b border-emerald-50 pb-5 dark:border-emerald-950/40 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Optimized Agronomist Itinerary
            </h2>
            <p className="text-sm text-slate-500">
              Intelligent visit patterns sequenced by travel distance and retailer urgency.
            </p>
          </div>
          <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            {route.length} stops generated
          </span>
        </div>

        {/* Timeline Path */}
        <div className="relative border-l border-emerald-100 pl-6 dark:border-emerald-900/40 space-y-8 ml-3">
          {route.map((stop) => (
            <div key={stop.retailer_id} className="relative">
              {/* Timeline marker node */}
              <span className="absolute -left-10 top-0 grid h-8 w-8 place-items-center rounded-full bg-emerald-700 text-xs font-bold text-white shadow-md shadow-emerald-700/20">
                {stop.visit_order}
              </span>

              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-950/60 transition duration-300">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-2xs font-extrabold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                      RETAILER {stop.retailer_id}
                    </span>
                    <h3 className="mt-2 flex items-center gap-2 text-lg font-bold text-slate-950 dark:text-white">
                      <FiMapPin className="text-emerald-600" />
                      {stop.tehsil}, {stop.district}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">{stop.state}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 font-mono">
                      Priority Score: {(stop.priority_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Grid stats */}
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-slate-100 pt-4 dark:border-slate-900">
                  <div>
                    <p className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                      Total Sales Volume
                    </p>
                    <p className="mt-1 text-base font-black text-slate-950 dark:text-white font-mono">
                      ₹{stop.total_sales.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                      Days Since Last Visit
                    </p>
                    <p className="mt-1 text-base font-black text-slate-950 dark:text-white font-mono">
                      {stop.days_since_visit} Days
                    </p>
                  </div>
                  <div>
                    <p className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                      Stockout Frequency
                    </p>
                    <p
                      className={`mt-1 text-base font-black ${
                        stop.stockout_count > 4 ? "text-rose-600" : "text-emerald-600"
                      }`}
                    >
                      {stop.stockout_count} alerts
                    </p>
                  </div>
                  <div>
                    <p className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                      Coordinates
                    </p>
                    <p className="mt-1 text-2xs font-semibold text-slate-500 font-mono">
                      Lat: {stop.lat.toFixed(4)}
                      <br />
                      Lng: {stop.lng.toFixed(4)}
                    </p>
                  </div>
                </div>

                {/* Prediction Insights */}
                <div className="mt-4 rounded-2xl bg-emerald-50/50 p-4 dark:bg-emerald-950/20">
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                    AI Router Recommendation Reasons:
                  </p>
                  <ul className="mt-2 grid gap-2 sm:grid-cols-3">
                    {stop.reasons.map((reason, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 animate-pulse"
                      >
                        <FiCheckCircle className="shrink-0 text-emerald-600" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

export default FieldVisits;

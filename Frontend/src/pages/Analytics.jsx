import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageScaffold from "../components/layout/PageScaffold.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { analyticsSeries } from "../data/appData.js";
import { cropDistribution } from "../data/dashboardData.js";

const cropColors = ["#059669", "#0f766e", "#84cc16", "#f59e0b", "#38bdf8"];

function AnalyticsTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/95 px-4 py-3 text-sm shadow-2xl shadow-emerald-950/10 backdrop-blur dark:border-emerald-900/60 dark:bg-slate-950/95">
      <p className="font-bold text-slate-950 dark:text-white">{label}</p>
      <div className="mt-2 space-y-1">
        {payload.map((item) => (
          <p key={item.dataKey} className="text-slate-600 dark:text-slate-300">
            <span className="font-bold" style={{ color: item.color }}>
              {item.name || item.dataKey}:
            </span>{" "}
            {item.value}
          </p>
        ))}
      </div>
    </div>
  );
}

function ChartCard({ title, eyebrow, children, large = false }) {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-950/5 dark:border-emerald-900/50 dark:bg-slate-900 sm:p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
        {title}
      </h2>
      <div className={`mt-6 ${large ? "h-[430px]" : "h-[360px]"}`}>{children}</div>
    </article>
  );
}

function CropMixTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const crop = payload[0].payload;

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/95 px-4 py-3 text-sm shadow-2xl shadow-emerald-950/10 backdrop-blur dark:border-emerald-900/60 dark:bg-slate-950/95">
      <p className="font-bold text-slate-950 dark:text-white">{crop.name}</p>
      <p className="mt-1 text-slate-600 dark:text-slate-300">
        {crop.value}% contribution
      </p>
      <p className="text-slate-600 dark:text-slate-300">
        {crop.hectares.toLocaleString()} hectares
      </p>
    </div>
  );
}

function CropMixCard() {
  const [activeCrop, setActiveCrop] = useState(cropDistribution[0]);
  const totalAcreage = cropDistribution.reduce((sum, crop) => sum + crop.hectares, 0);

  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-950/5 dark:border-emerald-900/50 dark:bg-slate-900 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Portfolio
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
            Crop Mix
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            Crop contribution across monitored acreage with live portfolio
            weighting for risk and yield analysis.
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right dark:bg-emerald-950/40">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
            Total acreage
          </p>
          <p className="mt-1 text-xl font-black text-slate-950 dark:text-white">
            {totalAcreage.toLocaleString()} ha
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="relative h-[360px] rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <Pie
                data={cropDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius="56%"
                outerRadius="82%"
                paddingAngle={5}
                cornerRadius={10}
                labelLine={false}
                label={({ percent }) => `${Math.round(percent * 100)}%`}
                onMouseEnter={(crop) => setActiveCrop(crop)}
                isAnimationActive
              >
                {cropDistribution.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={cropColors[index % cropColors.length]}
                    stroke="rgba(255,255,255,.88)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CropMixTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="rounded-2xl bg-white/80 px-4 py-3 text-center shadow-sm backdrop-blur dark:bg-slate-900/80">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Focus crop
              </p>
              <p className="mt-1 text-xl font-black text-slate-950 dark:text-white">
                {activeCrop.name}
              </p>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                {activeCrop.value}% share
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {cropDistribution.map((crop, index) => {
            const isActive = crop.name === activeCrop.name;

            return (
              <button
                key={crop.name}
                onMouseEnter={() => setActiveCrop(crop)}
                className={`w-full rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
                  isActive
                    ? "border-emerald-200 bg-emerald-50 shadow-md dark:border-emerald-800 dark:bg-emerald-950/35"
                    : "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: cropColors[index % cropColors.length] }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-black text-slate-950 dark:text-white">
                        {crop.name}
                      </p>
                      <p className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                        {crop.value}%
                      </p>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${crop.value}%`,
                          backgroundColor: cropColors[index % cropColors.length],
                        }}
                      />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {crop.hectares.toLocaleString()} hectares monitored
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}

function Analytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 850);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <PageScaffold
        eyebrow="Advanced intelligence"
        title="Analytics"
        description="Explore crop health variance, pest propagation, rainfall trends, yield forecasts, and AI confidence across monitored agriculture clusters."
        cards={[
          {
            kicker: "Model performance",
            title: "Prediction accuracy 94.2%",
            copy: "Track how satellite, weather, field inspection, and farmer feedback signals improve model reliability.",
          },
          {
            kicker: "Yield forecast",
            title: "128,000 tonnes expected",
            copy: "Forecast production ranges by crop with risk-adjusted confidence intervals.",
          },
          {
            kicker: "Risk clustering",
            title: "5 active hotspots",
            copy: "Identify pest and disease clusters that require immediate operational attention.",
          },
        ]}
      />

      {loading ? (
        <LoadingState label="Fetching AI analytics..." />
      ) : (
        <>
          <section className="grid gap-6 2xl:grid-cols-2">
            <ChartCard title="Crop Yield Forecast" eyebrow="Forecast model" large>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsSeries} margin={{ top: 24, right: 28, bottom: 18, left: 4 }}>
                  <defs>
                    <linearGradient id="yieldForecast" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.36} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" vertical={false} />
                  <XAxis dataKey="month" tickMargin={14} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis width={46} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<AnalyticsTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="yield"
                    stroke="#059669"
                    strokeWidth={3}
                    fill="url(#yieldForecast)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Rainfall Trends" eyebrow="Weather correlation" large>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsSeries} margin={{ top: 24, right: 28, bottom: 18, left: 4 }} barCategoryGap="34%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tickMargin={14} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis width={46} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<AnalyticsTooltip />} cursor={{ fill: "rgba(14,165,233,0.08)" }} />
                  <Bar dataKey="rainfall" fill="#0ea5e9" radius={[14, 14, 6, 6]} maxBarSize={62} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </section>

          <section className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
            <ChartCard title="Pest Spread Trend" eyebrow="Risk propagation" large>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsSeries} margin={{ top: 24, right: 28, bottom: 18, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tickMargin={14} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis width={46} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<AnalyticsTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="pest"
                    stroke="#e11d48"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <CropMixCard />
          </section>
        </>
      )}
    </div>
  );
}

export default Analytics;

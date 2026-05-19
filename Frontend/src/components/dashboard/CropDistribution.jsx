import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { fetchCropDistribution } from "../../services/api.js";

const colors = ["#059669", "#0f766e", "#84cc16", "#f59e0b", "#38bdf8"];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const item = payload[0];

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/95 px-4 py-3 text-sm shadow-2xl shadow-emerald-950/10 backdrop-blur dark:border-emerald-900/60 dark:bg-slate-950/95">
      <p className="font-bold text-slate-950 dark:text-white">
        {label || item.name}
      </p>
      <p className="mt-1 text-slate-600 dark:text-slate-300">
        {item.dataKey === "hectares"
          ? `${item.value.toLocaleString()} hectares`
          : `${item.value}% portfolio share`}
      </p>
    </div>
  );
}

function CropDistribution() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCrops() {
      try {
        const data = await fetchCropDistribution();
        setCrops(data);
      } catch (err) {
        console.error("Failed to load crop distribution:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCrops();
  }, []);

  const totalHectares = crops.reduce(
    (sum, crop) => sum + crop.hectares,
    0,
  );

  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-950/5 dark:border-emerald-900/50 dark:bg-slate-900">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Crop portfolio
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
            Distribution Visualization
          </h2>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-right dark:bg-emerald-950/40">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Monitored acreage
          </p>
          <p className="text-lg font-black text-emerald-700 dark:text-emerald-300">
            {totalHectares.toLocaleString()} ha
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="min-h-[360px] rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
          <div className="relative h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
                <Pie
                  data={crops}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="58%"
                  outerRadius="82%"
                  paddingAngle={5}
                  cornerRadius={10}
                  isAnimationActive
                >
                  {crops.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Crops
                </p>
                <p className="text-3xl font-black text-slate-950 dark:text-white">
                  {crops.length}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {crops.map((crop, index) => (
              <div key={crop.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="truncate font-semibold text-slate-700 dark:text-slate-300">
                  {crop.name}
                </span>
                <span className="ml-auto font-bold text-slate-500 dark:text-slate-400">
                  {crop.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[360px] rounded-3xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-950 dark:text-white">
              Hectares by Crop
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Current season
            </p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={crops}
                margin={{ top: 20, right: 18, bottom: 16, left: 4 }}
                barCategoryGap="28%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  interval={0}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickMargin={12}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  width={46}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.08)" }} />
                <Bar dataKey="hectares" radius={[12, 12, 8, 8]} maxBarSize={54} isAnimationActive>
                  <LabelList
                    dataKey="hectares"
                    position="top"
                    formatter={(value) => `${Math.round(value / 100) / 10}k`}
                    className="fill-slate-500 text-xs font-bold"
                  />
                  {crops.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CropDistribution;

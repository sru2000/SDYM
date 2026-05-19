import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchPestRiskTrends } from "../../services/api.js";
import LoadingState from "../ui/LoadingState.jsx";

function PestRiskChart({ loading: parentLoading }) {
  const [data, setData] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const trendData = await fetchPestRiskTrends();
        setData(trendData);
      } catch (err) {
        console.error("Failed to load pest risk trends:", err);
      } finally {
        setLocalLoading(false);
      }
    }
    loadData();
  }, []);

  const loading = parentLoading !== undefined ? parentLoading : localLoading;

  if (loading || !data.length) {
    return <LoadingState label="Fetching AI chart insights..." />;
  }

  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-950/5 dark:border-emerald-900/50 dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Weekly analytics
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
            Pest Risk and Crop Health Trends
          </h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          Auto refreshed
        </span>
      </div>

      <div className="grid gap-6 2xl:grid-cols-2">
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 18, right: 22, bottom: 16, left: 2 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="day" tickMargin={12} axisLine={false} tickLine={false} />
              <YAxis width={42} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="pestRisk"
                stroke="#e11d48"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="cropHealth"
                stroke="#059669"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[340px] rounded-3xl bg-emerald-50/60 p-4 dark:bg-emerald-950/20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 18, right: 22, bottom: 16, left: 2 }}>
              <defs>
                <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" vertical={false} />
              <XAxis dataKey="day" tickMargin={12} axisLine={false} tickLine={false} />
              <YAxis width={42} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="moisture"
                stroke="#0f766e"
                strokeWidth={3}
                fill="url(#moistureGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </article>
  );
}

export default PestRiskChart;

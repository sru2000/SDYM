import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiBarChart2,
  FiCpu,
  FiMapPin,
  FiTarget,
} from "react-icons/fi";
import AIAssistantWidget from "../components/dashboard/AIAssistantWidget.jsx";
import ActivityTable from "../components/dashboard/ActivityTable.jsx";
import AlertsPanel from "../components/dashboard/AlertsPanel.jsx";
import CropDistribution from "../components/dashboard/CropDistribution.jsx";
import PestRiskChart from "../components/dashboard/PestRiskChart.jsx";
import RecommendationPanel from "../components/dashboard/RecommendationPanel.jsx";
import RiskMap from "../components/dashboard/RiskMap.jsx";
import StatCard from "../components/dashboard/StatCard.jsx";
import WeatherWidget from "../components/dashboard/WeatherWidget.jsx";
import { fetchKPIs } from "../services/api.js";
import { CardSkeleton } from "../components/ui/Skeleton.jsx";

const iconMap = {
  regions: FiMapPin,
  priority: FiAlertTriangle,
  health: FiActivity,
  pest: FiTarget,
  yield: FiBarChart2,
  confidence: FiCpu,
};

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const kpis = await fetchKPIs();
        setStats(kpis);
      } catch (err) {
        console.error("Failed to load KPIs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-950 via-green-900 to-teal-900 p-8 text-white shadow-2xl shadow-emerald-900/20 ring-1 ring-white/10"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-200">
              Enterprise crop intelligence
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              KrishiMitra AI Command Center
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50/85">
              Monitor regional crop health, pest pressure, weather risk, and AI
              recommendations across Andhra Pradesh and Telangana in one live
              operations dashboard.
            </p>
          </div>

          <div className="grid min-w-72 grid-cols-2 gap-3 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div>
              <p className="text-sm text-emerald-100">Live model</p>
              <p className="mt-1 text-2xl font-bold">v4.8</p>
            </div>
            <div>
              <p className="text-sm text-emerald-100">Signals/min</p>
              <p className="mt-1 text-2xl font-bold">12.6k</p>
            </div>
            <div>
              <p className="text-sm text-emerald-100">Satellite sync</p>
              <p className="mt-1 text-2xl font-bold">98%</p>
            </div>
            <div>
              <p className="text-sm text-emerald-100">Uptime</p>
              <p className="mt-1 text-2xl font-bold">99.9%</p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} height="h-44" />)
          : stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                stat={stat}
                icon={iconMap[stat.id]}
                delay={index * 0.05}
              />
            ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <RiskMap loading={loading} />
        <WeatherWidget loading={loading} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <PestRiskChart loading={loading} />
        <RecommendationPanel loading={loading} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <CropDistribution />
        <AlertsPanel />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <ActivityTable />
        <AIAssistantWidget />
      </section>
    </div>
  );
}

export default Dashboard;

import { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import {
  fetchRecentRecommendations,
  fetchRegions,
  generateDynamicRecommendation,
} from "../../services/api.js";
import LoadingState from "../ui/LoadingState.jsx";

const priorityStyles = {
  Critical: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-300",
  High: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-300",
  Medium: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-300",
  Low: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-300",
};

function RecommendationPanel({ loading: parentLoading }) {
  const [recommendationList, setRecommendationList] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState("1");
  const [regionOptions, setRegionOptions] = useState([]);

  const loadRecommendations = async () => {
    try {
      const data = await fetchRecentRecommendations();
      setRecommendationList(data);
    } catch (err) {
      console.error("Failed to load recommendations:", err);
    } finally {
      setLocalLoading(false);
    }
  };

  const loadRegionOptions = async () => {
    try {
      const regions = await fetchRegions();
      setRegionOptions(regions);
      if (regions.length > 0) {
        setSelectedRegionId(String(regions[0].id));
      }
    } catch (err) {
      console.error("Failed to load region options:", err);
    }
  };

  useEffect(() => {
    loadRecommendations();
    loadRegionOptions();
  }, []);

  const handleGenerate = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      await generateDynamicRecommendation(selectedRegionId);
      await loadRecommendations();
      alert("AI Recommendation generated successfully via Gemini 2.5 and synchronized with SQLite database!");
    } catch (err) {
      console.error(err);
      alert(`Failed to generate AI recommendation: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const loading = parentLoading !== undefined ? parentLoading : localLoading;

  if (loading) {
    return <LoadingState label="Fetching AI recommendations..." />;
  }

  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-950/5 dark:border-emerald-900/50 dark:bg-slate-900">
      <div className="mb-5 flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            AI prescriptions
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
            Recommendation Panel
          </h2>
        </div>
        <button className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-700/25">
          <FiArrowUpRight />
        </button>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/80">
        <select
          value={selectedRegionId}
          onChange={(e) => setSelectedRegionId(e.target.value)}
          className="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none dark:border-emerald-900/50 dark:bg-slate-900 dark:text-slate-200"
        >
          {regionOptions.length > 0 ? (
            regionOptions.map((region) => (
              <option key={region.id} value={String(region.id)}>
                {region.region} ({region.crop})
              </option>
            ))
          ) : (
            <>
              <option value="1">Guntur (Chilli)</option>
              <option value="2">Warangal (Cotton)</option>
              <option value="3">Nalgonda (Rice)</option>
              <option value="4">Khammam (Maize)</option>
            </>
          )}
        </select>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className={`flex-1 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-black text-white shadow-md shadow-emerald-700/15 hover:bg-emerald-800 transition ${
            generating ? "animate-pulse cursor-not-allowed opacity-60" : ""
          }`}
        >
          {generating ? "Invoking Gemini..." : "Generate AI Prescription"}
        </button>
      </div>

      <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
        {recommendationList.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-slate-100 bg-slate-50 p-4 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="break-words text-sm font-bold text-slate-950 dark:text-white">
                  {item.region}
                </p>
                <p className="mt-1 break-words text-sm leading-5 text-slate-500 dark:text-slate-400">
                  {item.reason || "Crop anomalies detected"}
                </p>
              </div>
              <span
                className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                  priorityStyles[item.priority] || "bg-emerald-50 text-emerald-700"
                }`}
              >
                {item.priority}
              </span>
            </div>

            <p className="mt-3 break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
              {item.action || item.recommendation} {item.product ? `(${item.product})` : ""}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="min-w-0 rounded-2xl bg-white p-3 dark:bg-slate-900">
                <p className="text-xs text-slate-500">AI confidence</p>
                <p className="mt-1 text-lg font-black text-emerald-700">
                  {item.confidence || 80}%
                </p>
              </div>
              <div className="min-w-0 rounded-2xl bg-white p-3 dark:bg-slate-900">
                <p className="text-xs text-slate-500">Predicted improvement</p>
                <p className="mt-1 break-words text-sm font-black leading-tight text-slate-950 dark:text-white">
                  {item.benefit || "Yield loss containment"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default RecommendationPanel;

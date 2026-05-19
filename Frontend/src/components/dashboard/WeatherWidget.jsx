import { useEffect, useState } from "react";
import { FiCloudRain, FiDroplet, FiThermometer, FiWind } from "react-icons/fi";
import { fetchWeather } from "../../services/api.js";
import LoadingState from "../ui/LoadingState.jsx";

const metrics = [
  { label: "Temperature", valueKey: "temperature", icon: FiThermometer },
  { label: "Humidity", valueKey: "humidity", icon: FiDroplet },
  { label: "Rainfall", valueKey: "rainfall", icon: FiCloudRain },
  { label: "Wind speed", valueKey: "wind", icon: FiWind },
];

function WeatherWidget({ loading: parentLoading }) {
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await fetchWeather();
        setWeatherInfo(data);
      } catch (err) {
        console.error("Failed to load weather:", err);
      } finally {
        setLocalLoading(false);
      }
    }
    loadWeather();
  }, []);

  const loading = parentLoading !== undefined ? parentLoading : localLoading;

  if (loading || !weatherInfo) {
    return <LoadingState label="Fetching weather intelligence..." />;
  }

  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-950/5 dark:border-emerald-900/50 dark:bg-slate-900">
      <div className="rounded-3xl bg-gradient-to-br from-sky-100 via-emerald-50 to-white p-5 dark:from-slate-800 dark:via-emerald-950/40 dark:to-slate-950">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Weather intelligence
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">
          <span className="dark:text-white">{weatherInfo.location}</span>
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div key={metric.label} className="rounded-3xl bg-white/85 p-4 shadow-sm dark:bg-slate-900/80">
                <Icon className="text-xl text-emerald-700" />
                <p className="mt-3 text-xs font-semibold text-slate-500">
                  {metric.label}
                </p>
                <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                  {weatherInfo[metric.valueKey]}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-3xl bg-emerald-950 p-5 text-white">
          <p className="text-sm font-bold text-emerald-100">
            Farming recommendation
          </p>
          <p className="mt-2 text-sm leading-6 text-emerald-50/90">
            {weatherInfo.recommendation}
          </p>
        </div>
      </div>
    </article>
  );
}

export default WeatherWidget;

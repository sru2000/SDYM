import { FiAlertCircle } from "react-icons/fi";
import { alerts } from "../../data/dashboardData.js";

const severityStyles = {
  Critical: "bg-rose-50 text-rose-700 border-rose-100",
  High: "bg-amber-50 text-amber-700 border-amber-100",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

function AlertsPanel() {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-950/5 dark:border-emerald-900/50 dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Operations
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
            Recent Alerts
          </h2>
        </div>
        <FiAlertCircle className="text-2xl text-rose-500" />
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={`${alert.title}-${alert.region}`}
            className={`rounded-3xl border p-4 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 ${severityStyles[alert.severity]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-slate-950 dark:text-white">{alert.title}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{alert.region}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black">
                {alert.severity}
              </span>
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-500">
              {alert.time}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

export default AlertsPanel;

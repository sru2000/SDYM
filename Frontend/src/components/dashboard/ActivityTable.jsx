import { activityLogs } from "../../data/dashboardData.js";

const statusStyles = {
  Scheduled: "bg-sky-50 text-sky-700",
  Sent: "bg-emerald-50 text-emerald-700",
  Resolved: "bg-lime-50 text-lime-700",
  Reviewing: "bg-amber-50 text-amber-700",
};

function ActivityTable() {
  return (
    <article className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-950/5 dark:border-emerald-900/50 dark:bg-slate-900">
      <div className="border-b border-emerald-100 p-5 dark:border-emerald-900/50">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Audit trail
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
          Recent Activities
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.15em] text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <th className="px-5 py-4">ID</th>
              <th className="px-5 py-4">Activity</th>
              <th className="px-5 py-4">Region</th>
              <th className="px-5 py-4">Owner</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {activityLogs.map((log) => (
              <tr key={log.id} className="text-sm">
                <td className="px-5 py-4 font-bold text-slate-950 dark:text-white">{log.id}</td>
                <td className="px-5 py-4 text-slate-700 dark:text-slate-300">{log.activity}</td>
                <td className="px-5 py-4 text-slate-700 dark:text-slate-300">{log.region}</td>
                <td className="px-5 py-4 text-slate-700 dark:text-slate-300">{log.owner}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      statusStyles[log.status]
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default ActivityTable;

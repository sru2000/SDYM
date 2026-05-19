import AlertsPanel from "../components/dashboard/AlertsPanel.jsx";
import PageScaffold from "../components/layout/PageScaffold.jsx";

function Alerts() {
  return (
    <div className="space-y-6">
      <PageScaffold
        eyebrow="Incident command"
        title="Alerts"
        description="Monitor pest outbreaks, irrigation warnings, crop disease anomalies, and resolved operational incidents."
      />
      <AlertsPanel />
    </div>
  );
}

export default Alerts;

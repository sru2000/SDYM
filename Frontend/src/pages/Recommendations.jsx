import RecommendationPanel from "../components/dashboard/RecommendationPanel.jsx";
import PageScaffold from "../components/layout/PageScaffold.jsx";

function Recommendations() {
  return (
    <div className="space-y-6">
      <PageScaffold
        eyebrow="AI prescriptions"
        title="Recommendations"
        description="Review generated treatment plans, priority levels, expected improvement, and confidence scores before sending advisories to field teams."
      />
      <RecommendationPanel />
    </div>
  );
}

export default Recommendations;

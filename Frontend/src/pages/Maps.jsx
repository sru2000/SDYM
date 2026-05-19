import RiskMap from "../components/dashboard/RiskMap.jsx";
import PageScaffold from "../components/layout/PageScaffold.jsx";

function Maps() {
  return (
    <div className="space-y-6">
      <PageScaffold
        eyebrow="Spatial intelligence"
        title="Maps"
        description="View live crop risk zones, regional hotspots, and location-specific intervention plans."
      />
      <RiskMap />
    </div>
  );
}

export default Maps;

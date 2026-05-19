import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { fetchRegions } from "../../services/api.js";
import LoadingState from "../ui/LoadingState.jsx";

const riskColor = {
  High: "#e11d48",
  Medium: "#f59e0b",
  Low: "#10b981",
};

function RiskMap({ loading: parentLoading }) {
  const [zones, setZones] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    async function loadZones() {
      try {
        const data = await fetchRegions();
        setZones(data);
      } catch (err) {
        console.error("Failed to load regions:", err);
      } finally {
        setLocalLoading(false);
      }
    }
    loadZones();
  }, []);

  const loading = parentLoading !== undefined ? parentLoading : localLoading;

  if (loading) {
    return <LoadingState label="Fetching AI map insights..." />;
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-950/5 dark:border-emerald-900/50 dark:bg-slate-900">
      <div className="flex flex-col gap-4 border-b border-emerald-100 p-5 dark:border-emerald-900/50 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Geo intelligence
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
            Interactive Risk Map
          </h2>
        </div>
        <div className="flex gap-2 text-xs font-bold">
          <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-600">
            High
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-600">
            Medium
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">
            Low
          </span>
        </div>
      </div>

      <div className="relative h-[430px] z-0">
        <div className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-2xl bg-white/90 p-3 text-xs font-bold shadow-xl backdrop-blur dark:bg-slate-950/90">
          Live heat intensity: risk score and crop stress blend
        </div>
        <MapContainer
          center={[16.9, 79.4]}
          zoom={7}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {zones.map((zone) => (
            <CircleMarker
              key={zone.id || zone.region}
              center={zone.position}
              radius={zone.risk === "High" ? 24 : zone.risk === "Medium" ? 18 : 14}
              pathOptions={{
                color: riskColor[zone.risk] || "#10b981",
                fillColor: riskColor[zone.risk] || "#10b981",
                fillOpacity: 0.22 + zone.score / 260,
                weight: 2,
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-bold">{zone.region}</p>
                  <p>{zone.crop} crop</p>
                  <p>Risk score: {zone.score}</p>
                  <p>{zone.issue}</p>
                  <p className="font-semibold">{zone.action}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </article>
  );
}

export default RiskMap;

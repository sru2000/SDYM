import PageScaffold from "../components/layout/PageScaffold.jsx";

function Inventory() {
  return (
    <PageScaffold
      eyebrow="Input supply"
      title="Inventory"
      description="Track pesticide, fertilizer, trap, and seed availability against forecasted recommendations and field demand."
      cards={[
        {
          kicker: "Pesticides",
          title: "74% stock readiness",
          copy: "Flag shortages before critical advisories are issued to high-priority regions.",
        },
        {
          kicker: "Fertilizer",
          title: "12 supply hubs",
          copy: "Coordinate distribution windows based on soil and crop-stage intelligence.",
        },
        {
          kicker: "Field kits",
          title: "260 kits available",
          copy: "Allocate diagnostic and scouting kits to field visit teams.",
        },
      ]}
    />
  );
}

export default Inventory;

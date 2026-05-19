import PageScaffold from "../components/layout/PageScaffold.jsx";

function Farmers() {
  return (
    <PageScaffold
      eyebrow="Farmer network"
      title="Farmers"
      description="Manage farmer profiles, crop holdings, advisory history, regional segmentation, and communication status."
      cards={[
        {
          kicker: "Registered farmers",
          title: "18,420 profiles",
          copy: "Centralized profiles help personalize advisories by crop, acreage, and risk exposure.",
        },
        {
          kicker: "Engagement",
          title: "82% message open rate",
          copy: "Track advisory delivery across SMS, WhatsApp, app notifications, and field team outreach.",
        },
        {
          kicker: "Coverage",
          title: "42 monitored regions",
          copy: "Segment farmers into operational clusters for faster intervention planning.",
        },
      ]}
    />
  );
}

export default Farmers;

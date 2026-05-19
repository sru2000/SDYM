export const notifications = [
  {
    id: 1,
    title: "Pest outbreak detected",
    message: "Guntur chilli cluster crossed critical pest threshold.",
    time: "4 min ago",
    unread: true,
    tone: "rose",
  },
  {
    id: 2,
    title: "Rainfall alert",
    message: "Nellore coastal belt expects 22 mm rainfall tonight.",
    time: "18 min ago",
    unread: true,
    tone: "sky",
  },
  {
    id: 3,
    title: "AI recommendation generated",
    message: "Three high-confidence prescriptions are ready for review.",
    time: "32 min ago",
    unread: true,
    tone: "emerald",
  },
  {
    id: 4,
    title: "Field visit completed",
    message: "Warangal inspection log synced with crop health model.",
    time: "2 hrs ago",
    unread: false,
    tone: "lime",
  },
];

export const searchRecords = [
  { type: "Region", label: "Guntur", detail: "High risk chilli cluster" },
  { type: "Region", label: "Nellore", detail: "Groundnut fungal spread" },
  { type: "Region", label: "Warangal", detail: "Cotton bollworm monitoring" },
  { type: "Region", label: "Karimnagar", detail: "Maize scouting active" },
  { type: "Farmer", label: "Field Manager", detail: "Guntur, 8.4 acres chilli" },
  { type: "Farmer", label: "Agro Analyst", detail: "Warangal, 12 acres cotton" },
  { type: "Alert", label: "Pest outbreak detected", detail: "Critical severity" },
  { type: "Alert", label: "Irrigation stress warning", detail: "High severity" },
  { type: "Crop", label: "Paddy", detail: "34% crop distribution" },
  { type: "Crop", label: "Cotton", detail: "22% crop distribution" },
  { type: "Crop", label: "Chilli", detail: "18% crop distribution" },
];

export const analyticsSeries = [
  { month: "Jan", yield: 82, rainfall: 42, pest: 24, confidence: 88 },
  { month: "Feb", yield: 86, rainfall: 38, pest: 29, confidence: 90 },
  { month: "Mar", yield: 91, rainfall: 55, pest: 36, confidence: 91 },
  { month: "Apr", yield: 96, rainfall: 62, pest: 48, confidence: 93 },
  { month: "May", yield: 103, rainfall: 74, pest: 42, confidence: 94 },
  { month: "Jun", yield: 112, rainfall: 88, pest: 39, confidence: 95 },
];

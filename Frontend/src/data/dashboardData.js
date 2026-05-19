export const dashboardStats = [
  {
    id: "regions",
    label: "Total Regions",
    value: "42",
    change: "+6 this month",
    tone: "emerald",
  },
  {
    id: "priority",
    label: "High Priority Areas",
    value: "12",
    change: "3 critical",
    tone: "rose",
  },
  {
    id: "health",
    label: "Crop Health",
    value: "86%",
    change: "+4.2% weekly",
    tone: "teal",
  },
  {
    id: "pest",
    label: "Pest Risk Level",
    value: "Medium",
    change: "rising in 5 zones",
    tone: "amber",
  },
  {
    id: "yield",
    label: "Expected Yield",
    value: "128,000 Tonnes",
    change: "+11.8% forecast",
    tone: "lime",
  },
  {
    id: "confidence",
    label: "AI Confidence",
    value: "94%",
    change: "based on 1.8M signals",
    tone: "sky",
  },
];

export const riskZones = [
  {
    region: "Guntur",
    crop: "Chilli",
    risk: "High",
    score: 91,
    position: [16.3067, 80.4365],
    issue: "Thrips and leaf curl probability",
    action: "Spray Spinosad and inspect in 24 hours",
  },
  {
    region: "Warangal",
    crop: "Cotton",
    risk: "Medium",
    score: 68,
    position: [17.9689, 79.5941],
    issue: "Pink bollworm early signal",
    action: "Install pheromone traps across affected fields",
  },
  {
    region: "Vijayawada",
    crop: "Paddy",
    risk: "Low",
    score: 32,
    position: [16.5062, 80.648],
    issue: "Stable crop health",
    action: "Maintain nitrogen schedule",
  },
  {
    region: "Karimnagar",
    crop: "Maize",
    risk: "Medium",
    score: 63,
    position: [18.4386, 79.1288],
    issue: "Fall armyworm surveillance required",
    action: "Scout border rows and apply neem formulation",
  },
  {
    region: "Nellore",
    crop: "Groundnut",
    risk: "High",
    score: 84,
    position: [14.4426, 79.9865],
    issue: "Fungal spread after rainfall",
    action: "Apply Mancozeb and improve drainage",
  },
  {
    region: "Nizamabad",
    crop: "Turmeric",
    risk: "Low",
    score: 28,
    position: [18.6725, 78.0941],
    issue: "No major anomaly",
    action: "Continue routine irrigation",
  },
];

export const weeklyRiskData = [
  { day: "Mon", pestRisk: 34, cropHealth: 82, moisture: 58 },
  { day: "Tue", pestRisk: 42, cropHealth: 81, moisture: 54 },
  { day: "Wed", pestRisk: 39, cropHealth: 84, moisture: 61 },
  { day: "Thu", pestRisk: 58, cropHealth: 79, moisture: 49 },
  { day: "Fri", pestRisk: 51, cropHealth: 83, moisture: 57 },
  { day: "Sat", pestRisk: 67, cropHealth: 77, moisture: 44 },
  { day: "Sun", pestRisk: 62, cropHealth: 80, moisture: 52 },
];

export const recommendations = [
  {
    region: "Guntur",
    disease: "Chilli leaf curl complex",
    treatment: "Spinosad 45 SC + micronutrient recovery spray",
    confidence: 96,
    priority: "Critical",
    improvement: "+18% yield protection",
  },
  {
    region: "Nellore",
    disease: "Groundnut tikka leaf spot",
    treatment: "Mancozeb 75 WP with drainage correction",
    confidence: 91,
    priority: "High",
    improvement: "+14% health recovery",
  },
  {
    region: "Warangal",
    disease: "Cotton pink bollworm risk",
    treatment: "Pheromone trap grid and targeted scouting",
    confidence: 88,
    priority: "Medium",
    improvement: "+9% loss reduction",
  },
];

export const weather = {
  location: "Vijayawada cluster",
  temperature: "31 C",
  humidity: "72%",
  rainfall: "18 mm",
  wind: "12 km/h",
  recommendation:
    "Delay foliar spray until evening. Humidity favors fungal spread in low-drainage plots.",
};

export const alerts = [
  {
    title: "Pest outbreak detected",
    region: "Guntur mandal",
    time: "12 min ago",
    severity: "Critical",
  },
  {
    title: "Irrigation stress warning",
    region: "Karimnagar north",
    time: "38 min ago",
    severity: "High",
  },
  {
    title: "Disease probability increased",
    region: "Nellore coastal belt",
    time: "1 hr ago",
    severity: "High",
  },
  {
    title: "Field visit completed",
    region: "Warangal rural",
    time: "2 hrs ago",
    severity: "Resolved",
  },
];

export const cropDistribution = [
  { name: "Paddy", value: 34, hectares: 18400 },
  { name: "Cotton", value: 22, hectares: 11900 },
  { name: "Chilli", value: 18, hectares: 9400 },
  { name: "Maize", value: 14, hectares: 7600 },
  { name: "Groundnut", value: 12, hectares: 6200 },
];

export const activityLogs = [
  {
    id: "VIS-1048",
    activity: "Farmer visit",
    region: "Guntur",
    owner: "Field Manager",
    status: "Scheduled",
    time: "Today, 4:30 PM",
  },
  {
    id: "REC-8821",
    activity: "AI recommendation issued",
    region: "Nellore",
    owner: "ModelOps",
    status: "Sent",
    time: "Today, 2:05 PM",
  },
  {
    id: "ALT-5210",
    activity: "Alert resolved",
    region: "Warangal",
    owner: "Agro Analyst",
    status: "Resolved",
    time: "Today, 11:10 AM",
  },
  {
    id: "INS-3390",
    activity: "Inspection log uploaded",
    region: "Karimnagar",
    owner: "Field Team 7",
    status: "Reviewing",
    time: "Yesterday, 6:45 PM",
  },
];

export const assistantSuggestions = [
  "Why is chilli risk rising?",
  "Best pesticide for bollworm",
  "Prioritize visits this week",
  "Forecast paddy yield",
];

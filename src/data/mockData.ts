export interface InfrastructureReport {
  id: string;
  type: "Pothole" | "Crack" | "Sinkhole" | "Bridge Erosion" | "Road Buckling";
  severity: "Low" | "Medium" | "High";
  iriScore: number;
  location: string;
  coordinates: { x: number; y: number };
  timestamp: string;
  futureIriScore: number;
}

export const initialReports: InfrastructureReport[] = [
  {
    id: "INF-001",
    type: "Pothole",
    severity: "High",
    iriScore: 82,
    location: "5th Ave & Main St",
    coordinates: { x: 35, y: 40 },
    timestamp: "2026-03-04T14:30:00",
    futureIriScore: 95,
  },
  {
    id: "INF-002",
    type: "Crack",
    severity: "Medium",
    iriScore: 45,
    location: "Harbor Bridge Rd",
    coordinates: { x: 62, y: 25 },
    timestamp: "2026-03-03T09:15:00",
    futureIriScore: 72,
  },
  {
    id: "INF-003",
    type: "Bridge Erosion",
    severity: "High",
    iriScore: 78,
    location: "Riverside Crossing",
    coordinates: { x: 75, y: 55 },
    timestamp: "2026-03-02T16:45:00",
    futureIriScore: 91,
  },
  {
    id: "INF-004",
    type: "Road Buckling",
    severity: "Low",
    iriScore: 22,
    location: "Central Park West",
    coordinates: { x: 45, y: 65 },
    timestamp: "2026-03-01T11:00:00",
    futureIriScore: 48,
  },
  {
    id: "INF-005",
    type: "Crack",
    severity: "Low",
    iriScore: 18,
    location: "Oak Street Tunnel",
    coordinates: { x: 20, y: 70 },
    timestamp: "2026-02-28T08:30:00",
    futureIriScore: 35,
  },
  {
    id: "INF-006",
    type: "Sinkhole",
    severity: "High",
    iriScore: 91,
    location: "Downtown Plaza",
    coordinates: { x: 50, y: 35 },
    timestamp: "2026-03-05T07:00:00",
    futureIriScore: 98,
  },
  {
    id: "INF-007",
    type: "Pothole",
    severity: "Medium",
    iriScore: 55,
    location: "Elm Street Corridor",
    coordinates: { x: 28, y: 48 },
    timestamp: "2026-02-27T13:20:00",
    futureIriScore: 74,
  },
  {
    id: "INF-008",
    type: "Crack",
    severity: "Medium",
    iriScore: 38,
    location: "Industrial Zone B",
    coordinates: { x: 82, y: 72 },
    timestamp: "2026-02-26T10:45:00",
    futureIriScore: 61,
  },
];

export function getIriColor(score: number): string {
  if (score <= 30) return "safe";
  if (score <= 60) return "warning";
  return "critical";
}

export function getIriColorHsl(score: number): string {
  if (score <= 30) return "hsl(var(--safe))";
  if (score <= 60) return "hsl(var(--warning))";
  return "hsl(var(--critical))";
}

const damageTypes: InfrastructureReport["type"][] = ["Pothole", "Crack", "Sinkhole", "Bridge Erosion", "Road Buckling"];
const locations = [
  "Market Street",
  "University Ave",
  "Bay Bridge Access",
  "Mission District Rd",
  "Sunset Blvd",
  "Pacific Heights",
];

export function generateRandomReport(): Omit<InfrastructureReport, "id" | "timestamp"> {
  const iriScore = Math.floor(Math.random() * 80) + 20;
  const severity: InfrastructureReport["severity"] =
    iriScore > 60 ? "High" : iriScore > 30 ? "Medium" : "Low";
  return {
    type: damageTypes[Math.floor(Math.random() * damageTypes.length)],
    severity,
    iriScore,
    location: locations[Math.floor(Math.random() * locations.length)],
    coordinates: {
      x: Math.floor(Math.random() * 70) + 15,
      y: Math.floor(Math.random() * 60) + 20,
    },
    futureIriScore: Math.min(100, iriScore + Math.floor(Math.random() * 25) + 5),
  };
}

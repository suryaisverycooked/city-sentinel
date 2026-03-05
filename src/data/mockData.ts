export interface InfrastructureReport {
  id: string;
  type: "Pothole" | "Road Surface Crack" | "Sinkhole" | "Bridge Erosion" | "Road Buckling" | "Building Structural Failure";
  severity: "Low" | "Medium" | "High" | "Critical";
  iriScore: number;
  location: string;
  coordinates: { x: number; y: number };
  timestamp: string;
  futureIriScore: number;
  imageUrl?: string;
}

export const initialReports: InfrastructureReport[] = [
  {
    id: "BLR-001",
    type: "Road Surface Crack",
    severity: "High",
    iriScore: 72,
    location: "Whitefield",
    coordinates: { x: 85, y: 45 },
    timestamp: "2026-03-04T14:30:00",
    futureIriScore: 88,
  },
  {
    id: "BLR-002",
    type: "Pothole",
    severity: "Medium",
    iriScore: 48,
    location: "Indiranagar",
    coordinates: { x: 65, y: 42 },
    timestamp: "2026-03-03T09:15:00",
    futureIriScore: 65,
  },
  {
    id: "BLR-003",
    type: "Bridge Erosion",
    severity: "High",
    iriScore: 78,
    location: "Hebbal",
    coordinates: { x: 50, y: 20 },
    timestamp: "2026-03-02T16:45:00",
    futureIriScore: 92,
  },
  {
    id: "BLR-004",
    type: "Road Buckling",
    severity: "Low",
    iriScore: 22,
    location: "Electronic City",
    coordinates: { x: 75, y: 85 },
    timestamp: "2026-03-01T11:00:00",
    futureIriScore: 45,
  },
  {
    id: "BLR-005",
    type: "Road Surface Crack",
    severity: "Low",
    iriScore: 15,
    location: "Koramangala",
    coordinates: { x: 60, y: 65 },
    timestamp: "2026-02-28T08:30:00",
    futureIriScore: 32,
  },
  {
    id: "BLR-006",
    type: "Building Structural Failure",
    severity: "High",
    iriScore: 85,
    location: "MG Road",
    coordinates: { x: 55, y: 48 },
    timestamp: "2026-03-05T07:00:00",
    futureIriScore: 96,
  },
  {
    id: "BLR-007",
    type: "Pothole",
    severity: "Medium",
    iriScore: 52,
    location: "BTM Layout",
    coordinates: { x: 58, y: 72 },
    timestamp: "2026-02-27T13:20:00",
    futureIriScore: 70,
  },
  {
    id: "BLR-008",
    type: "Road Surface Crack",
    severity: "Medium",
    iriScore: 38,
    location: "Yelahanka",
    coordinates: { x: 45, y: 15 },
    timestamp: "2026-02-26T10:45:00",
    futureIriScore: 61,
  },
];

export function getIriColor(score: number): string {
  if (score <= 25) return "#10b981"; // Low
  if (score <= 50) return "#f59e0b"; // Medium
  if (score <= 75) return "#ef4444"; // High
  return "#991b1b"; // Critical
}

export function getIriColorHsl(score: number): string {
  if (score <= 25) return "hsl(142 70% 45%)";
  if (score <= 50) return "hsl(37 91% 50%)";
  if (score <= 75) return "hsl(0 84% 60%)";
  return "hsl(0 84% 35%)";
}

export function estimateTCR(iriScore: number): string {
  if (iriScore >= 76) return `${Math.max(3, Math.floor((100 - iriScore) * 1.5))} days`;
  if (iriScore >= 51) return `${Math.floor((100 - iriScore) * 2)} days`;
  if (iriScore >= 26) return `${Math.floor((100 - iriScore) * 4)} days`;
  return "12+ months";
}

export const futureRiskMarkers: Omit<InfrastructureReport, "id" | "timestamp">[] = [
  { type: "Road Surface Crack", severity: "Medium", iriScore: 10, location: "Jayanagar", coordinates: { x: 45, y: 60 }, futureIriScore: 55 },
  { type: "Pothole", severity: "Low", iriScore: 5, location: "HSR Layout", coordinates: { x: 70, y: 68 }, futureIriScore: 48 },
  { type: "Bridge Erosion", severity: "Low", iriScore: 12, location: "Outer Ring Road", coordinates: { x: 80, y: 30 }, futureIriScore: 62 },
];

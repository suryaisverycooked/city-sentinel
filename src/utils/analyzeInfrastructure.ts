import type { InfrastructureReport } from "../data/mockData";

export function analyzeInfrastructure(description: string, imageUrl?: string): Partial<InfrastructureReport> {
  const desc = description.toLowerCase();

  let type: InfrastructureReport["type"] = "Road Surface Crack";
  let severity: InfrastructureReport["severity"] = "Low";
  let iriScore = 15;

  // Detection keywords for severe infrastructure damage
  const structuralDamageKeywords = [
    "structural", "collapse", "destruction", "destroyed", "demolished",
    "catastrophic", "severe", "complete failure", "total collapse",
    "building collapse", "structural failure", "major destruction"
  ];

  const potholeSinkHoleKeywords = [
    "cavity", "pothole", "hole", "sinkhole", "large hole", "road cavity"
  ];

  const bridgeDamageKeywords = [
    "erosion", "bridge", "water", "bridge crack", "bridge damage"
  ];

  const crackKeywords = [
    "crack", "surface", "road surface", "pavement"
  ];

  const bucklingKeywords = [
    "buckling", "heave", "warping", "deformation"
  ];

  // Check for structural damage first (highest priority)
  if (structuralDamageKeywords.some(keyword => desc.includes(keyword))) {
    type = "Building Structural Failure";
    severity = "Critical";
    iriScore = 90;
  }
  // Check for sinkhole/large cavity
  else if (potholeSinkHoleKeywords.some(keyword => desc.includes(keyword))) {
    if (desc.includes("large") || desc.includes("major") || desc.includes("sinkhole")) {
      type = "Sinkhole";
      severity = "High";
      iriScore = 72;
    } else {
      type = "Pothole";
      severity = "Medium";
      iriScore = 48;
    }
  }
  // Check for bridge erosion
  else if (bridgeDamageKeywords.some(keyword => desc.includes(keyword))) {
    type = "Bridge Erosion";
    severity = "High";
    iriScore = 68;
  }
  // Check for road buckling
  else if (bucklingKeywords.some(keyword => desc.includes(keyword))) {
    type = "Road Buckling";
    severity = "Medium";
    iriScore = 45;
  }
  // Check for cracks
  else if (crackKeywords.some(keyword => desc.includes(keyword))) {
    type = "Road Surface Crack";
    severity = "Medium";
    iriScore = 38;
  }

  // Additional severity modifiers
  if (desc.includes("minor")) {
    severity = "Low";
    iriScore = Math.max(iriScore - 15, 10);
  } else if (desc.includes("moderate")) {
    severity = "Medium";
    iriScore = Math.max(iriScore - 5, 30);
  } else if ((desc.includes("large") || desc.includes("major")) && severity === "Low") {
    severity = "Medium";
    iriScore = Math.min(iriScore + 20, 60);
  } else if (desc.includes("critical") && severity !== "Critical") {
    severity = "Critical";
    iriScore = Math.min(95, iriScore + 30);
  }

  // Ensure score bounds
  iriScore = Math.min(100, Math.max(0, iriScore));

  // Final severity determination based on score
  if (iriScore >= 85) severity = "Critical";
  else if (iriScore >= 60) severity = "High";
  else if (iriScore >= 35) severity = "Medium";
  else severity = "Low";

  return {
    type,
    severity,
    iriScore,
    futureIriScore: Math.min(100, iriScore + 15)
  };
}

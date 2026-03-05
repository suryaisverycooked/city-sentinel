import type { InfrastructureReport } from "../data/mockData";

export function analyzeInfrastructure(description: string, imageUrl?: string): Partial<InfrastructureReport> {
  const desc = description.toLowerCase();
  
  let type: InfrastructureReport["type"] = "Road Surface Crack";
  let severity: InfrastructureReport["severity"] = "Low";
  let iriScore = 15;

  // Classification rules
  if (desc.includes("structural") || desc.includes("collapse") || desc.includes("destruction")) {
    type = "Building Structural Failure";
    iriScore = 85;
  } else if (desc.includes("cavity") || desc.includes("pothole") || desc.includes("hole")) {
    type = "Pothole";
    iriScore = 55;
  } else if (desc.includes("crack") || desc.includes("surface")) {
    type = "Road Surface Crack";
    iriScore = 30;
  } else if (desc.includes("erosion") || desc.includes("bridge") || desc.includes("water")) {
    type = "Bridge Erosion";
    iriScore = 65;
  }

  // Severity adjustments based on keywords
  if (desc.includes("minor")) {
    severity = "Low";
    iriScore -= 10;
  } else if (desc.includes("moderate")) {
    severity = "Medium";
    iriScore += 10;
  } else if (desc.includes("large") || desc.includes("major")) {
    severity = "High";
    iriScore += 25;
  } else if (desc.includes("collapsed") || desc.includes("critical")) {
    severity = "Critical";
    iriScore = 95;
  }

  // Ensure score bounds
  iriScore = Math.min(100, Math.max(0, iriScore));
  
  // Refine severity based on final score
  if (iriScore > 75) severity = "Critical";
  else if (iriScore > 50) severity = "High";
  else if (iriScore > 25) severity = "Medium";
  else severity = "Low";

  return {
    type,
    severity,
    iriScore,
    futureIriScore: Math.min(100, iriScore + 20)
  };
}

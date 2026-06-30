/**
 * Types and interfaces for the Space Weather Intelligence Dashboard
 */

export interface SpaceTelemetry {
  solarWindSpeed: number; // km/s
  solarWindDensity: number; // p/cm3
  solarWindTemp: number; // K
  imfBz: number; // nT
  imfBt: number; // nT
  electronFlux: number; // pfu (E > 2 MeV)
  protonFlux: number; // pfu (E > 10 MeV)
  xrayFlux: string; // e.g. "B1.2", "X2.4"
  kpIndex: number; // 0-9
  dstIndex: number; // nT
  aeIndex: number; // nT
}

export interface Satellite {
  id: string;
  name: string;
  longitude: string;
  altitude: number; // km
  inclination: number; // deg
  health: number; // %
  battery: number; // %
  uplinkStatus: "Nominal" | "Degraded" | "Critical";
  downlinkStatus: "Nominal" | "Degraded" | "Critical";
  payloadStatus: "Active" | "Standby" | "Safe Mode";
  radiationExposure: number; // rad/hr
  shieldingStatus: "Nominal" | "Reinforced" | "Failsafe";
  footprint: string;
  polarization: string;
  gOverT: string; // dB/K
  eirp: string; // dBW
}

export interface ForecastPoint {
  timeOffset: number; // Minutes or Hours
  timestamp: string; // "12:00", "12:15", etc.
  actual: number | null; // Historical flux
  medianP50: number; // Median prediction
  p10: number; // Lower bound 10%
  p90: number; // Upper bound 90%
  ps: number; // Storm warning threshold 95%
  p95: number; // Extr extreme prediction 95%
}

export interface SolarEvent {
  id: string;
  type: "Solar Flare" | "CME" | "High Speed Stream" | "Geomagnetic Storm" | "Radiation Peak";
  magnitude: string; // "X2.4", "M5.1", "G3", etc.
  timestamp: string; // e.g., "10:30 UTC"
  duration: string;
  probability: number; // %
  status: "Active" | "Observed" | "Decaying" | "Predicted";
  impactScore: number; // 0-100
  affectedSats: string[];
}

export interface SatelliteImpact {
  satelliteId: string;
  name: string;
  expectedArrival: string; // e.g., "14 mins"
  estimatedExposure: string; // e.g., "4.5 rad/hr"
  priority: "Medium" | "High" | "Critical";
  suggestedAction: string;
}

export interface Alert {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  timestamp: string;
  satellite: string;
  mitigation: string;
}

export interface ShapContribution {
  feature: string;
  displayName: string;
  value: number; // SHAP value positive or negative
  actualValue: string; // The physical value
  impact: "positive" | "negative";
}

export interface ModelMetrics {
  name: string;
  rmse: number;
  mae: number;
  mape: string;
  r2: number;
  confidence: number;
  datasetSize: string;
  inferenceTime: string;
  lastUpdated: string;
}

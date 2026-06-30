import { 
  Satellite, 
  SpaceTelemetry, 
  ForecastPoint, 
  SolarEvent, 
  ShapContribution, 
  ModelMetrics, 
  Alert,
  SatelliteImpact
} from "./types";

// 1. Initial Satellites (ISRO Fleet)
export const INITIAL_SATELLITES: Satellite[] = [
  {
    id: "gsat-24",
    name: "GSAT-24",
    longitude: "75.0° E",
    altitude: 35786,
    inclination: 0.05,
    health: 98,
    battery: 98,
    uplinkStatus: "Nominal",
    downlinkStatus: "Nominal",
    payloadStatus: "Active",
    radiationExposure: 1.2, // rad/hr
    shieldingStatus: "Nominal",
    footprint: "Pan-India Coverage",
    polarization: "Linear / Circular (RHCP)",
    gOverT: "15.6 dB/K",
    eirp: "52.3 dBW"
  },
  {
    id: "gsat-31",
    name: "GSAT-31",
    longitude: "83.0° E",
    altitude: 35789,
    inclination: 0.08,
    health: 96,
    battery: 92,
    uplinkStatus: "Nominal",
    downlinkStatus: "Nominal",
    payloadStatus: "Active",
    radiationExposure: 0.95,
    shieldingStatus: "Nominal",
    footprint: "Indian Mainland & Islands",
    polarization: "Linear (H/V)",
    gOverT: "14.2 dB/K",
    eirp: "50.8 dBW"
  },
  {
    id: "insat-3dr",
    name: "INSAT-3DR",
    longitude: "74.0° E",
    altitude: 35782,
    inclination: 0.11,
    health: 94,
    battery: 89,
    uplinkStatus: "Nominal",
    downlinkStatus: "Nominal",
    payloadStatus: "Active",
    radiationExposure: 1.45,
    shieldingStatus: "Nominal",
    footprint: "Global Meteorological",
    polarization: "Circular (LHCP/RHCP)",
    gOverT: "-1.5 dB/K (S-Band)",
    eirp: "41.0 dBW"
  },
  {
    id: "gsat-19",
    name: "GSAT-19",
    longitude: "82.5° E",
    altitude: 35791,
    inclination: 0.03,
    health: 91,
    battery: 81,
    uplinkStatus: "Nominal",
    downlinkStatus: "Nominal",
    payloadStatus: "Active",
    radiationExposure: 1.85,
    shieldingStatus: "Nominal",
    footprint: "High Throughput Ka/Ku",
    polarization: "Dual Linear",
    gOverT: "16.8 dB/K",
    eirp: "54.2 dBW"
  }
];

// 2. Space Telemetry - Nominal Status
export const NOMINAL_TELEMETRY: SpaceTelemetry = {
  solarWindSpeed: 428, // km/s
  solarWindDensity: 4.8, // p/cm3
  solarWindTemp: 125000, // K
  imfBz: -1.2, // nT (southward slightly is nominal)
  imfBt: 5.3, // nT
  electronFlux: 145, // pfu
  protonFlux: 0.85, // pfu
  xrayFlux: "B1.2",
  kpIndex: 2.3, // Quiet/Quiet-Active
  dstIndex: -15, // nT (nominal geomagnetic)
  aeIndex: 145 // nT
};

// 3. Space Telemetry - Solar Storm (G3 / X-Class Flare Event)
export const STORM_TELEMETRY: SpaceTelemetry = {
  solarWindSpeed: 825, // km/s (Extremely High!)
  solarWindDensity: 38.5, // p/cm3
  solarWindTemp: 640000, // K (Incinerating Solar Core)
  imfBz: -18.4, // nT (Extreme southward Bz - triggers geomagnetic storm)
  imfBt: 24.2, // nT (Strong IMF)
  electronFlux: 8920, // pfu (Severe charging risk!)
  protonFlux: 412.5, // pfu (Solar radiation hazard)
  xrayFlux: "X2.4", // Massive X-class Flare
  kpIndex: 7.8, // Major Storm
  dstIndex: -184, // nT (Highly depressed magnetosphere)
  aeIndex: 1140 // nT (Intense auroral electrojet activity)
};

// 4. Forecasts (Nominal State)
export const FORECAST_30_45M_NOMINAL: ForecastPoint[] = [
  { timeOffset: -15, timestamp: "11:45", actual: 138, medianP50: 138, p10: 125, p90: 150, ps: 1000, p95: 165 },
  { timeOffset: 0,   timestamp: "12:00", actual: 145, medianP50: 145, p10: 130, p90: 160, ps: 1000, p95: 175 },
  { timeOffset: 5,   timestamp: "12:05", actual: null, medianP50: 148, p10: 132, p90: 165, ps: 1000, p95: 180 },
  { timeOffset: 10,  timestamp: "12:10", actual: null, medianP50: 151, p10: 135, p90: 170, ps: 1000, p95: 185 },
  { timeOffset: 15,  timestamp: "12:15", actual: null, medianP50: 155, p10: 138, p90: 175, ps: 1000, p95: 190 },
  { timeOffset: 20,  timestamp: "12:20", actual: null, medianP50: 158, p10: 140, p90: 180, ps: 1000, p95: 195 },
  { timeOffset: 25,  timestamp: "12:25", actual: null, medianP50: 161, p10: 142, p90: 184, ps: 1000, p95: 200 },
  { timeOffset: 30,  timestamp: "12:30", actual: null, medianP50: 163, p10: 144, p90: 188, ps: 1000, p95: 205 },
  { timeOffset: 35,  timestamp: "12:35", actual: null, medianP50: 164, p10: 145, p90: 190, ps: 1000, p95: 210 },
  { timeOffset: 40,  timestamp: "12:40", actual: null, medianP50: 166, p10: 146, p90: 194, ps: 1000, p95: 215 },
  { timeOffset: 45,  timestamp: "12:45", actual: null, medianP50: 168, p10: 147, p90: 198, ps: 1000, p95: 220 }
];

export const FORECAST_6H_NOMINAL: ForecastPoint[] = [
  { timeOffset: -2, timestamp: "10:00", actual: 132, medianP50: 132, p10: 110, p90: 150, ps: 1000, p95: 165 },
  { timeOffset: -1, timestamp: "11:00", actual: 138, medianP50: 138, p10: 115, p90: 155, ps: 1000, p95: 170 },
  { timeOffset: 0,  timestamp: "12:00", actual: 145, medianP50: 145, p10: 120, p90: 165, ps: 1000, p95: 180 },
  { timeOffset: 1,  timestamp: "13:00", actual: null, medianP50: 152, p10: 125, p90: 175, ps: 1000, p95: 195 },
  { timeOffset: 2,  timestamp: "14:00", actual: null, medianP50: 158, p10: 128, p90: 182, ps: 1000, p95: 205 },
  { timeOffset: 3,  timestamp: "15:00", actual: null, medianP50: 164, p10: 130, p90: 190, ps: 1000, p95: 215 },
  { timeOffset: 4,  timestamp: "16:00", actual: null, medianP50: 169, p10: 132, p90: 198, ps: 1000, p95: 225 },
  { timeOffset: 5,  timestamp: "17:00", actual: null, medianP50: 174, p10: 135, p90: 205, ps: 1000, p95: 235 },
  { timeOffset: 6,  timestamp: "18:00", actual: null, medianP50: 178, p10: 138, p90: 210, ps: 1000, p95: 245 }
];

export const FORECAST_12H_NOMINAL: ForecastPoint[] = [
  { timeOffset: -4, timestamp: "08:00", actual: 128, medianP50: 128, p10: 105, p90: 145, ps: 1000, p95: 155 },
  { timeOffset: -2, timestamp: "10:00", actual: 135, medianP50: 135, p10: 110, p90: 155, ps: 1000, p95: 165 },
  { timeOffset: 0,  timestamp: "12:00", actual: 145, medianP50: 145, p10: 118, p90: 168, ps: 1000, p95: 180 },
  { timeOffset: 2,  timestamp: "14:00", actual: null, medianP50: 156, p10: 122, p90: 180, ps: 1000, p95: 195 },
  { timeOffset: 4,  timestamp: "16:00", actual: null, medianP50: 168, p10: 128, p90: 195, ps: 1000, p95: 215 },
  { timeOffset: 6,  timestamp: "18:00", actual: null, medianP50: 176, p10: 132, p90: 208, ps: 1000, p95: 230 },
  { timeOffset: 8,  timestamp: "20:00", actual: null, medianP50: 184, p10: 135, p90: 218, ps: 1000, p95: 245 },
  { timeOffset: 10, timestamp: "22:00", actual: null, medianP50: 189, p10: 138, p90: 226, ps: 1000, p95: 255 },
  { timeOffset: 12, timestamp: "24:00", actual: null, medianP50: 193, p10: 140, p90: 232, ps: 1000, p95: 265 }
];

// 5. Forecasts (Solar Storm Active State - Massive exponential spike!)
export const FORECAST_30_45M_STORM: ForecastPoint[] = [
  { timeOffset: -15, timestamp: "11:45", actual: 145,  medianP50: 145,  p10: 130,  p90: 160,  ps: 1000, p95: 175 },
  { timeOffset: 0,   timestamp: "12:00", actual: 1480, medianP50: 1480, p10: 1250, p90: 1800, ps: 1000, p95: 2100 },
  { timeOffset: 5,   timestamp: "12:05", actual: null, medianP50: 3120, p10: 2800, p90: 3600, ps: 1000, p95: 4200 },
  { timeOffset: 10,  timestamp: "12:10", actual: null, medianP50: 4890, p10: 4400, p90: 5500, ps: 1000, p95: 6400 },
  { timeOffset: 15,  timestamp: "12:15", actual: null, medianP50: 6420, p10: 5800, p90: 7200, ps: 1000, p95: 8500 },
  { timeOffset: 20,  timestamp: "12:20", actual: null, medianP50: 7800, p10: 7000, p90: 8900, ps: 1000, p95: 10500 },
  { timeOffset: 25,  timestamp: "12:25", actual: null, medianP50: 8920, p10: 8100, p90: 9800, ps: 1000, p95: 11800 },
  { timeOffset: 30,  timestamp: "12:30", actual: null, medianP50: 9240, p10: 8400, p90: 10400, ps: 1000, p95: 12500 },
  { timeOffset: 35,  timestamp: "12:35", actual: null, medianP50: 9500, p10: 8600, p90: 10800, ps: 1000, p95: 13000 },
  { timeOffset: 40,  timestamp: "12:40", actual: null, medianP50: 9650, p10: 8800, p90: 11100, ps: 1000, p95: 13400 },
  { timeOffset: 45,  timestamp: "12:45", actual: null, medianP50: 9780, p10: 8900, p90: 11400, ps: 1000, p95: 13800 }
];

export const FORECAST_6H_STORM: ForecastPoint[] = [
  { timeOffset: -2, timestamp: "10:00", actual: 138,  medianP50: 138,  p10: 115,  p90: 155,  ps: 1000, p95: 170 },
  { timeOffset: -1, timestamp: "11:00", actual: 210,  medianP50: 210,  p10: 180,  p90: 245,  ps: 1000, p95: 275 },
  { timeOffset: 0,  timestamp: "12:00", actual: 1480, medianP50: 1480, p10: 1250, p90: 1800, ps: 1000, p95: 2100 },
  { timeOffset: 1,  timestamp: "13:00", actual: null, medianP50: 4500, p10: 3900, p90: 5200, ps: 1000, p95: 6100 },
  { timeOffset: 2,  timestamp: "14:00", actual: null, medianP50: 7800, p10: 6900, p90: 8900, ps: 1000, p95: 10500 },
  { timeOffset: 3,  timestamp: "15:00", actual: null, medianP50: 9200, p10: 8100, p90: 10400, ps: 1000, p95: 12500 },
  { timeOffset: 4,  timestamp: "16:00", actual: null, medianP50: 9800, p10: 8700, p90: 11100, ps: 1000, p95: 13500 },
  { timeOffset: 5,  timestamp: "17:00", actual: null, medianP50: 9500, p10: 8300, p90: 10900, ps: 1000, p95: 13000 },
  { timeOffset: 6,  timestamp: "18:00", actual: null, medianP50: 8800, p10: 7600, p90: 10100, ps: 1000, p95: 12000 }
];

export const FORECAST_12H_STORM: ForecastPoint[] = [
  { timeOffset: -4, timestamp: "08:00", actual: 135,  medianP50: 135,  p10: 110,  p90: 155,  ps: 1000, p95: 165 },
  { timeOffset: -2, timestamp: "10:00", actual: 145,  medianP50: 145,  p10: 118,  p90: 168,  ps: 1000, p95: 180 },
  { timeOffset: 0,  timestamp: "12:00", actual: 1480, medianP50: 1480, p10: 1250, p90: 1800, ps: 1000, p95: 2100 },
  { timeOffset: 2,  timestamp: "14:00", actual: null, medianP50: 7800, p10: 6900, p90: 8900, ps: 1000, p95: 10500 },
  { timeOffset: 4,  timestamp: "16:00", actual: null, medianP50: 9800, p10: 8700, p90: 11100, ps: 1000, p95: 13500 },
  { timeOffset: 6,  timestamp: "18:00", actual: null, medianP50: 8500, p10: 7300, p90: 9800, ps: 1000, p95: 11500 },
  { timeOffset: 8,  timestamp: "20:00", actual: null, medianP50: 6900, p10: 5800, p90: 8100, ps: 1000, p95: 9400 },
  { timeOffset: 10, timestamp: "22:00", actual: null, medianP50: 5200, p10: 4200, p90: 6300, ps: 1000, p95: 7500 },
  { timeOffset: 12, timestamp: "24:00", actual: null, medianP50: 4100, p10: 3100, p90: 5100, ps: 1000, p95: 6100 }
];

// 6. Solar Events Timeline
export const INITIAL_EVENTS: SolarEvent[] = [
  {
    id: "ev-01",
    type: "Solar Flare",
    magnitude: "X2.4",
    timestamp: "11:34 UTC",
    duration: "42 mins",
    probability: 98,
    status: "Active",
    impactScore: 88,
    affectedSats: ["GSAT-24", "GSAT-31", "INSAT-3DR"]
  },
  {
    id: "ev-02",
    type: "CME",
    magnitude: "HALO / 1850 km/s",
    timestamp: "11:42 UTC",
    duration: "Estimated Arrival 12:35",
    probability: 91,
    status: "Predicted",
    impactScore: 92,
    affectedSats: ["All GEO Fleet"]
  },
  {
    id: "ev-03",
    type: "Geomagnetic Storm",
    magnitude: "G3 Strong",
    timestamp: "12:00 UTC",
    duration: "Active (Next 18 Hours)",
    probability: 87,
    status: "Active",
    impactScore: 78,
    affectedSats: ["GSAT-24", "GSAT-19"]
  },
  {
    id: "ev-04",
    type: "High Speed Stream",
    magnitude: "Coronal Hole #84",
    timestamp: "Yesterday",
    duration: "Ongoing",
    probability: 100,
    status: "Observed",
    impactScore: 35,
    affectedSats: ["GSAT-31"]
  }
];

// 7. Explanable AI SHAP Contributions - Nominal
export const NOMINAL_SHAP: ShapContribution[] = [
  { feature: "electronFlux", displayName: "Electron Flux (E > 2 MeV)", value: 0.15, actualValue: "145 pfu", impact: "positive" },
  { feature: "solarWindSpeed", displayName: "Solar Wind Speed", value: 0.08, actualValue: "428 km/s", impact: "positive" },
  { feature: "imfBz", displayName: "IMF Bz (Z-component)", value: -0.05, actualValue: "-1.2 nT", impact: "negative" },
  { feature: "protonFlux", displayName: "Proton Flux (E > 10 MeV)", value: 0.03, actualValue: "0.85 pfu", impact: "positive" },
  { feature: "kpIndex", displayName: "Kp Index", value: 0.02, actualValue: "2.3 (Quiet)", impact: "positive" },
  { feature: "dstIndex", displayName: "Dst Index", value: -0.01, actualValue: "-15 nT", impact: "negative" },
  { feature: "aeIndex", displayName: "AE Index", value: 0.01, actualValue: "145 nT", impact: "positive" }
];

// Explanable AI SHAP Contributions - Storm Active (Highlights electron flux & solar wind speed screaming)
export const STORM_SHAP: ShapContribution[] = [
  { feature: "electronFlux", displayName: "Electron Flux (E > 2 MeV)", value: 0.68, actualValue: "8,920 pfu", impact: "positive" },
  { feature: "solarWindSpeed", displayName: "Solar Wind Speed", value: 0.42, actualValue: "825 km/s", impact: "positive" },
  { feature: "imfBz", displayName: "IMF Bz (Z-component)", value: -0.38, actualValue: "-18.4 nT", impact: "negative" },
  { feature: "protonFlux", displayName: "Proton Flux (E > 10 MeV)", value: 0.28, actualValue: "412.5 pfu", impact: "positive" },
  { feature: "kpIndex", displayName: "Kp Index", value: 0.22, actualValue: "7.8 (Storm)", impact: "positive" },
  { feature: "dstIndex", displayName: "Dst Index", value: -0.18, actualValue: "-184 nT", impact: "negative" },
  { feature: "aeIndex", displayName: "AE Index", value: 0.12, actualValue: "1,140 nT", impact: "positive" }
];

// 8. Model Metrics (TFT Model details)
export const TFT_MODEL_METRICS: ModelMetrics = {
  name: "Temporal Fusion Transformer (ANOVA-TFT-v2)",
  rmse: 0.082,
  mae: 0.054,
  mape: "3.84%",
  r2: 0.965,
  confidence: 95.4,
  datasetSize: "14.2 Years (ACE, DSCOVR, GOES-16, GOES-17 merged OMNI-2 database)",
  inferenceTime: "11.4 ms",
  lastUpdated: "Today, 10:30 UTC (Retrained weekly)"
};

// 9. Initial Alerts
export const INITIAL_ALERTS: Alert[] = [
  {
    id: "al-01",
    severity: "critical",
    title: "Radiation Storm Warning",
    message: "AI predicts Electron Flux (E > 2 MeV) exceeding 5000 pfu on GSAT-24 in next 30 minutes.",
    timestamp: "12:01 UTC",
    satellite: "GSAT-24",
    mitigation: "Deploy electromagnetic deflectors & power down non-essential Ka-band payloads."
  },
  {
    id: "al-02",
    severity: "warning",
    title: "Major Solar Flare Propagating",
    message: "X2.4 class solar flare observed at Sun central meridian. Elevated proton fluxes traveling at 1850 km/s.",
    timestamp: "11:36 UTC",
    satellite: "All GEO Fleet",
    mitigation: "Re-orient solar panels 15° pitch outward to reduce direct heavy-ion bombardment."
  },
  {
    id: "al-03",
    severity: "info",
    title: "Subsystem Safe-Mode Status",
    message: "INSAT-3DR weather imaging payload entering standby cycle as a pre-emptive protection measure.",
    timestamp: "11:15 UTC",
    satellite: "INSAT-3DR",
    mitigation: "None required. Automatic thermal shutter closing sequence initiated."
  }
];

// 10. Satellite Impacts (Storm State)
export const SATELLITE_IMPACTS: SatelliteImpact[] = [
  {
    satelliteId: "gsat-24",
    name: "GSAT-24",
    expectedArrival: "In Progress (Main Peak in 14m)",
    estimatedExposure: "8.9 rad/hr",
    priority: "Critical",
    suggestedAction: "Enable High Shielding Mode, shutdown Ka Payload"
  },
  {
    satelliteId: "gsat-31",
    name: "GSAT-31",
    expectedArrival: "22 mins",
    estimatedExposure: "5.4 rad/hr",
    priority: "High",
    suggestedAction: "Yaw-steering array mitigation, close thermal louvers"
  },
  {
    satelliteId: "insat-3dr",
    name: "INSAT-3DR",
    expectedArrival: "35 mins",
    estimatedExposure: "6.8 rad/hr",
    priority: "High",
    suggestedAction: "Pre-emptively standby meteorological sensors"
  },
  {
    satelliteId: "gsat-19",
    name: "GSAT-19",
    expectedArrival: "41 mins",
    estimatedExposure: "4.1 rad/hr",
    priority: "Medium",
    suggestedAction: "Monitor sensor telemetry and battery temperatures"
  }
];

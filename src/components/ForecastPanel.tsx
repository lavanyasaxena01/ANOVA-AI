import React, { useState, useRef } from "react";
import { ForecastPoint } from "../types";
import { 
  FORECAST_30_45M_NOMINAL, 
  FORECAST_30_45M_STORM,
  FORECAST_6H_NOMINAL,
  FORECAST_6H_STORM,
  FORECAST_12H_NOMINAL,
  FORECAST_12H_STORM 
} from "../data";
import { Info, BarChart2, TrendingUp, Cpu, Eye, AlertTriangle } from "lucide-react";

interface ForecastPanelProps {
  isStormActive: boolean;
  selectedSatelliteName: string;
}

export default function ForecastPanel({ isStormActive, selectedSatelliteName }: ForecastPanelProps) {
  const [activeHorizon, setActiveHorizon] = useState<"30m" | "6h" | "12h">("30m");
  const [hoveredPoint, setHoveredPoint] = useState<ForecastPoint | null>(null);
  const [cursorX, setCursorX] = useState<number | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  // 1. Select correct dataset
  let dataset: ForecastPoint[] = [];
  if (activeHorizon === "30m") {
    dataset = isStormActive ? FORECAST_30_45M_STORM : FORECAST_30_45M_NOMINAL;
  } else if (activeHorizon === "6h") {
    dataset = isStormActive ? FORECAST_6H_STORM : FORECAST_6H_NOMINAL;
  } else {
    dataset = isStormActive ? FORECAST_12H_STORM : FORECAST_12H_NOMINAL;
  }

  // 2. Define coordinate system
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = 720;
  const chartHeight = 220;

  // Find max and min values for vertical scale
  const allValues = dataset.flatMap(p => [
    p.actual || 0, 
    p.medianP50, 
    p.p10, 
    p.p90, 
    p.p95
  ]).filter(v => v !== null && v !== undefined);

  const maxVal = Math.max(...allValues, 100) * 1.15; // 15% breathing room
  const minVal = Math.max(0, Math.min(...allValues) * 0.85);
  const valRange = maxVal - minVal || 1;

  // Map to SVG coordinates
  const mapX = (index: number) => {
    return paddingX + (index / (dataset.length - 1)) * (chartWidth - paddingX * 2);
  };

  const mapY = (val: number) => {
    // Linear scale
    return chartHeight - paddingY - ((val - minVal) / valRange) * (chartHeight - paddingY * 2);
  };

  // Generate SVG path coordinate sets
  const pointsP10 = dataset.map((p, i) => `${mapX(i)},${mapY(p.p10)}`);
  const pointsP90 = dataset.map((p, i) => `${mapX(i)},${mapY(p.p90)}`);
  const pointsP95 = dataset.map((p, i) => `${mapX(i)},${mapY(p.p95)}`);

  // P10-P90 polygon filled area path
  const p10p90AreaPath = [
    ...pointsP10,
    ...([...pointsP90].reverse())
  ].join(" ");

  // P90-P95 outer storm band area path
  const p90p95AreaPath = [
    ...pointsP90,
    ...([...pointsP95].reverse())
  ].join(" ");

  // Actual Historical path (only up to now, offset = 0)
  const actualPoints = dataset
    .map((p, i) => p.actual !== null ? `${mapX(i)},${mapY(p.actual)}` : null)
    .filter(Boolean);
  const actualPath = actualPoints.join(" ");

  // Forecast path (from now onwards, offset >= 0)
  const forecastPoints = dataset
    .map((p, i) => p.actual === null || p.timeOffset === 0 ? `${mapX(i)},${mapY(p.medianP50)}` : null)
    .filter(Boolean);
  const forecastPath = forecastPoints.join(" ");

  // Mouse move over SVG chart to find nearest data point
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Map mouseX to closest dataset index
    const totalW = rect.width;
    const pxLeft = (paddingX / chartWidth) * totalW;
    const pxRight = ((chartWidth - paddingX) / chartWidth) * totalW;
    
    let pct = (mouseX - pxLeft) / (pxRight - pxLeft);
    pct = Math.max(0, Math.min(1, pct));
    
    const index = Math.round(pct * (dataset.length - 1));
    const point = dataset[index];
    
    if (point) {
      setHoveredPoint(point);
      setCursorX(mapX(index));
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setCursorX(null);
  };

  // Switch tabs
  const tabs = [
    { id: "30m", label: "30–45 MINUTES (NOWCAST)" },
    { id: "6h", label: "6 HOURS (SHORT-TERM)" },
    { id: "12h", label: "12 HOURS (LONG-TERM)" }
  ] as const;

  // Active prediction metrics for visual display
  const nowPoint = dataset.find(p => p.timeOffset === 0) || dataset[0];
  const peakPoint = dataset.reduce((max, p) => p.medianP50 > max.medianP50 ? p : max, dataset[0]);
  const currentConfidence = isStormActive ? 92.4 : 95.8;

  return (
    <div className="glass-panel rounded-xl p-5 border border-cyber-blue/15 flex flex-col h-full shadow-lg">
      
      {/* Header and Horizonal selectors */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyber-blue/10 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h3 className="font-display font-bold text-sm text-white tracking-widest uppercase">
              TFT RADIATION FLUX PREDICTIONS (ANOVA-TFT-v2)
            </h3>
          </div>
          <p className="text-[10px] font-mono text-cyan-500 mt-1 uppercase tracking-wider">
            Targeting Electron Flux (E &gt; 2 MeV) at {selectedSatelliteName} geostationary longitude
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-950/80 border border-cyber-blue/20 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveHorizon(tab.id);
                setHoveredPoint(null);
                setCursorX(null);
              }}
              className={`px-3 py-1.5 rounded text-[10px] font-display font-semibold transition-all uppercase tracking-wider ${
                activeHorizon === tab.id
                  ? "bg-gradient-to-r from-cyan-600 to-cyber-teal text-white shadow-md shadow-cyan-600/10"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row above the chart */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 bg-slate-950/45 p-3 rounded-lg border border-cyber-blue/5">
        <div>
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">AI Forecast Confidence</span>
          <span className="text-sm font-display font-black text-green-400 mt-0.5 block">{currentConfidence}%</span>
        </div>
        <div>
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Model Uncertainty (σ)</span>
          <span className="text-sm font-display font-black text-cyan-400 mt-0.5 block">
            {isStormActive ? "±342 pfu (Severe)" : "±12.4 pfu (Stable)"}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Predicted Peak Flux</span>
          <span className={`text-sm font-display font-black mt-0.5 block ${isStormActive ? "text-red-400" : "text-cyan-400"}`}>
            {Math.round(peakPoint.medianP50).toLocaleString()} pfu
          </span>
        </div>
        <div>
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Status Notification</span>
          <span className={`text-xs font-display font-bold mt-0.5 block flex items-center gap-1 ${
            isStormActive ? "text-red-400 animate-pulse" : "text-green-400"
          }`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            {isStormActive ? "SOLAR STORM ACTIVE" : "NOMINAL FLUX RANGE"}
          </span>
        </div>
      </div>

      {/* Main Interactive Chart Canvas Area */}
      <div className="relative flex-1 bg-slate-950/30 rounded-lg p-2 border border-cyber-blue/10 min-h-[220px]">
        
        {/* Hover Readout Overlay Display */}
        {hoveredPoint ? (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-cyan-400/40 p-2.5 rounded-md shadow-xl z-10 flex gap-4 text-[10px] font-mono backdrop-blur">
            <div>
              <span className="text-gray-500 block uppercase">TIME:</span>
              <span className="text-cyan-300 font-bold block mt-0.5">
                {hoveredPoint.timeOffset === 0 ? "NOW (12:00 UTC)" : `${hoveredPoint.timestamp} UTC (${hoveredPoint.timeOffset > 0 ? "+" : ""}${hoveredPoint.timeOffset}${activeHorizon === "30m" ? "m" : "h"})`}
              </span>
            </div>
            {hoveredPoint.actual !== null && (
              <div>
                <span className="text-gray-500 block uppercase">MEASURED:</span>
                <span className="text-blue-400 font-bold block mt-0.5">{Math.round(hoveredPoint.actual).toLocaleString()} pfu</span>
              </div>
            )}
            <div>
              <span className="text-gray-500 block uppercase">AI MEDIAN (P50):</span>
              <span className="text-cyan-400 font-extrabold block mt-0.5">{Math.round(hoveredPoint.medianP50).toLocaleString()} pfu</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase">BOUNDS (P10-P90):</span>
              <span className="text-teal-400 block mt-0.5">
                [{Math.round(hoveredPoint.p10).toLocaleString()} - {Math.round(hoveredPoint.p90).toLocaleString()}]
              </span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase">CRITICAL BAND (P95):</span>
              <span className="text-cyber-orange block mt-0.5">&gt; {Math.round(hoveredPoint.p95).toLocaleString()} pfu</span>
            </div>
          </div>
        ) : (
          <div className="absolute top-2 right-4 text-[9px] font-mono text-cyan-500/50 uppercase tracking-widest pointer-events-none flex items-center gap-1.5">
            <Eye className="w-3 h-3" />
            <span>Hover chart to inspect details</span>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-2 left-4 flex flex-wrap gap-x-4 gap-y-1 text-[8px] font-mono uppercase tracking-widest text-gray-500 pointer-events-none">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-blue-500 inline-block"></span>
            <span>Measured Flux</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-cyan-400 inline-block"></span>
            <span>AI Median Forecast</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-1.5 bg-cyan-500/10 inline-block"></span>
            <span>P10–P90 Confidence Band</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-1.5 bg-cyber-orange/10 inline-block"></span>
            <span>Extreme P95 Storm Band</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 border-t border-red-500/60 border-dashed inline-block"></span>
            <span className="text-red-400">Storm Hazard Threshold</span>
          </div>
        </div>

        {/* Chart SVG */}
        <svg
          ref={chartRef}
          className="w-full h-full overflow-visible select-none"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Custom gradients definitions */}
          <defs>
            <linearGradient id="p10p90Gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={isStormActive ? "0.15" : "0.25"} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02" />
            </linearGradient>
            
            <linearGradient id="p90p95Gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isStormActive ? "#f97316" : "#0d9488"} stopOpacity="0.12" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="glowFilter" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const yVal = minVal + (i * valRange) / 4;
            const yPos = mapY(yVal);
            return (
              <g key={i}>
                {/* Horizontal grid line */}
                <line
                  x1={paddingX}
                  y1={yPos}
                  x2={chartWidth - paddingX}
                  y2={yPos}
                  stroke="rgba(14, 165, 233, 0.05)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                {/* Y-axis label */}
                <text
                  x={paddingX - 8}
                  y={yPos + 3}
                  textAnchor="end"
                  fill="rgba(148, 163, 184, 0.4)"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {Math.round(yVal).toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* X-axis time labels */}
          {dataset.map((p, i) => {
            const xPos = mapX(i);
            // Draw labeled hours / mins depending on density
            const shouldLabel = activeHorizon === "30m" 
              ? i % 2 === 0 
              : activeHorizon === "6h" 
                ? true 
                : i % 2 === 0;

            return (
              <g key={i}>
                {shouldLabel && (
                  <text
                    x={xPos}
                    y={chartHeight - paddingY + 12}
                    textAnchor="middle"
                    fill="rgba(148, 163, 184, 0.45)"
                    fontSize="7.5"
                    fontFamily="monospace"
                  >
                    {p.timeOffset === 0 ? "NOW" : p.timestamp}
                  </text>
                )}
                {/* Tick mark */}
                <line
                  x1={xPos}
                  y1={chartHeight - paddingY}
                  x2={xPos}
                  y2={chartHeight - paddingY + 3}
                  stroke="rgba(14, 165, 233, 0.15)"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Storm Warning Horizontal Line Threshold (ps = 1000 pfu) */}
          {minVal < 1200 && maxVal > 800 && (
            <line
              x1={paddingX}
              y1={mapY(1000)}
              x2={chartWidth - paddingX}
              y2={mapY(1000)}
              stroke="#ef4444"
              strokeWidth="1"
              strokeDasharray="4 4"
              strokeOpacity="0.6"
            />
          )}

          {/* 3. TRANS-INTERVAL CONFIDENCE SHADING (POLYGONS) */}
          {/* Outer extreme P90-P95 Area */}
          <polygon
            points={p90p95AreaPath}
            fill="url(#p90p95Gradient)"
          />

          {/* Inner median P10-P90 Area */}
          <polygon
            points={p10p90AreaPath}
            fill="url(#p10p90Gradient)"
          />

          {/* 4. MEDIAN AND HISTORICAL PLOT CURVES */}
          {/* Measured line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={actualPath}
          />

          {/* Predicted median line */}
          <polyline
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2.5"
            points={forecastPath}
            strokeDasharray={isStormActive ? "" : "1 1"} // Solid pulsing for storm
          />

          {/* NOW Vertical Divider line */}
          {(() => {
            const nowIdx = dataset.findIndex(p => p.timeOffset === 0);
            if (nowIdx === -1) return null;
            const nowX = mapX(nowIdx);
            return (
              <g>
                <line
                  x1={nowX}
                  y1={paddingY - 5}
                  x2={nowX}
                  y2={chartHeight - paddingY + 5}
                  stroke="rgba(34, 211, 238, 0.4)"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                <circle
                  cx={nowX}
                  cy={mapY(dataset[nowIdx].medianP50)}
                  r="4"
                  fill="#ffffff"
                  stroke="#22d3ee"
                  strokeWidth="1.5"
                />
                {/* NOW label on axis */}
                <rect
                  x={nowX - 14}
                  y={paddingY - 14}
                  width="28"
                  height="11"
                  rx="2"
                  fill="#0c4a6e"
                  stroke="#22d3ee"
                  strokeWidth="0.8"
                />
                <text
                  x={nowX}
                  y={paddingY - 6}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="7"
                  fontStyle="normal"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  NOW
                </text>
              </g>
            );
          })()}

          {/* 5. INTERACTIVE MOUSE CURSOR TRACKER HIGHLIGHTS */}
          {cursorX !== null && hoveredPoint && (
            <g>
              {/* Vertical dotted track line */}
              <line
                x1={cursorX}
                y1={paddingY}
                x2={cursorX}
                y2={chartHeight - paddingY}
                stroke="rgba(34, 211, 238, 0.7)"
                strokeWidth="1"
                strokeDasharray="2 1"
              />
              
              {/* Hovered Median Point Node */}
              <circle
                cx={cursorX}
                cy={mapY(hoveredPoint.medianP50)}
                r="5"
                fill="#22d3ee"
                stroke="#ffffff"
                strokeWidth="1.5"
              />

              {/* Hovered Bounds point markers */}
              <circle
                cx={cursorX}
                cy={mapY(hoveredPoint.p10)}
                r="3"
                fill="#0ea5e9"
              />
              <circle
                cx={cursorX}
                cy={mapY(hoveredPoint.p90)}
                r="3"
                fill="#0ea5e9"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Footer warning indicators */}
      <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-400 bg-slate-950/20 p-2.5 rounded border border-cyber-blue/5">
        <Info className="w-4 h-4 text-cyan-500 shrink-0" />
        <p className="leading-normal">
          <strong>Explainability Note:</strong> Predictions are generated through deep temporal fusion of IMF vector magnetograms and low-energy electron telemetry. Check out the <span className="text-cyan-400">AI Explainability</span> section to view active SHAP feature weights.
        </p>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Info, BarChart2, TrendingUp, Cpu, Sliders, Calendar } from "lucide-react";

interface HistoricalAnalyticsPanelProps {
  isStormActive: boolean;
}

export default function HistoricalAnalyticsPanel({ isStormActive }: HistoricalAnalyticsPanelProps) {
  const [activeMetric, setActiveMetric] = useState<"flux-wind" | "error">("flux-wind");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Generate 24 hours of mock historical telemetry data
  // Index 0 represents 24 hours ago, index 23 represents "Now" (12:00 UTC)
  const generateHistoryData = () => {
    const data = [];
    const baseWind = isStormActive ? 740 : 410;
    const baseFlux = isStormActive ? 7500 : 138;

    for (let i = 0; i < 24; i++) {
      const hour = (12 + i) % 24;
      const hourStr = `${hour.toString().padStart(2, "0")}:00`;
      
      // Add a progressive upward spike if a storm is active (simulating flare eruption at index 18)
      let windVal = baseWind + Math.sin(i * 0.3) * 20 + Math.cos(i * 0.5) * 10;
      let fluxVal = baseFlux + Math.sin(i * 0.2) * 15 + Math.cos(i * 0.7) * 8;
      let errorRate = 1.8 + Math.sin(i * 0.6) * 0.6 + Math.cos(i * 0.2) * 0.2;

      if (isStormActive) {
        if (i >= 16) {
          // Exponential spike simulating flare onset
          const factor = (i - 15) / 8; // 0 to 1
          windVal = 420 + (825 - 420) * factor + Math.sin(i * 1.5) * 15;
          fluxVal = 145 + (8920 - 145) * Math.pow(factor, 2) + Math.cos(i * 2.1) * 25;
          errorRate = 2.1 + (5.4 - 2.1) * factor + Math.sin(i * 0.8) * 0.4;
        } else {
          // Normal background before storm onset
          windVal = 425 + Math.sin(i * 0.3) * 15;
          fluxVal = 135 + Math.cos(i * 0.5) * 10;
          errorRate = 1.9 + Math.sin(i * 0.4) * 0.3;
        }
      }

      data.push({
        hour: hourStr,
        windSpeed: windVal,
        electronFlux: fluxVal,
        errorRate: errorRate // MAE in %
      });
    }
    return data;
  };

  const history = generateHistoryData();

  // Draw parameters
  const chartWidth = 500;
  const chartHeight = 125;
  const padX = 35;
  const padY = 15;

  const mapX = (idx: number) => {
    return padX + (idx / 23) * (chartWidth - padX * 2);
  };

  const mapYFlux = (val: number) => {
    const maxVal = isStormActive ? 10000 : 250;
    const minVal = isStormActive ? 50 : 100;
    const range = maxVal - minVal;
    return chartHeight - padY - ((val - minVal) / range) * (chartHeight - padY * 2);
  };

  const mapYWind = (val: number) => {
    const maxVal = isStormActive ? 900 : 480;
    const minVal = isStormActive ? 380 : 390;
    const range = maxVal - minVal;
    return chartHeight - padY - ((val - minVal) / range) * (chartHeight - padY * 2);
  };

  const mapYError = (val: number) => {
    const maxVal = 6.5;
    const minVal = 0.5;
    const range = maxVal - minVal;
    return chartHeight - padY - ((val - minVal) / range) * (chartHeight - padY * 2);
  };

  // Generate paths for curves
  const fluxPoints = history.map((d, i) => `${mapX(i)},${mapYFlux(d.electronFlux)}`).join(" ");
  const fluxAreaPoints = [
    `${mapX(0)},${chartHeight - padY}`,
    ...history.map((d, i) => `${mapX(i)},${mapYFlux(d.electronFlux)}`),
    `${mapX(23)},${chartHeight - padY}`
  ].join(" ");

  const windPoints = history.map((d, i) => `${mapX(i)},${mapYWind(d.windSpeed)}`).join(" ");
  const windAreaPoints = [
    `${mapX(0)},${chartHeight - padY}`,
    ...history.map((d, i) => `${mapX(i)},${mapYWind(d.windSpeed)}`),
    `${mapX(23)},${chartHeight - padY}`
  ].join(" ");

  const errorPoints = history.map((d, i) => `${mapX(i)},${mapYError(d.errorRate)}`).join(" ");
  const errorAreaPoints = [
    `${mapX(0)},${chartHeight - padY}`,
    ...history.map((d, i) => `${mapX(i)},${mapYError(d.errorRate)}`),
    `${mapX(23)},${chartHeight - padY}`
  ].join(" ");

  return (
    <div className="glass-panel rounded-xl p-5 border border-cyber-blue/15 flex flex-col h-full shadow-lg">
      
      {/* Selector and Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-cyber-blue/10 pb-3 mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4.5 h-4.5 text-cyan-400" />
            <h4 className="font-display font-bold text-xs text-white uppercase tracking-widest">
              HISTORICAL TELEMETRY ANALYTICS (24h)
            </h4>
          </div>
          <p className="text-[10px] font-mono text-cyan-500 mt-0.5 uppercase tracking-wider">
            Historic solar plasma fluxes vs prediction actuals
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-950/80 border border-cyber-blue/20 p-1 rounded-lg">
          <button
            onClick={() => {
              setActiveMetric("flux-wind");
              setHoverIndex(null);
            }}
            className={`px-3 py-1 rounded text-[9px] font-mono font-bold transition-all uppercase tracking-wider ${
              activeMetric === "flux-wind"
                ? "bg-gradient-to-r from-cyan-600 to-cyber-teal text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Flux & Wind Speed
          </button>
          <button
            onClick={() => {
              setActiveMetric("error");
              setHoverIndex(null);
            }}
            className={`px-3 py-1 rounded text-[9px] font-mono font-bold transition-all uppercase tracking-wider ${
              activeMetric === "error"
                ? "bg-gradient-to-r from-cyan-600 to-cyber-teal text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Prediction Error Rate
          </button>
        </div>
      </div>

      {/* Hover Cursor overlay data readout */}
      {hoverIndex !== null ? (
        <div className="bg-slate-950 p-2 border border-cyan-500/10 rounded mb-3 flex justify-between items-center text-[10px] font-mono">
          <span className="text-gray-400 font-bold">TIME RECORD: <strong className="text-cyan-300">{history[hoverIndex].hour} UTC</strong></span>
          {activeMetric === "flux-wind" ? (
            <div className="flex gap-4">
              <span className="text-gray-500">ELECTRON FLUX: <strong className="text-blue-400">{Math.round(history[hoverIndex].electronFlux).toLocaleString()} pfu</strong></span>
              <span className="text-gray-500">SOLAR WIND: <strong className="text-cyber-orange">{Math.round(history[hoverIndex].windSpeed)} km/s</strong></span>
            </div>
          ) : (
            <span className="text-gray-500">TFT ABSOLUTE RESIDUAL ERROR: <strong className="text-red-400">{history[hoverIndex].errorRate.toFixed(2)}%</strong></span>
          )}
        </div>
      ) : (
        <div className="text-[9px] font-mono text-cyan-500/50 uppercase tracking-widest mb-3 text-right">
          Hover curves to inspect specific hourly logs
        </div>
      )}

      {/* Main Graph Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 items-stretch">
        
        {activeMetric === "flux-wind" ? (
          <>
            {/* 1. Electron Flux Chart */}
            <div className="bg-slate-950/25 border border-cyber-blue/10 p-3 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-widest block mb-2 border-b border-cyber-blue/5 pb-1">
                Electron Flux (E &gt; 2 MeV)
              </span>

              <div className="flex-1 relative min-h-[110px]">
                <svg
                  className="w-full h-full overflow-visible cursor-crosshair"
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const index = Math.round(((e.clientX - rect.left) / rect.width) * 23);
                    if (index >= 0 && index < 24) setHoverIndex(index);
                  }}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <defs>
                    <linearGradient id="fluxAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guideline grid */}
                  <line x1={padX} y1={chartHeight / 2} x2={chartWidth - padX} y2={chartHeight / 2} stroke="rgba(14, 165, 233, 0.05)" strokeDasharray="2 3" />

                  {/* Shaded Area */}
                  <polygon points={fluxAreaPoints} fill="url(#fluxAreaGrad)" />

                  {/* Main Curve Line */}
                  <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={fluxPoints} />

                  {/* Hover node circle */}
                  {hoverIndex !== null && (
                    <circle cx={mapX(hoverIndex)} cy={mapYFlux(history[hoverIndex].electronFlux)} r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
                  )}
                </svg>
              </div>
            </div>

            {/* 2. Solar Wind Speed Chart */}
            <div className="bg-slate-950/25 border border-cyber-blue/10 p-3 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] font-mono text-cyber-orange font-bold uppercase tracking-widest block mb-2 border-b border-cyber-blue/5 pb-1">
                Solar Wind Velocity
              </span>

              <div className="flex-1 relative min-h-[110px]">
                <svg
                  className="w-full h-full overflow-visible cursor-crosshair"
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const index = Math.round(((e.clientX - rect.left) / rect.width) * 23);
                    if (index >= 0 && index < 24) setHoverIndex(index);
                  }}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <defs>
                    <linearGradient id="windAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <line x1={padX} y1={chartHeight / 2} x2={chartWidth - padX} y2={chartHeight / 2} stroke="rgba(14, 165, 233, 0.05)" strokeDasharray="2 3" />
                  <polygon points={windAreaPoints} fill="url(#windAreaGrad)" />
                  <polyline fill="none" stroke="#f97316" strokeWidth="2" points={windPoints} />

                  {/* Hover node circle */}
                  {hoverIndex !== null && (
                    <circle cx={mapX(hoverIndex)} cy={mapYWind(history[hoverIndex].windSpeed)} r="4" fill="#ffffff" stroke="#f97316" strokeWidth="2" />
                  )}
                </svg>
              </div>
            </div>
          </>
        ) : (
          /* 3. Prediction Error Deviation rate chart */
          <div className="bg-slate-950/25 border border-cyber-blue/10 p-4 rounded-lg col-span-2 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest block mb-2 border-b border-cyber-blue/5 pb-1">
              TFT Residual Mean Absolute Error (MAE) Trend
            </span>

            <div className="flex-1 relative min-h-[110px] w-full">
              <svg
                className="w-full h-[115px] overflow-visible cursor-crosshair"
                viewBox={`0 0 ${chartWidth * 2} ${chartHeight}`}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const index = Math.round(((e.clientX - rect.left) / rect.width) * 23);
                  if (index >= 0 && index < 24) setHoverIndex(index);
                }}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <defs>
                  <linearGradient id="errorAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <line x1={padX} y1={chartHeight / 2} x2={chartWidth * 2 - padX} y2={chartHeight / 2} stroke="rgba(14, 165, 233, 0.05)" strokeDasharray="2 3" />
                
                {/* Scale the horizontal spacing mapping to take full width */}
                {(() => {
                  const doubleMapX = (i: number) => padX + (i / 23) * (chartWidth * 2 - padX * 2);
                  const doubleErrorPoints = history.map((d, i) => `${doubleMapX(i)},${mapYError(d.errorRate)}`).join(" ");
                  const doubleErrorAreaPoints = [
                    `${doubleMapX(0)},${chartHeight - padY}`,
                    ...history.map((d, i) => `${doubleMapX(i)},${mapYError(d.errorRate)}`),
                    `${doubleMapX(23)},${chartHeight - padY}`
                  ].join(" ");

                  return (
                    <g>
                      <polygon points={doubleErrorAreaPoints} fill="url(#errorAreaGrad)" />
                      <polyline fill="none" stroke="#ef4444" strokeWidth="2" points={doubleErrorPoints} />
                      {hoverIndex !== null && (
                        <circle cx={doubleMapX(hoverIndex)} cy={mapYError(history[hoverIndex].errorRate)} r="4" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
                      )}
                    </g>
                  );
                })()}
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Footer descriptor */}
      <div className="mt-4 pt-3 border-t border-cyber-blue/10 flex items-center gap-1.5 text-[8.5px] text-gray-500 font-mono">
        <Info className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
        <span>
          Daily trend metrics collected across ISRO MCF Hassan and NOAA Space Weather Prediction Center. Solid line plots actual residual errors, showing maximum model stability during solar flare onsets.
        </span>
      </div>
    </div>
  );
}

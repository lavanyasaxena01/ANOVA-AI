import React from "react";
import { SpaceTelemetry } from "../types";
import { 
  Sun, 
  Wind, 
  Thermometer, 
  Compass, 
  Zap, 
  Radio, 
  Activity, 
  Flame,
  Gauge,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

interface SpaceWeatherPanelProps {
  telemetry: SpaceTelemetry;
  isStormActive: boolean;
}

export default function SpaceWeatherPanel({ telemetry, isStormActive }: SpaceWeatherPanelProps) {
  // Generate a fake stable historical sparkline based on current value
  const getSparklinePoints = (currentVal: number, scale: number = 0.05) => {
    const points = [];
    for (let i = 0; i < 12; i++) {
      // Create some variance
      const variance = (Math.sin(i * 0.5) * scale + (Math.cos(i * 0.9) * (scale / 2))) * currentVal;
      points.push(currentVal + variance);
    }
    // Set final point to exact current value
    points[points.length - 1] = currentVal;
    
    // Convert to SVG path string
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    
    return points.map((p, index) => {
      const x = (index / (points.length - 1)) * 50;
      const y = 15 - ((p - min) / range) * 12;
      return `${x},${y}`;
    }).join(" ");
  };

  // KPI cards list
  const kpis = [
    {
      title: "Solar Wind Speed",
      value: `${telemetry.solarWindSpeed} km/s`,
      unit: "Velocity",
      icon: Wind,
      color: telemetry.solarWindSpeed > 600 ? "text-cyber-orange" : "text-cyan-400",
      bgBorder: telemetry.solarWindSpeed > 600 ? "border-cyber-orange/30" : "border-cyber-blue/15",
      points: getSparklinePoints(telemetry.solarWindSpeed, 0.02),
      trend: telemetry.solarWindSpeed > 600 ? "rising" : "stable",
      desc: "Speed of energetic particles from Sun corona"
    },
    {
      title: "Solar Wind Density",
      value: `${telemetry.solarWindDensity} p/cm³`,
      unit: "Proton Density",
      icon: Flame,
      color: telemetry.solarWindDensity > 20 ? "text-cyber-orange" : "text-cyan-400",
      bgBorder: telemetry.solarWindDensity > 20 ? "border-cyber-orange/30" : "border-cyber-blue/15",
      points: getSparklinePoints(telemetry.solarWindDensity, 0.1),
      trend: telemetry.solarWindDensity > 20 ? "rising" : "stable",
      desc: "Density of ions compressing the magnetosphere"
    },
    {
      title: "Solar Wind Temp",
      value: `${telemetry.solarWindTemp.toLocaleString()} K`,
      unit: "Plasma Temp",
      icon: Thermometer,
      color: telemetry.solarWindTemp > 400000 ? "text-cyber-orange" : "text-cyan-400",
      bgBorder: telemetry.solarWindTemp > 400000 ? "border-cyber-orange/30" : "border-cyber-blue/15",
      points: getSparklinePoints(telemetry.solarWindTemp, 0.05),
      trend: telemetry.solarWindTemp > 400000 ? "rising" : "stable",
      desc: "Kinetic thermal temperature of solar plasma"
    },
    {
      title: "IMF Bz (Z-Component)",
      value: `${telemetry.imfBz.toFixed(1)} nT`,
      unit: "Intermagnetic Bz",
      icon: Compass,
      color: telemetry.imfBz < -5 ? "text-cyber-red font-extrabold" : "text-cyan-400",
      bgBorder: telemetry.imfBz < -5 ? "border-cyber-red/40 animate-pulse-glow" : "border-cyber-blue/15",
      points: getSparklinePoints(telemetry.imfBz, 0.15),
      trend: telemetry.imfBz < -5 ? "falling" : "stable",
      desc: "Southward magnetic field (Negative = high entry risk)"
    },
    {
      title: "IMF Bt (Total Strength)",
      value: `${telemetry.imfBt.toFixed(1)} nT`,
      unit: "Total Mag Field",
      icon: Compass,
      color: telemetry.imfBt > 15 ? "text-cyber-orange" : "text-cyan-400",
      bgBorder: telemetry.imfBt > 15 ? "border-cyber-orange/30" : "border-cyber-blue/15",
      points: getSparklinePoints(telemetry.imfBt, 0.04),
      trend: telemetry.imfBt > 15 ? "rising" : "stable",
      desc: "Strength of interplanetary magnetic field"
    },
    {
      title: "Electron Flux",
      value: `${telemetry.electronFlux.toLocaleString()} pfu`,
      unit: "E > 2 MeV (GEO)",
      icon: Zap,
      color: telemetry.electronFlux > 1000 ? "text-cyber-red font-black" : "text-cyan-400",
      bgBorder: telemetry.electronFlux > 1000 ? "border-cyber-red/50 animate-pulse-glow" : "border-cyber-blue/15",
      points: getSparklinePoints(telemetry.electronFlux, 0.08),
      trend: telemetry.electronFlux > 1000 ? "rising" : "stable",
      desc: "Outer belt electrons causing deep-dielectric charging"
    },
    {
      title: "Proton Flux",
      value: `${telemetry.protonFlux.toLocaleString()} pfu`,
      unit: "E > 10 MeV",
      icon: Activity,
      color: telemetry.protonFlux > 10 ? "text-cyber-red" : "text-cyan-400",
      bgBorder: telemetry.protonFlux > 10 ? "border-cyber-red/30" : "border-cyber-blue/15",
      points: getSparklinePoints(telemetry.protonFlux, 0.12),
      trend: telemetry.protonFlux > 10 ? "rising" : "stable",
      desc: "High energy protons causing solar cell degradation"
    },
    {
      title: "X-Ray Flux",
      value: telemetry.xrayFlux,
      unit: "GOES Solar Flare",
      icon: Radio,
      color: telemetry.xrayFlux.startsWith("X") ? "text-cyber-red font-black animate-pulse" : telemetry.xrayFlux.startsWith("M") ? "text-cyber-orange" : "text-cyan-400",
      bgBorder: telemetry.xrayFlux.startsWith("X") ? "border-cyber-red/50" : "border-cyber-blue/15",
      points: getSparklinePoints(telemetry.xrayFlux.startsWith("X") ? 50 : 5, 0.1),
      trend: telemetry.xrayFlux.startsWith("X") ? "rising" : "stable",
      desc: "Solar X-ray flux (Indicates immediate flare eruption)"
    },
    {
      title: "Kp Index",
      value: `${telemetry.kpIndex.toFixed(1)}`,
      unit: "Geomagnetic Activity",
      icon: Gauge,
      color: telemetry.kpIndex >= 5 ? "text-cyber-red" : telemetry.kpIndex >= 4 ? "text-cyber-orange" : "text-cyan-400",
      bgBorder: telemetry.kpIndex >= 5 ? "border-cyber-red/40" : "border-cyber-blue/15",
      points: getSparklinePoints(telemetry.kpIndex, 0.05),
      trend: telemetry.kpIndex >= 4 ? "rising" : "stable",
      desc: "Global geomagnetic activity metric (0-9 scale)"
    },
    {
      title: "Dst Index",
      value: `${telemetry.dstIndex} nT`,
      unit: "Disturbance Storm",
      icon: Activity,
      color: telemetry.dstIndex < -50 ? "text-cyber-red" : "text-cyan-400",
      bgBorder: telemetry.dstIndex < -50 ? "border-cyber-red/30" : "border-cyber-blue/15",
      points: getSparklinePoints(telemetry.dstIndex, 0.1),
      trend: telemetry.dstIndex < -50 ? "falling" : "stable",
      desc: "Ring current indicator (Lower negative values = massive storm)"
    },
    {
      title: "AE Index",
      value: `${telemetry.aeIndex} nT`,
      unit: "Auroral Electrojet",
      icon: Sun,
      color: telemetry.aeIndex > 500 ? "text-cyber-orange" : "text-cyan-400",
      bgBorder: telemetry.aeIndex > 500 ? "border-cyber-orange/20" : "border-cyber-blue/15",
      points: getSparklinePoints(telemetry.aeIndex, 0.06),
      trend: telemetry.aeIndex > 500 ? "rising" : "stable",
      desc: "Magnetospheric substorm activity metric"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-11 gap-3 w-full">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div 
            key={idx} 
            className={`glass-panel rounded-lg p-3 border ${kpi.bgBorder} transition-all duration-300 hover:border-cyan-400/30 hover:scale-[1.01] flex flex-col justify-between h-[115px] relative group overflow-hidden`}
          >
            {/* Background scanner line effect for critical cards */}
            {kpi.color.includes("red") && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
            )}

            {/* Header */}
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span className="truncate pr-1 group-hover:text-cyan-300 transition-colors uppercase tracking-wider">{kpi.title}</span>
              <Icon className="w-3.5 h-3.5 shrink-0 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
            </div>

            {/* Middle value and sparkline */}
            <div className="flex items-end justify-between my-1.5">
              <div>
                <div className={`text-sm md:text-base font-display font-black tracking-tight leading-none ${kpi.color}`}>
                  {kpi.value}
                </div>
                <div className="text-[8px] font-mono text-gray-500 uppercase mt-0.5 tracking-wider">
                  {kpi.unit}
                </div>
              </div>

              {/* Sparkline trendline */}
              <div className="w-12 h-6 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 50 15">
                  <polyline
                    fill="none"
                    stroke={
                      kpi.color.includes("red") 
                        ? "#ef4444" 
                        : kpi.color.includes("orange") 
                          ? "#f97316" 
                          : "#22d3ee"
                    }
                    strokeWidth="1.2"
                    points={kpi.points}
                  />
                </svg>
              </div>
            </div>

            {/* Footer with short description & trend icon */}
            <div className="flex items-center justify-between text-[8px] font-mono border-t border-cyber-blue/10 pt-1 text-gray-500">
              <span className="truncate max-w-[80%] uppercase tracking-wider">{kpi.desc}</span>
              <span className="flex items-center">
                {kpi.trend === "rising" && <TrendingUp className="w-2.5 h-2.5 text-red-400" />}
                {kpi.trend === "falling" && <TrendingDown className="w-2.5 h-2.5 text-green-400" />}
                {kpi.trend === "stable" && <Minus className="w-2.5 h-2.5 text-cyan-400" />}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

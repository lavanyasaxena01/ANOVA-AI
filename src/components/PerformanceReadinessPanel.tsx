import React from "react";
import { ModelMetrics, Satellite } from "../types";
import { TFT_MODEL_METRICS } from "../data";
import { 
  CheckCircle, 
  Cpu, 
  HardDrive, 
  BarChart2, 
  ShieldCheck, 
  Zap, 
  AlertTriangle,
  Info
} from "lucide-react";

interface PerformanceReadinessPanelProps {
  isStormActive: boolean;
  satellites: Satellite[];
}

export default function PerformanceReadinessPanel({ isStormActive, satellites }: PerformanceReadinessPanelProps) {
  const metrics = TFT_MODEL_METRICS;

  // Calculate mission readiness based on satellites and storm
  // If storm is active and satellites are NOT shielded, status is Caution or Critical!
  const criticalSats = satellites.filter(s => s.radiationExposure > 5 && s.shieldingStatus !== "Reinforced");
  const unshieldedCount = satellites.filter(s => s.radiationExposure > 2 && s.shieldingStatus !== "Reinforced").length;

  let readinessStatus: "READY" | "MONITOR" | "CAUTION" | "CRITICAL" = "READY";
  let statusColor = "bg-green-500/10 text-green-400 border border-green-500/30";
  let descriptionText = "All spacecraft reporting safe radiation indices. Space Weather AI forecast shows quiescent geomagnetic conditions.";

  if (isStormActive) {
    if (criticalSats.length > 0) {
      readinessStatus = "CRITICAL";
      statusColor = "bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse";
      descriptionText = `CRITICAL EXPOSURE ON GEO SAT PLATFORMS! GSAT-24 is reporting high silicon ion loading. Immediate telecommand mitigation recommended.`;
    } else if (unshieldedCount > 0) {
      readinessStatus = "CAUTION";
      statusColor = "bg-orange-500/20 text-orange-400 border border-orange-500/40";
      descriptionText = `Elevated charging hazard detected. Automated safeguards have recommended shielding. Verify telemetry feeds.`;
    } else {
      readinessStatus = "MONITOR";
      statusColor = "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
      descriptionText = `Active radiation storm, but fleet-wide reinforced electromagnetic shields are deployed. Keep monitoring transponders.`;
    }
  }

  // Procedure Checklist based on storm active state
  const checklist = isStormActive 
    ? [
        { label: "Reinforce GSAT-24 Ka-Band Transponders", done: satellites.find(s => s.id === "gsat-24")?.shieldingStatus === "Reinforced" },
        { label: "Close INSAT-3DR Meteorological Imager thermal shutters", done: satellites.find(s => s.id === "insat-3dr")?.payloadStatus === "Safe Mode" },
        { label: "Verify NiH2 Battery Thermal Telemetry (< 25°C)", done: true },
        { label: "Uplink Yaw-Steering Solar Array Orientation Angles", done: false },
        { label: "Engage backup S-Band command transceiver codes", done: true }
      ]
    : [
        { label: "Monitor background GCR (Galactic Cosmic Rays) flux", done: true },
        { label: "Perform routine weekly model weights fine-tuning", done: true },
        { label: "Verify primary S-Band communication link states", done: true },
        { label: "Scan spacecraft housekeeping batteries", done: true },
        { label: "Verify OMNIWeb secondary solar wind feeds", done: true }
      ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
      
      {/* 1. MODEL PERFORMANCE PANEL */}
      <div className="glass-panel rounded-xl p-5 border border-cyber-blue/15 flex flex-col justify-between shadow-lg">
        <div>
          <div className="border-b border-cyber-blue/10 pb-2.5 mb-3 flex items-center gap-2">
            <Cpu className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
            <h4 className="font-display font-bold text-xs text-white uppercase tracking-widest">
              TFT FORECAST MODEL METRICS
            </h4>
          </div>

          {/* Model info banner */}
          <div className="bg-slate-950/50 p-2.5 rounded border border-cyber-blue/5 flex items-center justify-between text-[10.5px] font-mono mb-3">
            <span className="text-gray-400 font-bold">MODEL TYPE:</span>
            <span className="text-cyan-300 font-bold uppercase">{metrics.name}</span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3 text-[10.5px] font-mono">
            <div className="p-2 bg-slate-950/20 rounded border border-cyber-blue/5">
              <span className="text-gray-500 block">RMSE (Root Mean Sq Error)</span>
              <span className="text-xs font-bold text-gray-200 mt-0.5 block">{metrics.rmse}</span>
            </div>
            <div className="p-2 bg-slate-950/20 rounded border border-cyber-blue/5">
              <span className="text-gray-500 block">MAE (Mean Absolute Error)</span>
              <span className="text-xs font-bold text-gray-200 mt-0.5 block">{metrics.mae}</span>
            </div>
            <div className="p-2 bg-slate-950/20 rounded border border-cyber-blue/5">
              <span className="text-gray-500 block">MAPE Error Rate</span>
              <span className="text-xs font-bold text-cyan-300 mt-0.5 block">{metrics.mape}</span>
            </div>
            <div className="p-2 bg-slate-950/20 rounded border border-cyber-blue/5">
              <span className="text-gray-500 block">R² Coefficient (Fit)</span>
              <span className="text-xs font-bold text-cyan-300 mt-0.5 block">{metrics.r2}</span>
            </div>
          </div>

          {/* Inference specs detail */}
          <div className="bg-slate-950/30 rounded border border-cyber-blue/5 p-2.5 space-y-1.5 text-[9.5px] font-mono">
            <div className="flex justify-between">
              <span className="text-gray-500 uppercase">Training Scope:</span>
              <span className="text-gray-300 truncate max-w-[70%] text-right">{metrics.datasetSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 uppercase">Model Latency / Inference Time:</span>
              <span className="text-cyan-400">{metrics.inferenceTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 uppercase">Last Retraining Weight Update:</span>
              <span className="text-gray-300">{metrics.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Info label */}
        <div className="text-[8px] font-mono text-gray-500 mt-3 pt-2.5 border-t border-cyber-blue/5 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
          <span>Weights compiled with deep multi-headed self-attention to capture long-term temporal storm dynamics.</span>
        </div>
      </div>

      {/* 2. MISSION READINESS PANEL */}
      <div className="glass-panel rounded-xl p-5 border border-cyber-blue/15 flex flex-col justify-between shadow-lg">
        <div>
          <div className="border-b border-cyber-blue/10 pb-2.5 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-cyan-400" />
            <h4 className="font-display font-bold text-xs text-white uppercase tracking-widest">
              MISSION CONTROL READINESS BOARD
            </h4>
          </div>

          {/* Status highlight display */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-950/60 rounded-lg border border-cyber-blue/10 mb-3">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Current Readiness Index</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-display font-black tracking-widest uppercase inline-block ${statusColor}`}>
                {readinessStatus}
              </span>
            </div>
            <p className="text-[10px] text-gray-300 flex-1 sm:max-w-[70%] leading-relaxed sm:border-l sm:border-cyber-blue/10 sm:pl-3">
              {descriptionText}
            </p>
          </div>

          {/* Procedure Checklist */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
              Procedural Checklist Operations
            </span>
            <div className="space-y-1.5 text-[10px] font-mono">
              {checklist.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 p-1.5 bg-slate-950/25 rounded border border-cyber-blue/5"
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    readOnly
                    className="w-3 h-3 rounded text-cyan-400 focus:ring-cyan-500 bg-slate-900 border-gray-700 pointer-events-none shrink-0"
                  />
                  <span className={`truncate ${item.done ? "text-gray-400 line-through" : "text-gray-200"}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer warning message */}
        {isStormActive && unshieldedCount > 0 && (
          <div className="mt-3 bg-red-950/30 border border-red-500/20 rounded p-2 text-[9px] font-mono text-red-400 flex items-center gap-1.5 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>CRITICAL STEP WAITING: Deploy GSAT-24 and GSAT-31 Electromagnetic Shields immediately.</span>
          </div>
        )}
      </div>
    </div>
  );
}

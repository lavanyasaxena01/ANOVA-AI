import React, { useState } from "react";
import { SolarEvent, SatelliteImpact, Satellite } from "../types";
import { INITIAL_EVENTS, SATELLITE_IMPACTS } from "../data";
import { 
  Gauge, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertOctagon, 
  Layers, 
  Activity, 
  ShieldAlert, 
  CornerDownRight,
  Info,
  Clock,
  ExternalLink
} from "lucide-react";

interface RiskTimelinePanelProps {
  isStormActive: boolean;
  satellites: Satellite[];
  onTriggerShield: (id: string) => void;
}

export default function RiskTimelinePanel({ isStormActive, satellites, onTriggerShield }: RiskTimelinePanelProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>("ev-01");

  // Dynamic risk score based on active storm state
  // If shielding is active on major satellites, we reduce risk!
  const reinforcedCount = satellites.filter(s => s.shieldingStatus === "Reinforced").length;
  
  let riskScore = 18; // Base nominal risk
  if (isStormActive) {
    riskScore = 88 - (reinforcedCount * 12); // Pushing down risk for each boosted sat
  }

  let riskCategory: "Safe" | "Moderate" | "High" | "Extreme" = "Safe";
  let riskColor = "text-green-400";
  let gaugeColor = "#22c55e";
  let trendArrow: "Increasing" | "Stable" | "Decreasing" = "Stable";

  if (riskScore > 75) {
    riskCategory = "Extreme";
    riskColor = "text-red-500 animate-pulse";
    gaugeColor = "#ef4444";
    trendArrow = "Increasing";
  } else if (riskScore > 50) {
    riskCategory = "High";
    riskColor = "text-orange-500";
    gaugeColor = "#f97316";
    trendArrow = "Increasing";
  } else if (riskScore > 25) {
    riskCategory = "Moderate";
    riskColor = "text-yellow-400";
    gaugeColor = "#eab308";
    trendArrow = "Stable";
  } else {
    trendArrow = reinforcedCount > 0 ? "Decreasing" : "Stable";
  }

  // Circular gauge drawing variables
  const radius = 55;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  // Render events timeline
  const events = INITIAL_EVENTS;
  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
      
      {/* 1. RADIATION RISK PANEL (Circular Gauge) */}
      <div className="glass-panel rounded-xl p-5 border border-cyber-blue/15 lg:col-span-3 flex flex-col justify-between items-center text-center shadow-lg min-h-[300px]">
        <div className="w-full border-b border-cyber-blue/10 pb-2 mb-2">
          <h4 className="font-display font-bold text-xs text-white uppercase tracking-widest">
            GEO RADIATION RISK
          </h4>
          <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider">
            Consolidated Hazard Rating
          </span>
        </div>

        {/* Circular Gauge */}
        <div className="relative my-4 w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
            {/* Background track circle */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="transparent"
              stroke="rgba(148, 163, 184, 0.08)"
              strokeWidth={strokeWidth}
            />
            {/* Foreground risk track */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="transparent"
              stroke={gaugeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>

          {/* Central readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-display font-black text-white leading-none">
              {riskScore}
            </span>
            <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest mt-1">
              Rating
            </span>
          </div>
        </div>

        {/* Risk Trend Info */}
        <div className="space-y-1.5 w-full">
          <div className="flex justify-between items-center text-[10.5px] font-mono border-b border-cyber-blue/5 pb-1">
            <span className="text-gray-400">Hazard Level:</span>
            <span className={`font-bold uppercase tracking-wider ${riskColor}`}>
              {riskCategory}
            </span>
          </div>

          <div className="flex justify-between items-center text-[10.5px] font-mono">
            <span className="text-gray-400">Trend Path:</span>
            <span className="font-bold text-gray-200 flex items-center gap-1">
              {trendArrow === "Increasing" && <TrendingUp className="w-3.5 h-3.5 text-red-400" />}
              {trendArrow === "Decreasing" && <TrendingDown className="w-3.5 h-3.5 text-green-400 animate-bounce" />}
              {trendArrow === "Stable" && <Minus className="w-3.5 h-3.5 text-cyan-400" />}
              {trendArrow}
            </span>
          </div>
        </div>
      </div>

      {/* 2. SPACE WEATHER TIMELINE (Interactive steps) */}
      <div className="glass-panel rounded-xl p-5 border border-cyber-blue/15 lg:col-span-5 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex items-center justify-between border-b border-cyber-blue/10 pb-2 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-cyan-400" />
              <h4 className="font-display font-bold text-xs text-white uppercase tracking-widest">
                WEATHER EVENT TIMELINE
              </h4>
            </div>
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">
              Last 24h & Predicted Next 12h
            </span>
          </div>

          {/* Chronological Step Track */}
          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {events.map((evt) => {
              const isSelected = evt.id === selectedEventId;
              let evtColor = "border-cyan-500/20 text-cyan-400 bg-slate-950/40";
              if (evt.type === "Solar Flare" || evt.type === "CME") {
                evtColor = isSelected 
                  ? "border-red-500 bg-red-950/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]" 
                  : "border-red-500/20 text-red-400 hover:bg-red-950/5";
              } else {
                evtColor = isSelected 
                  ? "border-cyan-400 bg-cyan-950/20 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.1)]" 
                  : "border-cyan-500/20 text-cyan-400 hover:bg-cyan-950/5";
              }

              return (
                <button
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`p-2 rounded border text-left flex flex-col justify-between h-[75px] transition-all cursor-pointer ${evtColor}`}
                >
                  <span className="text-[8px] font-mono text-gray-500 uppercase block leading-none">
                    {evt.timestamp}
                  </span>
                  <div>
                    <span className="text-[10px] font-display font-bold block truncate leading-none mt-1">
                      {evt.type}
                    </span>
                    <span className="text-[9px] font-mono text-gray-300 font-extrabold block mt-1 leading-none">
                      {evt.magnitude}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Event Details Card */}
          <div className="bg-slate-950/80 rounded-lg p-3 border border-cyber-blue/10 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-white uppercase">
                {activeEvent.type} Detail Analysis
              </span>
              <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold ${
                activeEvent.status === "Active" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
              }`}>
                {activeEvent.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono leading-relaxed">
              <div>
                <span className="text-gray-500 block">Magnitude Rating:</span>
                <span className="text-gray-200 font-bold">{activeEvent.magnitude}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Duration / Schedule:</span>
                <span className="text-gray-200">{activeEvent.duration}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Occurrence Prob:</span>
                <span className="text-cyan-400 font-bold">{activeEvent.probability}%</span>
              </div>
              <div>
                <span className="text-gray-500 block">Potential Sat Impact:</span>
                <span className="text-red-400 font-semibold">{activeEvent.impactScore}/100</span>
              </div>
            </div>

            {/* Affected Fleets list */}
            <div className="border-t border-cyber-blue/5 pt-2 flex flex-wrap items-center gap-1.5 text-[9.5px] font-mono">
              <span className="text-gray-500">AFFECTED ORBITS:</span>
              {activeEvent.affectedSats.map((s, idx) => (
                <span key={idx} className="bg-slate-900 px-1.5 py-0.5 rounded border border-cyber-blue/5 text-cyan-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Event notification feed */}
        <div className="mt-3 text-[9px] text-gray-500 font-mono leading-relaxed flex items-center gap-1">
          <Clock className="w-3 h-3 text-cyan-500 shrink-0" />
          <span>Timeline synchronized with NOAA GOES-16 space-weather telemetry.</span>
        </div>
      </div>

      {/* 3. SATELLITE IMPACT PANEL (Grid list) */}
      <div className="glass-panel rounded-xl p-5 border border-cyber-blue/15 lg:col-span-4 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex items-center justify-between border-b border-cyber-blue/10 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-cyber-orange" />
              <h4 className="font-display font-bold text-xs text-white uppercase tracking-widest">
                SATELLITE IMPACT LOG
              </h4>
            </div>
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">
              Risk Mitigation Support
            </span>
          </div>

          {/* List of affected Satellites */}
          <div className="space-y-2 max-h-[190px] overflow-y-auto pr-0.5">
            {SATELLITE_IMPACTS.map((sat, idx) => {
              // Get current live shielding state from the actual satellites prop
              const currentSatState = satellites.find(s => s.id === sat.satelliteId);
              const isReinforced = currentSatState?.shieldingStatus === "Reinforced";
              const isSafeMode = currentSatState?.payloadStatus === "Safe Mode";

              return (
                <div 
                  key={idx} 
                  className="p-2.5 rounded-md bg-slate-950/60 border border-cyber-blue/5 flex flex-col space-y-1 text-[10px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-white text-[10.5px]">
                      {sat.name}
                    </span>
                    <span className={`px-1 rounded text-[8.5px] font-mono font-bold ${
                      sat.priority === "Critical" 
                        ? "bg-red-500/15 text-red-400 border border-red-500/20 animate-pulse" 
                        : "bg-orange-500/15 text-orange-400"
                    }`}>
                      {sat.priority}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 text-[9px] font-mono text-gray-400 gap-y-0.5 leading-none pt-1">
                    <span>Peak Arrival:</span>
                    <span className="text-gray-200 text-right">{isStormActive ? "IN PROGRESS" : sat.expectedArrival}</span>

                    <span>Dose rate:</span>
                    <span className="text-red-400 text-right">
                      {isReinforced 
                        ? `${(parseFloat(sat.estimatedExposure) / 2).toFixed(1)} rad/hr (Shielded)`
                        : sat.estimatedExposure
                      }
                    </span>
                  </div>

                  {/* Operational directive support action */}
                  <div className="pt-1.5 flex justify-between items-center text-[8px] border-t border-cyber-blue/5 mt-1">
                    <span className="text-gray-500 truncate max-w-[65%] uppercase tracking-wider">
                      {isReinforced 
                        ? "SHIELD REINFORCED" 
                        : isSafeMode 
                          ? "SAFE STANDBY ACTIVATED"
                          : sat.suggestedAction
                      }
                    </span>
                    
                    {!isReinforced && !isSafeMode && (
                      <button 
                        onClick={() => onTriggerShield(sat.satelliteId)}
                        className="text-cyan-400 font-bold hover:underline uppercase"
                      >
                        Reinforce
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational disclaimer note */}
        <div className="text-[8px] font-mono text-gray-500 leading-normal border-t border-cyber-blue/5 pt-2">
          Suggested action protocols generated through ANOVA's automated telemetry rules-engine. Action execution triggers RF telecommand sequence.
        </div>
      </div>
    </div>
  );
}

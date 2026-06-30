import React from "react";
import { Satellite } from "../types";
import { 
  ShieldAlert, 
  Satellite as SatIcon, 
  Battery, 
  Wifi, 
  Tv, 
  MapPin, 
  Activity,
  Heart,
  CornerDownRight,
  ShieldAlert as BoostIcon,
  ZapOff
} from "lucide-react";

interface SatelliteInfoCardProps {
  satellites: Satellite[];
  selectedSatelliteId: string;
  setSelectedSatelliteId: (id: string) => void;
  onToggleShield: (id: string) => void;
  onTogglePayload: (id: string) => void;
}

export default function SatelliteInfoCard({
  satellites,
  selectedSatelliteId,
  setSelectedSatelliteId,
  onToggleShield,
  onTogglePayload,
}: SatelliteInfoCardProps) {
  
  const activeSat = satellites.find((s) => s.id === selectedSatelliteId) || satellites[0];

  return (
    <div className="glass-panel rounded-xl p-5 border border-cyber-blue/15 flex flex-col h-full shadow-lg">
      
      {/* Selector tab header */}
      <div className="border-b border-cyber-blue/10 pb-4 mb-4">
        <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest block mb-2 font-bold">
          Active Spacecraft Selector
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {satellites.map((sat) => (
            <button
              key={sat.id}
              onClick={() => setSelectedSatelliteId(sat.id)}
              className={`py-2 rounded font-display text-[10px] font-black transition-all ${
                sat.id === selectedSatelliteId
                  ? "bg-gradient-to-r from-cyan-600 to-cyber-teal text-white shadow-md shadow-cyan-600/15"
                  : "bg-slate-950/40 text-gray-400 hover:text-white border border-cyber-blue/5"
              }`}
            >
              {sat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main satellite detail display */}
      <div className="flex-1 space-y-4">
        {/* Core name & position summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SatIcon className="w-5 h-5 text-cyan-400" />
            <div>
              <h4 className="font-display font-bold text-base text-white">{activeSat.name}</h4>
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">GEO Satellite Platform</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/10">
              <MapPin className="w-3 h-3" />
              {activeSat.longitude}
            </span>
          </div>
        </div>

        {/* Detailed Specs list */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Health Gauge */}
          <div className="bg-slate-950/50 p-2.5 rounded border border-cyber-blue/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Health Index</span>
              <span className="text-xs font-display font-bold text-white block">{activeSat.health}%</span>
            </div>
            <Heart className={`w-4 h-4 ${activeSat.health > 90 ? "text-green-400 animate-pulse" : "text-orange-400"}`} />
          </div>

          {/* Battery level */}
          <div className="bg-slate-950/50 p-2.5 rounded border border-cyber-blue/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Battery State</span>
              <span className="text-xs font-display font-bold text-white block">{activeSat.battery}%</span>
            </div>
            <Battery className={`w-4 h-4 ${activeSat.battery > 50 ? "text-cyan-400" : "text-yellow-400 animate-bounce"}`} />
          </div>

          {/* Uplink status */}
          <div className="bg-slate-950/50 p-2.5 rounded border border-cyber-blue/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">RF Uplink</span>
              <span className="text-xs font-display font-bold text-white block">{activeSat.uplinkStatus}</span>
            </div>
            <Wifi className="w-4 h-4 text-green-400" />
          </div>

          {/* Payload state */}
          <div className="bg-slate-950/50 p-2.5 rounded border border-cyber-blue/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Transponders</span>
              <span className="text-xs font-display font-bold text-white block">{activeSat.payloadStatus}</span>
            </div>
            <Tv className={`w-4 h-4 ${activeSat.payloadStatus === "Active" ? "text-cyan-400 animate-pulse" : "text-gray-500"}`} />
          </div>
        </div>

        {/* Localized exposure indicator */}
        <div className="p-3 bg-slate-950/70 rounded-lg border border-cyber-blue/10 flex items-center justify-between relative overflow-hidden">
          {activeSat.radiationExposure > 5 && (
            <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
          )}
          <div className="space-y-1 z-10">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Local Silicon Exposure Rate</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl font-display font-black leading-none ${activeSat.radiationExposure > 5 ? "text-red-400" : "text-cyan-400"}`}>
                {activeSat.radiationExposure.toFixed(2)}
              </span>
              <span className="text-[9px] font-mono text-gray-400">rads / hr</span>
            </div>
          </div>

          <div className="text-right z-10">
            <span className="text-[9px] font-mono text-gray-500 block">Shielding Mode</span>
            <span className={`text-[10.5px] font-display font-bold block ${
              activeSat.shieldingStatus === "Reinforced" ? "text-cyan-300 animate-pulse" : "text-gray-300"
            }`}>
              {activeSat.shieldingStatus}
            </span>
          </div>
        </div>

        {/* Footprint / Antenna Details for aerospace realism */}
        <div className="bg-slate-950/30 rounded border border-cyber-blue/5 p-3 space-y-2 text-[10px] font-mono">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 uppercase">Coverage Footprint:</span>
            <span className="text-gray-300">{activeSat.footprint}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 uppercase">Antenna Polarization:</span>
            <span className="text-gray-300">{activeSat.polarization}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 uppercase">EIRP Strength (Main Beam):</span>
            <span className="text-gray-300">{activeSat.eirp}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 uppercase">G/T Sensitivity:</span>
            <span className="text-cyan-400">{activeSat.gOverT}</span>
          </div>
        </div>
      </div>

      {/* Decision-Support Override command actions */}
      <div className="mt-4 pt-4 border-t border-cyber-blue/10 space-y-2">
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-2">
          Payload Directive Overrides
        </span>

        <div className="grid grid-cols-2 gap-2">
          {/* Toggle Shield Booster */}
          <button
            onClick={() => onToggleShield(activeSat.id)}
            className={`py-2 px-2 rounded font-display text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 border ${
              activeSat.shieldingStatus === "Reinforced"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/40"
                : "bg-slate-950 text-gray-300 border-cyber-blue/20 hover:bg-slate-900"
            }`}
          >
            <BoostIcon className="w-3.5 h-3.5" />
            <span>{activeSat.shieldingStatus === "Reinforced" ? "Shield Booster: Active" : "Reinforce Shielding"}</span>
          </button>

          {/* Toggle Safe Standby Mode */}
          <button
            onClick={() => onTogglePayload(activeSat.id)}
            className={`py-2 px-2 rounded font-display text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 border ${
              activeSat.payloadStatus === "Safe Mode"
                ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                : "bg-slate-950 text-gray-300 border-cyber-blue/20 hover:bg-slate-900"
            }`}
          >
            <ZapOff className="w-3.5 h-3.5" />
            <span>{activeSat.payloadStatus === "Safe Mode" ? "Payload Safe: Mode On" : "Trigger Safe Mode"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

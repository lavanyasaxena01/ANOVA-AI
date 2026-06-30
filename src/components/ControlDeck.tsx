import React from "react";
import { 
  Zap, 
  RefreshCw, 
  Sliders, 
  Cpu, 
  VolumeX, 
  Volume2, 
  ShieldAlert,
  HelpCircle,
  Play,
  Pause
} from "lucide-react";

interface ControlDeckProps {
  isStormActive: boolean;
  onInjectStorm: (active: boolean) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  onMitigateAll: () => void;
}

export default function ControlDeck({
  isStormActive,
  onInjectStorm,
  simulationSpeed,
  setSimulationSpeed,
  isSimulating,
  setIsSimulating,
  onMitigateAll
}: ControlDeckProps) {
  
  return (
    <div className="glass-panel-accent rounded-xl p-5 border border-cyan-400/40 flex flex-col h-full shadow-2xl relative overflow-hidden">
      
      {/* Background design elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-300 animate-spin" style={{ animationDuration: "10s" }} />
          <div>
            <h3 className="font-display font-black text-sm text-cyan-200 tracking-widest uppercase">
              ANOVA HYPER-SIMULATOR DECK
            </h3>
            <p className="text-[10px] font-mono text-cyan-400 mt-0.5 uppercase tracking-wider">
              Hackathon presentation incident injector
            </p>
          </div>
        </div>
        <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider">
          Interactive Node
        </span>
      </div>

      {/* Quick explanation banner for hackathon presentation */}
      <div className="bg-slate-950/90 border border-cyan-500/15 p-3 rounded-lg text-[10.5px] text-gray-300 leading-relaxed mb-4">
        <span className="font-display font-bold text-cyan-400 block mb-0.5 uppercase tracking-wider">HACKATHON MODE ACTIVE</span>
        Use these controls to instantly inject space weather anomalies and demonstrate ANOVA AI's real-time AI forecasting, SHAP explainability shift, and decision-support safeguards.
      </div>

      {/* Incident Injector Trigger Buttons */}
      <div className="space-y-4 flex-1">
        
        {/* Core Trigger Row */}
        <div>
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-2 font-bold">
            Solar Event Injection Vectors
          </span>
          <div className="grid grid-cols-2 gap-2">
            
            {/* Inject Storm */}
            <button
              onClick={() => onInjectStorm(true)}
              className={`py-3 px-3 rounded-lg font-display text-xs font-black transition-all flex flex-col items-center gap-1.5 border relative overflow-hidden ${
                isStormActive
                  ? "bg-red-950/40 text-red-400 border-red-500/50 shadow-md shadow-red-500/10"
                  : "bg-slate-950 text-gray-400 border-red-500/20 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5"
              }`}
            >
              <Zap className={`w-5 h-5 ${isStormActive ? "text-red-400 animate-bounce" : "text-gray-500"}`} />
              <span className="uppercase tracking-wider">Inject X2.4 Flare</span>
              {isStormActive && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>

            {/* Reset to Nominal */}
            <button
              onClick={() => onInjectStorm(false)}
              className={`py-3 px-3 rounded-lg font-display text-xs font-black transition-all flex flex-col items-center gap-1.5 border ${
                !isStormActive
                  ? "bg-green-950/40 text-green-400 border-green-500/40"
                  : "bg-slate-950 text-gray-400 border-green-500/20 hover:border-green-500/50 hover:text-green-400 hover:bg-green-500/5"
              }`}
            >
              <RefreshCw className={`w-5 h-5 ${!isStormActive ? "text-green-400" : "text-gray-500 animate-spin"}`} />
              <span className="uppercase tracking-wider">Reset Telemetry</span>
            </button>
          </div>
        </div>

        {/* Real-Time Live Feed Simulation Controls */}
        <div className="bg-slate-950/40 p-3.5 rounded-lg border border-cyan-500/10 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-mono text-gray-400 uppercase tracking-widest font-semibold">
              Live Feed Simulation
            </span>
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
              isSimulating ? "bg-cyan-500/10 text-cyan-300" : "bg-gray-500/10 text-gray-400"
            }`}>
              {isSimulating ? "Streaming" : "Paused"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Play / Pause Toggle */}
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`p-2 rounded-md border flex items-center justify-center transition-all ${
                isSimulating 
                  ? "bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400" 
                  : "bg-slate-950 text-cyan-400 border-cyan-500/30 hover:bg-slate-900"
              }`}
            >
              {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 animate-pulse" />}
            </button>

            {/* Simulation Speed Slider */}
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-[9px] font-mono text-gray-500">
                <span>Update Speed</span>
                <span className="text-cyan-400">{simulationSpeed}s / tick</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-850 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Quick Decision Action button */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onMitigateAll}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-cyber-teal rounded-lg font-display text-xs font-black text-white hover:from-cyan-500 hover:to-teal-500 transition-all shadow-md shadow-cyan-600/20 hover:shadow-cyan-500/35 flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4.5 h-4.5 text-white animate-bounce" />
            <span className="uppercase tracking-widest">Send Fleet Mitigation Uplink</span>
          </button>
          <p className="text-[8.5px] font-mono text-gray-500 text-center leading-normal">
            Triggers manual electromagnetic boosters for all active payloads, cutting radiation storm exposure risk by 50% immediately.
          </p>
        </div>
      </div>

      {/* Footer System Health stats */}
      <div className="mt-4 pt-3.5 border-t border-cyan-500/20 flex items-center justify-between text-[9px] font-mono text-cyan-500">
        <span>SIMULATOR VER: 4.2.1-PRO</span>
        <span>GATEWAY: CONNECTED</span>
      </div>
    </div>
  );
}

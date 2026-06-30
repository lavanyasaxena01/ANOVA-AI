import React, { useState, useEffect } from "react";
import { 
  INITIAL_SATELLITES, 
  NOMINAL_TELEMETRY, 
  STORM_TELEMETRY,
  INITIAL_ALERTS
} from "./data";
import { Satellite, SpaceTelemetry, Alert } from "./types";

// Component imports
import DashboardSidebar from "./components/DashboardSidebar";
import SpaceVisualizer from "./components/SpaceVisualizer";
import SpaceWeatherPanel from "./components/SpaceWeatherPanel";
import ForecastPanel from "./components/ForecastPanel";
import ExplainableAIPanel from "./components/ExplainableAIPanel";
import RiskTimelinePanel from "./components/RiskTimelinePanel";
import PerformanceReadinessPanel from "./components/PerformanceReadinessPanel";
import HistoricalAnalyticsPanel from "./components/HistoricalAnalyticsPanel";
import AlertCenter from "./components/AlertCenter";
import SatelliteInfoCard from "./components/SatelliteInfoCard";
import ControlDeck from "./components/ControlDeck";

// Lucide Icons
import { 
  Bell, 
  User, 
  Cpu, 
  Radio, 
  Clock, 
  AlertOctagon, 
  Database, 
  FileText, 
  HelpCircle,
  Minimize2,
  Maximize2
} from "lucide-react";

export default function App() {
  // 1. Core State
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isStormActive, setIsStormActive] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(3); // seconds per update
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [selectedSatelliteId, setSelectedSatelliteId] = useState<string>("gsat-24");
  const [satellites, setSatellites] = useState<Satellite[]>(INITIAL_SATELLITES);
  const [telemetry, setTelemetry] = useState<SpaceTelemetry>(NOMINAL_TELEMETRY);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [showControlDeck, setShowControlDeck] = useState<boolean>(true);
  
  // Real-time ticking Clock
  const [currentTimeUTC, setCurrentTimeUTC] = useState<string>("");

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as "HH:MM:SS UTC"
      const hours = now.getUTCHours().toString().padStart(2, "0");
      const mins = now.getUTCMinutes().toString().padStart(2, "0");
      const secs = now.getUTCSeconds().toString().padStart(2, "0");
      const day = now.getUTCDate();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthStr = months[now.getUTCMonth()];
      const year = now.getUTCFullYear();
      
      setCurrentTimeUTC(`${hours}:${mins}:${secs} UTC // ${day} ${monthStr} ${year}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Solar Storm Injection and Reset Core Handler
  const handleInjectStorm = (active: boolean) => {
    setIsStormActive(active);
    
    // Switch telemetry background instantly
    if (active) {
      setTelemetry(STORM_TELEMETRY);
      
      // Inflate satellite radiation exposures
      setSatellites((prev) => 
        prev.map((sat) => {
          let multiplier = 5.5;
          if (sat.id === "gsat-24") multiplier = 7.4; // GSAT-24 is central target
          if (sat.id === "insat-3dr") multiplier = 5.8;
          
          return {
            ...sat,
            radiationExposure: parseFloat((sat.radiationExposure * multiplier).toFixed(2)),
            health: Math.max(88, sat.health - 5) // Slightly drop health to simulate ion degradation
          };
        })
      );

      // Inject new critical alerts
      const stormAlert: Alert = {
        id: `al-${Date.now()}`,
        severity: "critical",
        title: "X-Class Solar Flare Intercept",
        message: "High-energy proton coronal storm front enveloping GEOSYNCHRONOUS orbital plane. Local shielding buckling on GSAT-24.",
        timestamp: "12:02 UTC",
        satellite: "GSAT-24",
        mitigation: "Deploy electromagnetic deflectors on central bus instantly."
      };
      setAlerts((prev) => [stormAlert, ...prev]);
    } else {
      // Return to base nominal rates
      setTelemetry(NOMINAL_TELEMETRY);
      setSatellites(INITIAL_SATELLITES);
      setAlerts(INITIAL_ALERTS);
    }
  };

  // 3. Local Satellite Mitigation Handlers
  const handleToggleShield = (satId: string) => {
    setSatellites((prev) =>
      prev.map((sat) => {
        if (sat.id === satId) {
          const isReinforced = sat.shieldingStatus === "Reinforced";
          const nextStatus = isReinforced ? "Nominal" : "Reinforced";
          
          // Cut exposure by half when shielding is reinforced!
          const nextExposure = isReinforced 
            ? sat.radiationExposure * 2 
            : sat.radiationExposure * 0.5;

          return {
            ...sat,
            shieldingStatus: nextStatus as "Nominal" | "Reinforced",
            radiationExposure: parseFloat(nextExposure.toFixed(2)),
            // Slight boost to battery or health due to shield alignment
            health: Math.min(100, sat.health + (isReinforced ? 0 : 2))
          };
        }
        return sat;
      })
    );
  };

  const handleTogglePayloadStatus = (satId: string) => {
    setSatellites((prev) =>
      prev.map((sat) => {
        if (sat.id === satId) {
          const isSafe = sat.payloadStatus === "Safe Mode";
          const nextStatus = isSafe ? "Active" : "Safe Mode";
          
          // Dropping payload exposure because critical imaging sensors are stowed/shutdown!
          const nextExposure = isSafe 
            ? sat.radiationExposure * 1.5
            : sat.radiationExposure * 0.4;

          return {
            ...sat,
            payloadStatus: nextStatus as "Active" | "Safe Mode",
            radiationExposure: parseFloat(nextExposure.toFixed(2)),
            battery: Math.min(100, sat.battery + (isSafe ? 0 : 5)) // save battery
          };
        }
        return sat;
      })
    );
  };

  // Mitigation sweep for entire fleet
  const handleMitigateAllFleet = () => {
    setSatellites((prev) =>
      prev.map((sat) => ({
        ...sat,
        shieldingStatus: "Reinforced" as const,
        radiationExposure: parseFloat((sat.radiationExposure * 0.5).toFixed(2)),
        health: Math.min(100, sat.health + 2)
      }))
    );
    
    // Resolve all critical alerts in logs
    setAlerts((prev) => 
      prev.map(alert => ({
        ...alert,
        message: `${alert.message} (FLEET MITIGATION SENT)`
      }))
    );
  };

  // Mitigate single alert from listing
  const handleMitigateAlert = (alertId: string) => {
    const targetAlert = alerts.find(a => a.id === alertId);
    if (targetAlert) {
      // Apply mitigation to the satellite referenced
      const targetSat = satellites.find(s => s.name === targetAlert.satellite || s.id === targetAlert.satellite.toLowerCase());
      if (targetSat) {
        handleToggleShield(targetSat.id);
      } else {
        // Fallback: Reinforce GSAT-24
        handleToggleShield("gsat-24");
      }
    }
  };

  // 4. Telemetry micro-fluctuations timer loop (Simulating live streaming feeds)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        // Random drift factors
        const windDrift = (Math.random() - 0.5) * 4;
        const densityDrift = (Math.random() - 0.5) * 0.3;
        const tempDrift = (Math.random() - 0.5) * 1500;
        
        return {
          ...prev,
          solarWindSpeed: Math.round(prev.solarWindSpeed + windDrift),
          solarWindDensity: parseFloat(Math.max(0.1, prev.solarWindDensity + densityDrift).toFixed(2)),
          solarWindTemp: Math.round(Math.max(10000, prev.solarWindTemp + tempDrift)),
          electronFlux: Math.round(Math.max(10, prev.electronFlux + (Math.random() - 0.5) * (isStormActive ? 40 : 2)))
        };
      });

      // Slowly drift radiation numbers on satellites slightly
      setSatellites((prev) =>
        prev.map((sat) => {
          const drift = (Math.random() - 0.5) * (isStormActive ? 0.35 : 0.05);
          return {
            ...sat,
            radiationExposure: parseFloat(Math.max(0.01, sat.radiationExposure + drift).toFixed(2)),
            battery: Math.max(40, Math.min(100, sat.battery + (Math.random() > 0.85 ? -1 : 0)))
          };
        })
      );
    }, simulationSpeed * 1000);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, isStormActive]);

  // Dynamic system status assessment
  let systemStatus: "NOMINAL" | "WARNING" | "CRITICAL" = "NOMINAL";
  if (isStormActive) {
    const highExposureSats = satellites.filter(s => s.radiationExposure > 5 && s.shieldingStatus !== "Reinforced");
    systemStatus = highExposureSats.length > 0 ? "CRITICAL" : "WARNING";
  }

  return (
    <div className="min-h-screen bg-[#020510] text-gray-100 flex flex-col font-sans scanlines">
      
      {/* 1. TOP BAR */}
      <header className="h-16 bg-[#030712]/95 border-b border-cyber-blue/15 px-6 flex items-center justify-between z-30 shrink-0 sticky top-0 backdrop-blur-md">
        
        {/* Logo and metadata label */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Pulsing beacon node */}
            <div className={`w-3.5 h-3.5 rounded-full ${
              systemStatus === "NOMINAL" 
                ? "bg-green-500 shadow-[0_0_10px_#22c55e]" 
                : systemStatus === "WARNING"
                  ? "bg-orange-500 shadow-[0_0_10px_#f97316] animate-pulse"
                  : "bg-red-500 shadow-[0_0_15px_#ef4444] animate-ping"
            }`} />
            <h1 className="font-display font-black text-lg text-white tracking-widest flex items-center gap-2">
              <span>ANOVA AI</span>
              <span className="text-gray-500 font-light text-sm">|</span>
              <span className="text-cyan-400 font-mono text-xs tracking-normal font-bold">ISRO BAH 2026</span>
            </h1>
          </div>
          
          <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono border-l border-cyber-blue/15 pl-4 py-1">
            <span className="text-gray-500">SYSTEM:</span>
            <span className="text-green-400 font-bold uppercase">SECURE NETWORK</span>
            
            <span className="text-gray-500 ml-2">AI CORE:</span>
            <span className="text-cyan-400 font-bold animate-pulse">ACTIVE (TFT)</span>
          </div>
        </div>

        {/* Center Horizonal Status Bar */}
        <div className="hidden md:flex items-center gap-4 bg-slate-950/80 px-4 py-1.5 rounded-lg border border-cyber-blue/10 text-[10.5px] font-mono">
          <span className="text-gray-500 uppercase">Live UTC Tracker:</span>
          <span className="text-cyan-300 font-bold font-mono tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-500 shrink-0 animate-spin" style={{ animationDuration: "12s" }} />
            {currentTimeUTC || "FETCHING UTC..."}
          </span>
        </div>

        {/* Right side status indicators, icons and profile */}
        <div className="flex items-center gap-4">
          
          {/* Active Status Display Badge */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded border font-mono text-[10px] font-bold ${
            systemStatus === "NOMINAL"
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : systemStatus === "WARNING"
                ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                : "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse"
          }`}>
            <span>STATUS:</span>
            <span>{systemStatus}</span>
          </div>

          {/* Quick Notification indicator */}
          <button 
            onClick={() => setActiveTab("alerts")}
            className="p-1.5 rounded-md bg-slate-900 border border-cyber-blue/10 hover:border-cyan-400/40 text-gray-400 hover:text-white relative transition-all"
          >
            <Bell className="w-4.5 h-4.5" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-950 animate-ping" />
            )}
          </button>

          {/* Scientific Officer profile */}
          <div className="flex items-center gap-2.5 border-l border-cyber-blue/15 pl-4">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-cyan-500/20 flex items-center justify-center font-mono text-[11.5px] text-cyan-400 font-bold overflow-hidden relative">
              <User className="w-4.5 h-4.5 text-gray-400" />
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-[10.5px] font-display font-bold text-white leading-none">Dr. R. K. Sharma</div>
              <div className="text-[8px] font-mono text-cyan-400 uppercase mt-1 tracking-widest">Director Space Ops</div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN LAYOUT CONTAINER (Sidebar + Content View) */}
      <div className="flex flex-1 items-stretch overflow-hidden relative">
        
        {/* Left Nav Sidebar */}
        <DashboardSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          systemStatus={systemStatus}
          onOpenControlDeck={() => setShowControlDeck(!showControlDeck)}
        />

        {/* Right Content Stream */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-64px)] bg-[#040815]/95">
          
          {/* Floating control deck panel if open */}
          {showControlDeck && (
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Simulator Controls Terminal</span>
                <button 
                  onClick={() => setShowControlDeck(false)}
                  className="text-[10px] font-mono text-gray-500 hover:text-white uppercase"
                >
                  Hide Control Panel [x]
                </button>
              </div>
              <ControlDeck
                isStormActive={isStormActive}
                onInjectStorm={handleInjectStorm}
                simulationSpeed={simulationSpeed}
                setSimulationSpeed={setSimulationSpeed}
                isSimulating={isSimulating}
                setIsSimulating={setIsSimulating}
                onMitigateAll={handleMitigateAllFleet}
              />
            </div>
          )}

          {/* DYNAMIC SCREEN SWITCHES */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              {/* Space Weather Indices Block (Row of 11 KPIs) */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">Live Space Weather Telemetry Indices</h3>
                <SpaceWeatherPanel telemetry={telemetry} isStormActive={isStormActive} />
              </div>

              {/* Main Core Section (3D Space Canvas + Satellite details) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-8">
                  <SpaceVisualizer
                    satellites={satellites}
                    selectedSatelliteId={selectedSatelliteId}
                    setSelectedSatelliteId={setSelectedSatelliteId}
                    isStormActive={isStormActive}
                    solarWindSpeed={telemetry.solarWindSpeed}
                  />
                </div>
                <div className="lg:col-span-4">
                  <SatelliteInfoCard
                    satellites={satellites}
                    selectedSatelliteId={selectedSatelliteId}
                    setSelectedSatelliteId={setSelectedSatelliteId}
                    onToggleShield={handleToggleShield}
                    onTogglePayload={handleTogglePayloadStatus}
                  />
                </div>
              </div>

              {/* Main AI Forecast Panel + SHAP Explainability side-by-side */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-6">
                  <ForecastPanel 
                    isStormActive={isStormActive} 
                    selectedSatelliteName={satellites.find(s => s.id === selectedSatelliteId)?.name || "GSAT-24"} 
                  />
                </div>
                <div className="lg:col-span-6">
                  <ExplainableAIPanel isStormActive={isStormActive} />
                </div>
              </div>

              {/* Space Weather Timeline & Cumulative Satellite Impacts */}
              <RiskTimelinePanel 
                isStormActive={isStormActive} 
                satellites={satellites}
                onTriggerShield={handleToggleShield}
              />

              {/* Model Performance metrics & Mission Readiness checklist */}
              <PerformanceReadinessPanel isStormActive={isStormActive} satellites={satellites} />

              {/* Bottom Analytics Trends */}
              <HistoricalAnalyticsPanel isStormActive={isStormActive} />

              {/* Active Incident Warning logs */}
              <AlertCenter 
                alerts={alerts} 
                onMitigateAlert={handleMitigateAlert} 
                systemStatus={systemStatus} 
              />
            </div>
          )}

          {/* INDIVIDUAL TAB SPECIFIC FULLSCREEN VIEWS (Elite UI Design option) */}
          {activeTab === "live-weather" && (
            <div className="space-y-6 p-4 border border-cyan-500/10 rounded-xl bg-slate-950/20">
              <div className="flex justify-between items-center border-b border-cyber-blue/10 pb-3">
                <h2 className="text-sm font-display font-black text-white uppercase tracking-widest">LIVE SPACE WEATHER INDICES FOCUSED STREAM</h2>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">STREAM ID: GOES_GCR_LIVE_01</span>
              </div>
              <p className="text-xs text-gray-400">
                Hourly, high-precision interplanetary magnetic indices and solar particle flux density metrics. Sparklines represent the last 2 hours of live micro-telemetry readings.
              </p>
              <SpaceWeatherPanel telemetry={telemetry} isStormActive={isStormActive} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
                <HistoricalAnalyticsPanel isStormActive={isStormActive} />
                <div className="glass-panel rounded-xl p-5 border border-cyber-blue/10 text-xs text-gray-300 leading-relaxed space-y-3">
                  <span className="font-display font-bold text-white block uppercase text-[11px]">Index coupling explanation</span>
                  <p>
                    <strong>IMF Bz:</strong> Represents the vertical northward/southward component of interplanetary magnetic lines. Severe southward deflection (negative values) couples strongly with Earth's magnetosphere, loading geostationary orbits with high speed plasma.
                  </p>
                  <p>
                    <strong>Electron Flux:</strong> Relativistic electrons trapped in the outer Van Allen radiation belt directly bombard geostationary satellites, causing ESD (Electrostatic Discharge) inside circuit boards.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "forecast" && (
            <div className="space-y-6 p-4 border border-cyan-500/10 rounded-xl bg-slate-950/20">
              <div className="flex justify-between items-center border-b border-cyber-blue/10 pb-3">
                <h2 className="text-sm font-display font-black text-white uppercase tracking-widest">AI TEMPORAL FUSION TRANSFORMER (TFT) FORECAST SUITE</h2>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">MODEL VERSION: TFT_ANOVA_v2.4</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
                <div className="lg:col-span-2">
                  <ForecastPanel 
                    isStormActive={isStormActive} 
                    selectedSatelliteName={satellites.find(s => s.id === selectedSatelliteId)?.name || "GSAT-24"} 
                  />
                </div>
                <div>
                  <ExplainableAIPanel isStormActive={isStormActive} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "satellite" && (
            <div className="space-y-6 p-4 border border-cyan-500/10 rounded-xl bg-slate-950/20">
              <div className="flex justify-between items-center border-b border-cyber-blue/10 pb-3">
                <h2 className="text-sm font-display font-black text-white uppercase tracking-widest">ISRO GEOSTATIONARY SATELLITE FLEET MONITOR</h2>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">TOTAL ACTIVE SATELLITES: {satellites.length}</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-8">
                  <SpaceVisualizer
                    satellites={satellites}
                    selectedSatelliteId={selectedSatelliteId}
                    setSelectedSatelliteId={setSelectedSatelliteId}
                    isStormActive={isStormActive}
                    solarWindSpeed={telemetry.solarWindSpeed}
                  />
                </div>
                <div className="lg:col-span-4">
                  <SatelliteInfoCard
                    satellites={satellites}
                    selectedSatelliteId={selectedSatelliteId}
                    setSelectedSatelliteId={setSelectedSatelliteId}
                    onToggleShield={handleToggleShield}
                    onTogglePayload={handleTogglePayloadStatus}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "explainability" && (
            <div className="space-y-6 p-4 border border-cyan-500/10 rounded-xl bg-slate-950/20">
              <div className="flex justify-between items-center border-b border-cyber-blue/10 pb-3">
                <h2 className="text-sm font-display font-black text-white uppercase tracking-widest">EXPLAINABLE AI SHAP CLASSIFICATION NODES</h2>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">SHAP ENGINE: COMPILED</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
                <ExplainableAIPanel isStormActive={isStormActive} />
                <div className="glass-panel rounded-xl p-5 border border-cyber-blue/15 text-xs text-gray-300 leading-relaxed space-y-4">
                  <span className="font-display font-bold text-white block uppercase text-[11px]">SHAP Mathematical Context</span>
                  <p>
                    SHAP (Shapley Additive exPlanations) values are based on cooperative game theory, calculating the exact marginal contribution of each physical feature (like Solar Wind speed or electron flux levels) to the output prediction.
                  </p>
                  <p>
                    Unlike standard "black-box" models, ANOVA AI integrates an on-board explainability node so ground engineers in Hassan, Karnataka, can immediately verify why the AI predicted an imminent radiation hazard, matching telemetry to mathematical drivers before triggering safe mode procedures.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6">
              <HistoricalAnalyticsPanel isStormActive={isStormActive} />
            </div>
          )}

          {activeTab === "solar" && (
            <div className="space-y-6">
              <RiskTimelinePanel 
                isStormActive={isStormActive} 
                satellites={satellites}
                onTriggerShield={handleToggleShield}
              />
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-6">
              <AlertCenter 
                alerts={alerts} 
                onMitigateAlert={handleMitigateAlert} 
                systemStatus={systemStatus} 
              />
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6 p-4 border border-cyan-500/10 rounded-xl bg-slate-950/20 text-xs">
              <div className="flex justify-between items-center border-b border-cyber-blue/10 pb-3 mb-4">
                <h2 className="text-sm font-display font-black text-white uppercase tracking-widest">MISSION DIRECTIVE REPORT GENERATOR</h2>
                <span className="font-mono text-[9px] text-cyan-400">ANOVA_REPORTS_v1.0</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-slate-950 rounded border border-cyber-blue/10 text-center space-y-1">
                  <span className="text-gray-500 block uppercase text-[9px]">Last Daily Report</span>
                  <span className="text-xs font-bold text-white block">28 June 2026</span>
                  <button className="text-[10px] text-cyan-400 font-bold hover:underline block mx-auto mt-2">DOWNLOAD PDF</button>
                </div>
                <div className="p-4 bg-slate-950 rounded border border-cyber-blue/10 text-center space-y-1">
                  <span className="text-gray-500 block uppercase text-[9px]">Active Storm Report</span>
                  <span className="text-xs font-bold text-white block">Pending Eruption</span>
                  <button className="text-[10px] text-cyan-400 font-bold hover:underline block mx-auto mt-2">COMPILE REPORT</button>
                </div>
                <div className="p-4 bg-slate-950 rounded border border-cyber-blue/10 text-center space-y-1">
                  <span className="text-gray-500 block uppercase text-[9px]">Telemetry Residual Log</span>
                  <span className="text-xs font-bold text-white block">48.5 MB CSV</span>
                  <button className="text-[10px] text-cyan-400 font-bold hover:underline block mx-auto mt-2">EXPORT LOGS</button>
                </div>
              </div>

              <div className="bg-slate-950/40 border border-cyber-blue/5 rounded p-4 text-gray-400 leading-relaxed">
                <span className="font-display font-bold text-white block text-[11px] mb-1 uppercase">Automated Hazard Logs Summary</span>
                ANOVA generates standard PDF and CSV hazard summaries compliant with COSPAR (Committee on Space Research) satellite radiation reporting guidelines. Ground engineers can compile orbital dosimetry records with a single command override.
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6 p-4 border border-cyan-500/10 rounded-xl bg-slate-950/20 text-xs text-gray-300">
              <div className="flex justify-between items-center border-b border-cyber-blue/10 pb-3 mb-4">
                <h2 className="text-sm font-display font-black text-white uppercase tracking-widest">ANOVA SYSTEM PARAMETERS & CONFIGURATION</h2>
                <span className="font-mono text-[9px] text-cyan-400">CONFIG NODE: LOCAL</span>
              </div>

              <div className="space-y-4 max-w-lg">
                <div className="space-y-1">
                  <span className="font-display font-bold text-white block">Primary AI Engine Endpoint</span>
                  <input 
                    type="text" 
                    readOnly 
                    value="https://api.isro.anova.gov.in/v2/predict" 
                    className="w-full bg-slate-950 border border-cyber-blue/15 rounded p-2 font-mono text-cyan-400 text-[11px]" 
                  />
                </div>
                
                <div className="space-y-1">
                  <span className="font-display font-bold text-white block">Ground Station Ingress Feeds</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <label className="flex items-center gap-2 p-1.5 bg-slate-950 rounded border border-cyber-blue/5">
                      <input type="checkbox" defaultChecked readOnly className="rounded text-cyan-400 focus:ring-cyan-500 bg-slate-900 border-gray-700 pointer-events-none" />
                      <span>MCF Hassan Primary</span>
                    </label>
                    <label className="flex items-center gap-2 p-1.5 bg-slate-950 rounded border border-cyber-blue/5">
                      <input type="checkbox" defaultChecked readOnly className="rounded text-cyan-400 focus:ring-cyan-500 bg-slate-900 border-gray-700 pointer-events-none" />
                      <span>ISTRAC Bengaluru</span>
                    </label>
                    <label className="flex items-center gap-2 p-1.5 bg-slate-950 rounded border border-cyber-blue/5">
                      <input type="checkbox" defaultChecked readOnly className="rounded text-cyan-400 focus:ring-cyan-500 bg-slate-900 border-gray-700 pointer-events-none" />
                      <span>NOAA Space Weather SWPC</span>
                    </label>
                    <label className="flex items-center gap-2 p-1.5 bg-slate-950 rounded border border-cyber-blue/5">
                      <input type="checkbox" defaultChecked readOnly className="rounded text-cyan-400 focus:ring-cyan-500 bg-slate-900 border-gray-700 pointer-events-none" />
                      <span>NASA OMNIWeb Trajectory</span>
                    </label>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-3 rounded border border-cyber-blue/5 text-[10px]">
                  ANOVA parameters can only be altered by authorized ground personnel with Active Level-4 ISRO operations clearance.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. FOOTER */}
      <footer className="h-10 bg-[#030712] border-t border-cyber-blue/15 px-6 flex items-center justify-between text-[10px] font-mono text-gray-500 z-30 shrink-0">
        <div className="flex items-center gap-4">
          <span>Data sources: <strong>NOAA SWPC // GOES-16 // GOES-17 // DSCOVR // ACE // OMNIWeb // ISRO SATNET</strong></span>
        </div>
        <div>
          <span>PROJECT ANOVA ISRO SPACE OPERATIONS CENTRE © 2026 // ALL TELEMETRY ENCRYPTED</span>
        </div>
      </footer>
    </div>
  );
}

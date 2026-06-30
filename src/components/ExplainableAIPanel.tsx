import React from "react";
import { ShapContribution } from "../types";
import { NOMINAL_SHAP, STORM_SHAP } from "../data";
import { BrainCircuit, Info, Sparkles, TrendingUp, HelpCircle } from "lucide-react";

interface ExplainableAIPanelProps {
  isStormActive: boolean;
}

export default function ExplainableAIPanel({ isStormActive }: ExplainableAIPanelProps) {
  const contributions = isStormActive ? STORM_SHAP : NOMINAL_SHAP;

  // Find most influential feature (absolute highest value)
  const sortedByAbsolute = [...contributions].sort(
    (a, b) => Math.abs(b.value) - Math.abs(a.value)
  );
  const mostInfluential = sortedByAbsolute[0];

  return (
    <div className="glass-panel rounded-xl p-5 border border-cyber-blue/15 flex flex-col h-full shadow-lg">
      
      {/* Panel Header */}
      <div className="border-b border-cyber-blue/10 pb-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-cyan-400 animate-pulse" />
          <div>
            <h3 className="font-display font-bold text-sm text-white tracking-widest uppercase">
              AI EXPLAINABILITY (SHAP CORE INTEGRATION)
            </h3>
            <p className="text-[10px] font-mono text-cyan-500 mt-1 uppercase tracking-wider">
              Feature contributions to Temporal Fusion Transformer predictions
            </p>
          </div>
        </div>
        <span className="bg-slate-950 px-2 py-1 rounded border border-cyber-blue/10 font-mono text-[9px] text-cyan-400">
          Inference Node: active
        </span>
      </div>

      {/* Narrative AI explanation */}
      <div className="bg-slate-950/65 border border-cyan-500/10 rounded-lg p-3.5 mb-4 text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-display font-semibold text-cyan-300 text-[11.5px]">
          <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>Natural Language Diagnostic Interpretation</span>
        </div>
        <p className="text-gray-300 leading-relaxed text-[11px]">
          {isStormActive ? (
            <span>
              The TFT model predicts a massive spike in radiation hazard because of an extreme positive contribution (+0.68) from <strong>Electron Flux (E &gt; 2 MeV)</strong> and high velocity plasma (+0.42) from the <strong>Solar Wind</strong>. The interplanetary magnetic field (IMF) is strongly southward (Bz = -18.4 nT), causing severe magnetic reconnects that accelerate protons and charge satellite panels.
            </span>
          ) : (
            <span>
              The radiation forecast remains nominal because the geomagnetic environment is quiet. The slight southward IMF Bz (-1.2 nT) provides negligible geomagnetic coupling, and electron flux levels are resting within their safe Van Allen belt background limits.
            </span>
          )}
        </p>

        {/* Most Influential Banner */}
        <div className="mt-2.5 pt-2 border-t border-cyber-blue/5 flex items-center justify-between">
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">PRIMARY DRIVER DETERMINED:</span>
          <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold animate-pulse">
            {mostInfluential.displayName} ({mostInfluential.value > 0 ? "+" : ""}{mostInfluential.value})
          </span>
        </div>
      </div>

      {/* SHAP Chart centered axis layout */}
      <div className="flex-1 space-y-3.5 select-none">
        
        {/* Axis scale label */}
        <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 uppercase tracking-wider px-2 border-b border-cyber-blue/5 pb-1">
          <span>← Reduces Radiation Risk</span>
          <span className="font-bold text-cyan-400">Zero Contribution (Base Rate)</span>
          <span>Increases Radiation Risk →</span>
        </div>

        {contributions.map((item, idx) => {
          const isMost = item.feature === mostInfluential.feature;
          const isPos = item.value >= 0;
          
          // Calculate percentages for horizontal positioning around 50% midpoint
          // Max absolute SHAP value is ~0.8 for styling. Scale to max 42% on either side.
          const maxScale = 0.8;
          const barWidthPct = Math.min(42, (Math.abs(item.value) / maxScale) * 42);

          return (
            <div 
              key={idx} 
              className={`p-2 rounded-md border transition-all duration-200 ${
                isMost 
                  ? "bg-cyan-950/20 border-cyan-400/35 shadow-[0_0_10px_rgba(34,211,238,0.05)]" 
                  : "bg-slate-950/15 border-transparent hover:bg-slate-900/40 hover:border-cyber-blue/10"
              }`}
            >
              {/* Feature info line */}
              <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                <span className={`font-semibold ${isMost ? "text-cyan-300" : "text-gray-300"}`}>
                  {item.displayName}
                </span>
                <span className="text-gray-400">
                  Value: <strong className="text-gray-200">{item.actualValue}</strong> (SHAP: <strong className={isPos ? "text-red-400" : "text-cyan-400"}>{isPos ? "+" : ""}{item.value.toFixed(2)}</strong>)
                </span>
              </div>

              {/* Centered Bar container */}
              <div className="h-3 bg-slate-950 rounded-full relative overflow-hidden flex items-center border border-cyber-blue/5">
                {/* 50% Center Divider Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-700/60 z-10" />

                {isPos ? (
                  // Positive Bar (Extending right from 50%)
                  <div 
                    style={{ left: "50%", width: `${barWidthPct}%` }}
                    className={`absolute h-full rounded-r-full bg-gradient-to-r ${
                      isMost 
                        ? "from-amber-500 to-red-500 shadow-[0_0_8px_#ef4444]" 
                        : "from-amber-600/60 to-orange-500/60"
                    } transition-all duration-500`}
                  />
                ) : (
                  // Negative Bar (Extending left from 50%)
                  <div 
                    style={{ right: "50%", width: `${barWidthPct}%` }}
                    className={`absolute h-full rounded-l-full bg-gradient-to-l ${
                      isMost 
                        ? "from-blue-500 to-cyan-400 shadow-[0_0_8px_#22d3ee]" 
                        : "from-blue-600/50 to-cyan-500/50"
                    } transition-all duration-500`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scientific Footnote */}
      <div className="mt-4 pt-3 border-t border-cyber-blue/10 flex items-center gap-1.5 text-[8.5px] text-gray-500 font-mono">
        <Info className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
        <span>
          SHAP values explain how the TFT features shift predictions from the long-term historical base rate (140 pfu). Red bars represent hazards pushing predictions toward satellite safe-mode thresholds.
        </span>
      </div>
    </div>
  );
}

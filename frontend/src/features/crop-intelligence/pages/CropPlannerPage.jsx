import React, { useState } from 'react';
import { 
  Sprout, 
  MapPin, 
  Sun, 
  Droplets, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  DollarSign, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle,
  Award
} from 'lucide-react';

export const CropPlannerPage = () => {
  // Input parameters for agronomic & economic decision support
  const [district, setDistrict] = useState('Indore, MP');
  const [soilType, setSoilType] = useState('Black Cotton Soil');
  const [landAcres, setLandAcres] = useState(5);
  const [season, setSeason] = useState('Rabi (Winter Sowing)');
  const [budgetPerAcre, setBudgetPerAcre] = useState(15000);
  const [isCalculating, setIsCalculating] = useState(false);

  // Evaluated Crop Recommendations
  const [cropRankings, setCropRankings] = useState([
    {
      id: 'rec-1',
      rank: 1,
      cropName: 'Mustard (Sarson - Bio Gold Hybrid)',
      suitabilityScore: 94, // %
      expectedYieldPerAcre: '9.2 Quintals',
      totalEstimatedYield: '46 Quintals (for 5 Acres)',
      expectedPrice: 5900, // ₹ per qtl
      priceCrashRisk: 14, // % Low Risk
      riskCategory: 'LOW RISK',
      expectedRevenue: 271400, // ₹
      inputCostTotal: 42000, // ₹
      expectedProfit: 229400, // ₹
      mandiSaturation: 32, // % Low storage pressure
      reason: '✓ High soil suitability for Black soil • Low Mandi storage pressure (32%) • High edible oil import demand protecting prices • Low water requirement.',
      status: 'BEST PROFITABLE MATCH'
    },
    {
      id: 'rec-2',
      rank: 2,
      cropName: 'Desi Chana (Bengal Gram)',
      suitabilityScore: 89,
      expectedYieldPerAcre: '8.5 Quintals',
      totalEstimatedYield: '42.5 Quintals',
      expectedPrice: 6200,
      priceCrashRisk: 22,
      riskCategory: 'LOW-MEDIUM RISK',
      expectedRevenue: 263500,
      inputCostTotal: 38000,
      expectedProfit: 225500,
      mandiSaturation: 44,
      reason: '✓ Good pulse deficit market support • Fixes nitrogen in soil reducing fertilizer needs • Moderate yield expected.',
      status: 'HIGH MARGIN ALTERNATIVE'
    },
    {
      id: 'rec-3',
      rank: 3,
      cropName: 'Sharbati Wheat (Standard Wheat)',
      suitabilityScore: 92,
      expectedYieldPerAcre: '18 Quintals',
      totalEstimatedYield: '90 Quintals',
      expectedPrice: 2480,
      priceCrashRisk: 38,
      riskCategory: 'MEDIUM RISK',
      expectedRevenue: 223200,
      inputCostTotal: 55000,
      expectedProfit: 168200,
      mandiSaturation: 68,
      reason: '⚠ High yield potential but moderate Mandi storage saturation (68%). High irrigation cost reduces overall net profit margins.',
      status: 'STABLE BUT LOWER PROFIT'
    },
    {
      id: 'rec-4',
      rank: 4,
      cropName: 'Yellow Soybean (Off-Season Sowing)',
      suitabilityScore: 78,
      expectedYieldPerAcre: '7.0 Quintals',
      totalEstimatedYield: '35 Quintals',
      expectedPrice: 3950,
      priceCrashRisk: 78,
      riskCategory: 'HIGH RISK OF PRICE CRASH',
      riskColor: 'rose',
      expectedRevenue: 138250,
      inputCostTotal: 48000,
      expectedProfit: 90250,
      mandiSaturation: 86, // % Critical storage overflow
      reason: '❌ HIGH RISK: Regional Mandi warehouses hold 86% carryover stock! Excess planting will trigger market glut and price downfall.',
      status: 'NOT RECOMMENDED THIS SEASON'
    }
  ]);

  const handleRunDecisionSupport = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-950 border border-emerald-500/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>FastAPI Agricultural + Economic Decision Engine</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white">Pre-Planting Crop Intelligence Planner</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            "What should I plant?" — Combines soil, weather, yield history, Mandi storage & price-crash risk to maximize your profit.
          </p>
        </div>

        <button
          onClick={handleRunDecisionSupport}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-emerald-950 flex items-center gap-2 transition-all shrink-0"
        >
          {isCalculating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sprout className="w-4 h-4" />}
          <span>{isCalculating ? 'Evaluating ML Decision Models...' : 'Calculate Optimal Crop'}</span>
        </button>
      </div>

      {/* Input Parameters Form */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>Your Farm & Agronomic Conditions:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1">District / Region:</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Soil Type:</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="Black Cotton Soil">Black Cotton Soil</option>
              <option value="Alluvial Soil">Alluvial Soil</option>
              <option value="Red Sandy Soil">Red Sandy Soil</option>
              <option value="Loamy Soil">Loamy Soil</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Land Size (Acres):</label>
            <input
              type="number"
              value={landAcres}
              onChange={(e) => setLandAcres(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Upcoming Season:</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="Rabi (Winter Sowing)">Rabi (Winter Sowing)</option>
              <option value="Kharif (Monsoon Sowing)">Kharif (Monsoon Sowing)</option>
              <option value="Zaid (Summer Crops)">Zaid (Summer Crops)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Budget / Acre (₹):</label>
            <input
              type="number"
              value={budgetPerAcre}
              onChange={(e) => setBudgetPerAcre(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Evaluated Crop Ranking Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white">Recommended Crop Suitability & Profit Ranking</h2>
            <p className="text-xs text-slate-400">Ranked by expected net profit, yield potential, and Mandi price crash probability.</p>
          </div>
        </div>

        <div className="space-y-6">
          {cropRankings.map((crop) => (
            <div 
              key={crop.id}
              className={`glass-panel p-6 rounded-3xl border transition-all ${
                crop.rank === 1 
                  ? 'border-emerald-500/60 bg-gradient-to-r from-emerald-950/30 via-slate-950 to-slate-950 shadow-2xl' 
                  : crop.priceCrashRisk > 60 
                  ? 'border-rose-900/60 bg-rose-950/10' 
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Header info */}
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center ${
                      crop.rank === 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      #{crop.rank}
                    </span>
                    <h3 className="text-xl font-extrabold text-white">{crop.cropName}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      crop.rank === 1 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' 
                        : crop.priceCrashRisk > 60
                        ? 'bg-rose-950 text-rose-300 border-rose-800/40'
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}>
                      {crop.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {crop.reason}
                  </p>
                </div>

                {/* Key Financial Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs shrink-0">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-slate-400 text-[10px] block">Agronomic Fit</span>
                    <span className="text-sm font-extrabold text-emerald-400 block mt-0.5">{crop.suitabilityScore}% Match</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-slate-400 text-[10px] block">Expected Yield</span>
                    <span className="text-sm font-extrabold text-white block mt-0.5">{crop.expectedYieldPerAcre}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-slate-400 text-[10px] block">Downfall Risk</span>
                    <span className={`text-sm font-extrabold block mt-0.5 ${
                      crop.priceCrashRisk > 50 ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {crop.priceCrashRisk}% ({crop.riskCategory})
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-center">
                    <span className="text-emerald-400 text-[10px] block font-bold">Estimated Net Profit</span>
                    <span className="text-base font-extrabold text-emerald-300 block mt-0.5">₹{crop.expectedProfit.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

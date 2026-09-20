import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Warehouse,
  BarChart3,
  MapPin
} from 'lucide-react';

export const MarketIntelligencePage = () => {
  const [selectedCrop, setSelectedCrop] = useState('Soybean');
  const [sowingMonth, setSowingMonth] = useState('October');

  const forecasts = {
    'Soybean': {
      mandiStorageSaturation: 86, // %
      currentPrice: 4750,
      predictedHarvestPrice: 3950,
      trend: 'Downfall',
      riskLevel: 'HIGH RISK OF PRICE CRASH',
      riskColor: 'rose',
      reason: 'Regional Mandi warehouses in Madhya Pradesh currently hold 86% capacity of last season carryover stock. Excess planting will trigger a market glut.',
      alternativeRecommendation: {
        crop: 'Mustard (Sarson)',
        predictedPrice: 5900,
        profitDifference: '+38% Higher Return',
        reason: 'Oilseed demand is high with only 32% storage occupancy in local Mandis.'
      },
      chartMonths: [
        { month: 'Oct (Sowing)', price: 4750 },
        { month: 'Nov (Growth)', price: 4600 },
        { month: 'Dec (Maturation)', price: 4300 },
        { month: 'Jan (Harvest Peak)', price: 3950 },
        { month: 'Feb (Post-Harvest)', price: 4100 }
      ]
    },
    'Wheat': {
      mandiStorageSaturation: 42, // %
      currentPrice: 2480,
      predictedHarvestPrice: 2850,
      trend: 'Upward Rise',
      riskLevel: 'LOW RISK - HIGH PROFIT POTENTIAL',
      riskColor: 'emerald',
      reason: 'Government buffer stock requirement is high and local Mandi storage is well below critical capacity (42%).',
      alternativeRecommendation: {
        crop: 'Wheat (Sarbati Hybrid)',
        predictedPrice: 2950,
        profitDifference: '+18% Return',
        reason: 'Optimal soil moisture and high flour mill procurement demand.'
      },
      chartMonths: [
        { month: 'Nov (Sowing)', price: 2480 },
        { month: 'Dec (Germination)', price: 2550 },
        { month: 'Jan (Tillering)', price: 2680 },
        { month: 'Feb (Grain Fill)', price: 2790 },
        { month: 'Mar (Harvest Peak)', price: 2850 }
      ]
    },
    'Cotton': {
      mandiStorageSaturation: 74, // %
      currentPrice: 7120,
      predictedHarvestPrice: 6400,
      trend: 'Moderate Downfall',
      riskLevel: 'MEDIUM RISK',
      riskColor: 'amber',
      reason: 'Global textile export demand is subdued and Mandi storage is at 74%.',
      alternativeRecommendation: {
        crop: 'Chana (Desi Gram)',
        predictedPrice: 6300,
        profitDifference: '+22% Return',
        reason: 'Pulse deficit across markets will keep prices firm.'
      },
      chartMonths: [
        { month: 'Oct (Sowing)', price: 7120 },
        { month: 'Nov (Growth)', price: 6900 },
        { month: 'Dec (Boll Formation)', price: 6650 },
        { month: 'Jan (Harvest)', price: 6400 }
      ]
    }
  };

  const activeForecast = forecasts[selectedCrop] || forecasts['Soybean'];

  const mandiComparisonTable = [
    { mandi: 'Indore Main Mandi', crop: selectedCrop, price: `₹${activeForecast.currentPrice}/qtl`, arrival: '12,400 Qtls', storageStatus: `${activeForecast.mandiStorageSaturation}% Full` },
    { mandi: 'Ujjain Krishi Mandi', crop: selectedCrop, price: `₹${activeForecast.currentPrice - 60}/qtl`, arrival: '8,200 Qtls', storageStatus: '80% Full' },
    { mandi: 'Dewas Grain Market', crop: selectedCrop, price: `₹${activeForecast.currentPrice + 40}/qtl`, arrival: '5,100 Qtls', storageStatus: '75% Full' },
    { mandi: 'Dhar APMC Mandi', crop: selectedCrop, price: `₹${activeForecast.currentPrice - 30}/qtl`, arrival: '4,600 Qtls', storageStatus: '82% Full' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-950 to-slate-950 border border-amber-500/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-bold mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>FastAPI Pre-Planting ML Engine</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white">Mandi Price & Downfall Forecast</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Predict 3-6 month crop price movements before seed sowing based on regional Mandi storage levels.</p>
        </div>

        {/* Crop Selector Buttons */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          {['Soybean', 'Wheat', 'Cotton'].map(c => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCrop === c 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Main ML Forecast Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Storage saturation & Price trajectory chart */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Crop Pre-Planting Forecast</span>
                <h2 className="text-2xl font-extrabold text-white">{selectedCrop} Price Trajectory</h2>
              </div>

              <div className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${
                activeForecast.trend === 'Downfall'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
              }`}>
                {activeForecast.trend === 'Downfall' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                <span>{activeForecast.riskLevel}</span>
              </div>
            </div>

            {/* Mandi Storage Saturation Meter */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-amber-400" />
                  <span>Regional Mandi Storage Occupancy:</span>
                </span>
                <span className="font-extrabold text-amber-400 text-sm">{activeForecast.mandiStorageSaturation}% Full</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    activeForecast.mandiStorageSaturation > 75 
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  }`} 
                  style={{ width: `${activeForecast.mandiStorageSaturation}%` }}
                ></div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                {activeForecast.reason}
              </p>
            </div>

            {/* Price Chart Visualizer */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>3-6 Month Mandi Price Trend Forecast (₹ / Quintal):</span>
              </h3>

              <div className="grid grid-cols-5 gap-2">
                {activeForecast.chartMonths.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                    <span className="text-[10px] text-slate-400 block">{m.month}</span>
                    <span className="text-sm font-extrabold text-amber-300 block">₹{m.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Smart Alternative Crop Advisor */}
        <div className="lg:col-span-5 space-y-6">
          {/* Smart Crop Swap Advisory */}
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 space-y-6 bg-gradient-to-b from-emerald-950/20 via-slate-950 to-slate-950">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">ML Smart Crop Alternative</h3>
                <p className="text-xs text-emerald-400 font-semibold">Avoid Price Crash • Maximize Profit</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Recommended Alternative Crop:</span>
                <span className="font-extrabold text-emerald-300 text-sm">{activeForecast.alternativeRecommendation.crop}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Predicted Harvest Rate:</span>
                <span className="font-extrabold text-white text-sm">₹{activeForecast.alternativeRecommendation.predictedPrice}/qtl</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2">
                <span className="text-slate-400">Expected Profit Margin:</span>
                <span className="font-extrabold text-emerald-400 text-xs">{activeForecast.alternativeRecommendation.profitDifference}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/40">
              💡 <strong>Agronomist Advice:</strong> {activeForecast.alternativeRecommendation.reason}
            </p>

            <button className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all">
              <span>View Certified {activeForecast.alternativeRecommendation.crop} Seeds</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Regional Mandi Live Comparison Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-400" />
          <span>Regional Mandi Live Price & Arrival Comparison</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Mandi Location</th>
                <th className="p-3">Crop</th>
                <th className="p-3">Current Spot Rate</th>
                <th className="p-3">Daily Arrival Queue</th>
                <th className="p-3">Warehouse Capacity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {mandiComparisonTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-bold text-white">{row.mandi}</td>
                  <td className="p-3 text-slate-300">{row.crop}</td>
                  <td className="p-3 font-extrabold text-amber-400">{row.price}</td>
                  <td className="p-3 text-slate-400">{row.arrival}</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-semibold">{row.storageStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

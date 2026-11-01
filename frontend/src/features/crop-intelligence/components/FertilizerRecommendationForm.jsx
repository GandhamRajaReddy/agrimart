import { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  Info,
  Loader2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { recommendFertilizer } from '../api/recommendationApi';

const CROPS = [
  { value: 'rice', label: 'Rice (Paddy)' },
  { value: 'maize', label: 'Maize (Corn)' },
  { value: 'chickpea', label: 'Chickpea (Gram)' },
  { value: 'kidneybeans', label: 'Kidney Beans (Rajma)' },
  { value: 'pigeonpeas', label: 'Pigeonpeas (Tur/Arhar)' },
  { value: 'mothbeans', label: 'Mothbeans' },
  { value: 'mungbean', label: 'Mungbean (Green Gram)' },
  { value: 'blackgram', label: 'Blackgram (Urad)' },
  { value: 'lentil', label: 'Lentil (Masoor)' },
  { value: 'pomegranate', label: 'Pomegranate' },
  { value: 'banana', label: 'Banana' },
  { value: 'mango', label: 'Mango' },
  { value: 'grapes', label: 'Grapes' },
  { value: 'watermelon', label: 'Watermelon' },
  { value: 'muskmelon', label: 'Muskmelon' },
  { value: 'apple', label: 'Apple' },
  { value: 'orange', label: 'Orange' },
  { value: 'papaya', label: 'Papaya' },
  { value: 'coconut', label: 'Coconut' },
  { value: 'cotton', label: 'Cotton' },
  { value: 'jute', label: 'Jute' },
  { value: 'coffee', label: 'Coffee' },
];

const NUTRIENT_NAMES = {
  N: 'Nitrogen (N)',
  P: 'Phosphorus (P)',
  K: 'Potassium (K)',
};

const NUTRIENT_SOURCES = {
  N: 'Urea (46% N) or well-rotted farmyard manure (FYM)',
  P: 'Single Super Phosphate (SSP) or DAP (Diammonium Phosphate)',
  K: 'Muriate of Potash (MOP) or Sulfate of Potash',
};

export const FertilizerRecommendationForm = () => {
  const [crop, setCrop] = useState('rice');
  const [nitrogen, setNitrogen] = useState('80');
  const [phosphorus, setPhosphorus] = useState('40');
  const [potassium, setPotassium] = useState('40');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);
    setIsSubmitting(true);

    try {
      const response = await recommendFertilizer({
        crop,
        nitrogen: Number(nitrogen),
        phosphorus: Number(phosphorus),
        potassium: Number(potassium),
      });
      setResult(response);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError('Please log in to receive fertilizer recommendations.');
      } else {
        setError(
          err.response?.data?.detail ||
          err.response?.data?.message ||
          'Fertilizer recommendation service is currently unavailable. Please verify the backend connection.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const adviceData = result?.data || result;
  const nutrientCode = adviceData?.most_significant_nutrient;
  const nutrientLabel = NUTRIENT_NAMES[nutrientCode] || nutrientCode;
  const status = adviceData?.status;
  const delta = adviceData?.reference_difference;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-2">
          <FlaskConical size={18} /> Soil Nutrient Balancing
        </div>
        <p className="text-sm text-slate-300">
          Enter your soil test values (in kg/ha or test index) for Nitrogen, Phosphorus, and Potassium to calculate nutritional deltas against standard crop benchmarks.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
            <span className="font-semibold text-white">Target crop</span>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-500"
            >
              {CROPS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span className="font-semibold text-white">Soil Nitrogen (N)</span>
            <input
              type="number"
              min="0"
              max="300"
              step="1"
              required
              value={nitrogen}
              onChange={(e) => setNitrogen(e.target.value)}
              placeholder="e.g. 80"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-500"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span className="font-semibold text-white">Soil Phosphorus (P)</span>
            <input
              type="number"
              min="0"
              max="300"
              step="1"
              required
              value={phosphorus}
              onChange={(e) => setPhosphorus(e.target.value)}
              placeholder="e.g. 40"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-500"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span className="font-semibold text-white">Soil Potassium (K)</span>
            <input
              type="number"
              min="0"
              max="300"
              step="1"
              required
              value={potassium}
              onChange={(e) => setPotassium(e.target.value)}
              placeholder="e.g. 40"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-500"
            />
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Calculating balance…</span>
                </>
              ) : (
                <>
                  <FlaskConical size={18} />
                  <span>Analyze Fertilizer Requirements</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-800/60 bg-rose-950/30 p-4 text-sm text-rose-200">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {adviceData && (
        <section className={`space-y-4 rounded-2xl border p-6 ${
          status === 'balanced'
            ? 'border-emerald-700/60 bg-emerald-950/20'
            : status === 'low'
            ? 'border-amber-700/60 bg-amber-950/20'
            : 'border-blue-700/60 bg-blue-950/20'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              {status === 'balanced' ? (
                <>
                  <CheckCircle2 size={22} className="text-emerald-400" />
                  <span>Balanced Soil Profile</span>
                </>
              ) : status === 'low' ? (
                <>
                  <TrendingDown size={22} className="text-amber-400" />
                  <span>Nutrient Deficit Detected</span>
                </>
              ) : (
                <>
                  <TrendingUp size={22} className="text-blue-400" />
                  <span>Nutrient Surplus Detected</span>
                </>
              )}
            </div>

            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              status === 'balanced'
                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                : status === 'low'
                ? 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
                : 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
            }`}>
              {status === 'balanced' ? 'Optimal N-P-K' : status === 'low' ? `${nutrientCode} Deficient` : `${nutrientCode} Excess`}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Crop</span>
              <p className="mt-1 text-lg font-bold text-white capitalize">{adviceData.crop}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Key Limiting Nutrient</span>
              <p className="mt-1 text-lg font-bold text-white">{nutrientLabel}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Benchmark Difference</span>
              <p className={`mt-1 text-lg font-bold ${
                delta > 0 ? 'text-amber-300' : delta < 0 ? 'text-blue-300' : 'text-emerald-300'
              }`}>
                {delta > 0 ? `+${delta} deficit` : delta < 0 ? `${delta} surplus` : '0 (Aligned)'}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs leading-5 text-slate-300">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200 mb-1">
              <Info size={14} className="text-emerald-400" /> Agronomic Guidance
            </div>
            {status === 'low' && (
              <p>
                Soil {nutrientLabel} is below standard requirements for {adviceData.crop}. Recommended input source: <strong className="text-white">{NUTRIENT_SOURCES[nutrientCode] || 'Approved commercial fertilizer'}</strong>. Split application across crop growth stages for optimal uptake.
              </p>
            )}
            {status === 'high' && (
              <p>
                Soil {nutrientLabel} is above standard requirements. Avoid additional {nutrientCode} application during basal dressing to prevent leaching and unnecessary cost.
              </p>
            )}
            {status === 'balanced' && (
              <p>
                Soil N-P-K levels are well proportioned for {adviceData.crop}. Maintain organic matter and monitor periodically through crop tillering or vegetative stages.
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
            <AlertTriangle size={14} className="text-amber-400" />
            <span>
              {result?.disclaimer || 'Informational only; reference table comparison. Consult an agronomist before determining commercial dosage.'}
            </span>
          </div>
        </section>
      )}
    </div>
  );
};

export default FertilizerRecommendationForm;

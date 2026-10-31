import { useState } from "react";
import { AlertTriangle, BarChart3, MapPin, Sprout } from "lucide-react";

import axiosClient from "../../../services/http/axiosClient";

const seasons = [
  { value: "KHARIF", label: "Kharif" },
  { value: "RABI", label: "Rabi" },
  { value: "ZAID", label: "Zaid / Summer" },
];

export const CropPlannerPage = () => {
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");
  const [landArea, setLandArea] = useState("1");
  const [season, setSeason] = useState("KHARIF");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await axiosClient.post("/market/crop-plan/", {
        district,
        taluk,
        land_area_acres: Number(landArea),
        season,
        ...(budget === "" ? {} : { budget_per_acre: Number(budget) }),
      });
      setResult(response.data);
    } catch (requestError) {
      const payload = requestError.response?.data;
      setError(
        payload?.detail ||
          "Crop intelligence is currently unavailable. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <header className="rounded-3xl border border-emerald-800/60 bg-gradient-to-br from-emerald-950 to-slate-950 p-7">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
          <Sprout size={18} />
          Karnataka crop intelligence
        </div>
        <h1 className="mt-3 text-3xl font-extrabold text-white">
          Crop profitability planner
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Compare crop options using verified mandi prices, expected yield,
          cultivation costs, and price-risk estimates. Recommendations will
          appear only after the underlying data and forecasting model pass
          validation.
        </p>
      </header>

      <form
        onSubmit={submit}
        className="grid gap-5 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 sm:grid-cols-2"
      >
        <label className="space-y-2 text-sm text-slate-300">
          <span className="flex items-center gap-2 font-semibold">
            <MapPin size={16} /> Karnataka district
          </span>
          <input
            required
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
            placeholder="e.g. Mandya"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-500"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span className="font-semibold">Taluk (optional)</span>
          <input
            value={taluk}
            onChange={(event) => setTaluk(event.target.value)}
            placeholder="e.g. Maddur"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-500"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span className="font-semibold">Land area (acres)</span>
          <input
            required
            type="number"
            min="0.1"
            step="0.1"
            value={landArea}
            onChange={(event) => setLandArea(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-500"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span className="font-semibold">Growing season</span>
          <select
            value={season}
            onChange={(event) => setSeason(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-500"
          >
            {seasons.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
          <span className="font-semibold">Budget per acre (₹, optional)</span>
          <input
            type="number"
            min="0"
            step="100"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            placeholder="Enter your cultivation budget"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-500"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !district.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
        >
          <BarChart3 size={18} />
          {loading ? "Checking data readiness…" : "Evaluate crop options"}
        </button>
      </form>

      {error && (
        <section
          role="alert"
          className="rounded-2xl border border-amber-700/60 bg-amber-950/30 p-5"
        >
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <AlertTriangle size={18} />
            Recommendations are not available yet
          </div>
          <p className="mt-2 text-sm leading-6 text-amber-100/80">{error}</p>
          <p className="mt-3 text-xs text-slate-400">
            No estimated prices, yields, risk scores, or profit figures have
            been substituted with sample data.
          </p>
        </section>
      )}

      {result && (
        <pre className="overflow-auto rounded-2xl border border-slate-800 bg-slate-950 p-5 text-xs text-slate-200">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
};

export default CropPlannerPage;

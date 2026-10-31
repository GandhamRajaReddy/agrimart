import { useState } from "react";
import { AlertTriangle, MapPin, Sprout } from "lucide-react";

import axiosClient from "../../../services/http/axiosClient";

const CropPlannerPage = () => {
  const [district, setDistrict] = useState("");
  const [landAcres, setLandAcres] = useState("1");
  const [season, setSeason] = useState("Kharif");
  const [soilType, setSoilType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const submitPlan = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);
    try {
      const response = await axiosClient.post("/market/crop-plan/", {
        district,
        land_area_acres: Number(landAcres),
        season,
        soil_type: soilType,
        state: "Karnataka",
      });
      setMessage(response.data?.detail || "No validated crop plan is currently available.");
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
        "Crop planning is unavailable. Check the backend connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl space-y-7 px-4 py-10">
      <header className="rounded-3xl border border-emerald-800/50 bg-gradient-to-br from-emerald-950 to-slate-950 p-7">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
          <Sprout size={18} />
          Karnataka crop decision support
        </div>
        <h1 className="mt-3 text-3xl font-extrabold text-white">Crop planning</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Submit your farm details to check decision-support availability. AgriMart
          will only rank crops when verified mandi prices, crop yield and cultivation
          cost data, and a backtested model are available.
        </p>
      </header>

      <form onSubmit={submitPlan} className="grid gap-5 rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300">
          <span className="flex items-center gap-2 font-semibold"><MapPin size={16} /> Karnataka district</span>
          <input required value={district} onChange={(event) => setDistrict(event.target.value)}
            placeholder="Enter your district"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-500" />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span className="font-semibold">Land area (acres)</span>
          <input required min="0.1" step="0.1" type="number" value={landAcres}
            onChange={(event) => setLandAcres(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-500" />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span className="font-semibold">Cropping season</span>
          <select value={season} onChange={(event) => setSeason(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-500">
            <option value="Kharif">Kharif</option>
            <option value="Rabi">Rabi</option>
            <option value="Zaid">Zaid</option>
          </select>
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span className="font-semibold">Soil type (optional)</span>
          <input value={soilType} onChange={(event) => setSoilType(event.target.value)}
            placeholder="e.g. red soil, black soil"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-emerald-500" />
        </label>

        <div className="sm:col-span-2">
          <button type="submit" disabled={isSubmitting}
            className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Checking availability…" : "Check crop plan availability"}
          </button>
        </div>
      </form>

      <section className="rounded-2xl border border-amber-700/50 bg-amber-950/20 p-5">
        <div className="flex items-center gap-2 font-bold text-amber-300">
          <AlertTriangle size={18} /> Forecasts and profit rankings are not yet validated
        </div>
        <p className="mt-2 text-sm leading-6 text-amber-100/80">
          No example prices, yield estimates, risk percentages, or profit figures
          are displayed as recommendations.
        </p>
        {message && <p role="status" className="mt-4 rounded-xl border border-amber-700/40 bg-slate-950/60 p-3 text-sm text-slate-200">{message}</p>}
      </section>
    </main>
  );
};

export default CropPlannerPage;
export { CropPlannerPage };

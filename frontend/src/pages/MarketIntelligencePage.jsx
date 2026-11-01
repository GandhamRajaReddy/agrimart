import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Database,
  ExternalLink,
  MapPin,
  ShieldCheck,
  Store,
} from "lucide-react";

import axiosClient from "../services/http/axiosClient";

const KARNATAKA_DISTRICTS = [
  "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru South",
  "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapura", "Chikkamagaluru",
  "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag",
  "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar",
  "Koppal", "Mandya", "Mysuru", "Raichur", "Shivamogga",
  "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgir"
];

const SAMPLE_APMC_MAP = {
  "Bengaluru Urban": ["Bengaluru APMC (Yeshwanthpur)", "Binny Mill Fruit & Veg APMC"],
  "Dharwad": ["Hubballi APMC", "Dharwad APMC", "Kalghatgi APMC"],
  "Mysuru": ["Mysuru APMC (Bandipalya)", "Hunsur APMC", "Nanjangud APMC"],
  "Belagavi": ["Belgaum APMC", "Athani APMC", "Bailahongal APMC", "Nippani APMC"],
  "Shivamogga": ["Shivamogga APMC", "Sagar APMC", "Shikaripura APMC"],
  "Ballari": ["Ballari APMC", "Siruguppa APMC"],
  "Raichur": ["Raichur APMC", "Sindhanur APMC", "Lingasugur APMC"],
  "Mandya": ["Mandya APMC", "Maddur APMC", "Malavalli APMC"],
  "Kolar": ["Kolar APMC (Tomato Market)", "Bangarpet APMC", "Srinivasapur APMC (Mango)"],
};

const MarketIntelligencePage = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("Bengaluru Urban");

  const statusQuery = useQuery({
    queryKey: ["market-intelligence", "status"],
    queryFn: async () => {
      const response = await axiosClient.get("/market/status/");
      return response.data;
    },
    staleTime: 60_000,
    retry: 1,
  });

  const status = statusQuery.data;
  const mandisInDistrict = SAMPLE_APMC_MAP[selectedDistrict] || [`${selectedDistrict} Main APMC Yard`];

  return (
    <main className="mx-auto max-w-6xl space-y-7 px-4 py-10">
      <header className="rounded-3xl border border-emerald-800/50 bg-gradient-to-br from-emerald-950 to-slate-950 p-7">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
          <BarChart3 size={18} />
          Karnataka market intelligence
        </div>
        <h1 className="mt-3 text-3xl font-extrabold text-white">
          Mandi prices and market outlook
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Market arrivals and 30, 60, and 90-day outlooks will be published
          when verified AGMARKNET history is connected and forecasting models
          have passed time-series backtesting.
        </p>
      </header>

      {statusQuery.isLoading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-300 flex items-center gap-3">
          <Clock size={18} className="animate-pulse text-emerald-400" />
          <span>Checking market data readiness and APMC ingest status…</span>
        </div>
      )}

      {statusQuery.isError && (
        <div role="alert" className="rounded-2xl border border-rose-800/60 bg-rose-950/30 p-5 text-sm text-rose-200">
          Market data status could not be loaded. Please ensure the Django API server is running.
        </div>
      )}

      {status && (
        <>
          {/* Key Pipeline Metrics */}
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <Database size={17} className="text-teal-400" /> Primary Data Source
              </div>
              <p className="mt-3 text-lg font-bold text-white">{status.data_source}</p>
              <p className="mt-1 text-xs text-slate-400">Target: {status.region} APMCs</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-300">
                {status.data_source_configured ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>API gateway credential configured</span>
                  </>
                ) : (
                  <>
                    <Clock size={14} className="text-amber-400" />
                    <span>Awaiting data.gov.in API key</span>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <ShieldCheck size={17} className="text-emerald-400" /> Model Validation
              </div>
              <p className="mt-3 text-lg font-bold text-white">
                {status.forecast_model_validated ? "Validated" : "Validation Pending"}
              </p>
              <p className="mt-1 text-xs text-slate-400">Time-series cross-validation</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-300">
                <Clock size={14} className="text-amber-400" />
                <span>Requires historical seasonal coverage</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <Store size={17} className="text-indigo-400" /> Forecast Status
              </div>
              <p className="mt-3 text-lg font-bold text-white">
                {status.forecasts_available ? "Live" : "Fail-Closed"}
              </p>
              <p className="mt-1 text-xs text-slate-400">30, 60, 90-day projections</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-300">
                <AlertTriangle size={14} className="text-amber-400" />
                <span>Synthetic values blocked</span>
              </div>
            </div>
          </section>

          {/* Fail-closed integrity banner */}
          <section className="rounded-2xl border border-amber-700/60 bg-amber-950/25 p-6">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-lg">
              <AlertTriangle size={20} />
              Verified Price Protection Active
            </div>
            <p className="mt-2 text-sm leading-6 text-amber-100/90">
              {status.message}
            </p>
            <p className="mt-3 text-xs leading-5 text-slate-400 border-t border-amber-800/40 pt-3">
              AgriMart enforces a strict fail-closed policy: unverified sample prices, simulated mandi arrival volumes, or unproven profit estimations will never be presented as real trading signals to farmers.
            </p>
          </section>

          {/* Mandi Onboarding Directory */}
          <section className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-400" />
                  Karnataka APMC Mandi Readiness Directory
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Browse regulated agricultural market yards undergoing AGMARKNET pipeline onboarding.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="district-select" className="text-xs font-semibold text-slate-300">District:</label>
                <select
                  id="district-select"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white outline-none focus:border-emerald-500"
                >
                  {KARNATAKA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 pt-2">
              {mandisInDistrict.map((mandi) => (
                <div key={mandi} className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm text-white">{mandi}</span>
                    <span className="shrink-0 rounded-md bg-amber-950/80 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-800/50">
                      Onboarding
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    District: {selectedDistrict} · Karnataka APMC
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 text-xs text-slate-500 border-t border-slate-800/60">
              <span>Data source: AGMARKNET (Agricultural Marketing Information Network)</span>
              <a
                href="https://agmarknet.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
              >
                agmarknet.gov.in <ExternalLink size={12} />
              </a>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default MarketIntelligencePage;
export { MarketIntelligencePage };

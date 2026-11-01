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

  const districtsQuery = useQuery({
    queryKey: ["karnataka-locations", "districts"],
    queryFn: async () => {
      const response = await axiosClient.get("/locations/karnataka/", {
        params: { level: "district" },
      });
      return response.data;
    },
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  const districts = districtsQuery.data?.results ?? [];
  const activeDistrict = districts.some((district) => district.name === selectedDistrict)
    ? selectedDistrict
    : districts[0]?.name ?? "";

  const mandisQuery = useQuery({
    queryKey: ["karnataka-locations", "mandis", activeDistrict],
    queryFn: async () => {
      const response = await axiosClient.get("/locations/karnataka/", {
        params: { level: "mandi", district: activeDistrict },
      });
      return response.data;
    },
    enabled: Boolean(activeDistrict),
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  const status = statusQuery.data;
  const mandis = mandisQuery.data?.results ?? [];

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
          Market observations and 30, 60, and 90-day outlooks will be published
          only after verified AGMARKNET history is connected and forecasting
          models pass time-series backtesting.
        </p>
      </header>

      {statusQuery.isLoading && (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-300">
          <Clock size={18} className="animate-pulse text-emerald-400" />
          <span>Checking market data readiness…</span>
        </div>
      )}

      {statusQuery.isError && (
        <div role="alert" className="rounded-2xl border border-rose-800/60 bg-rose-950/30 p-5 text-sm text-rose-200">
          Market data status could not be loaded. Please check the Django API connection and retry.
          <button
            type="button"
            onClick={() => statusQuery.refetch()}
            className="ml-2 font-semibold underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {status && (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <Database size={17} className="text-teal-400" /> Primary data source
              </div>
              <p className="mt-3 text-lg font-bold text-white">{status.data_source}</p>
              <p className="mt-1 text-xs text-slate-400">Target region: {status.region}</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-300">
                {status.data_source_configured ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>API credential configured</span>
                  </>
                ) : (
                  <>
                    <Clock size={14} className="text-amber-400" />
                    <span>Data API credential not configured</span>
                  </>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Credential configuration does not confirm that historical records have been ingested.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <ShieldCheck size={17} className="text-emerald-400" /> Model validation
              </div>
              <p className="mt-3 text-lg font-bold text-white">
                {status.forecast_model_validated ? "Validated" : "Validation pending"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Out-of-sample time-series backtesting
              </p>
              <p className="mt-4 text-xs text-slate-400">
                Historical coverage and independent validation are required.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <Store size={17} className="text-indigo-400" /> Forecast status
              </div>
              <p className="mt-3 text-lg font-bold text-white">
                {status.forecasts_available ? "Available" : "Unavailable"}
              </p>
              <p className="mt-1 text-xs text-slate-400">30, 60 and 90-day outlooks</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-300">
                <AlertTriangle size={14} className="text-amber-400" />
                <span>Unvalidated values are blocked</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-amber-700/60 bg-amber-950/25 p-6">
            <div className="flex items-center gap-2 text-lg font-bold text-amber-300">
              <AlertTriangle size={20} />
              Verified price protection active
            </div>
            <p className="mt-2 text-sm leading-6 text-amber-100/90">
              {status.message}
            </p>
            <p className="mt-3 border-t border-amber-800/40 pt-3 text-xs leading-5 text-slate-400">
              No unverified sample prices, simulated arrivals, crop rankings, or profit estimates are presented as market facts.
            </p>
          </section>
        </>
      )}

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <MapPin size={18} className="text-emerald-400" />
              Karnataka APMC reference directory
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">
              District-level reference suggestions from AgriMart location data. This directory is not a live market feed and does not confirm current trading, prices, or arrivals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="district-select" className="text-xs font-semibold text-slate-300">
              District:
            </label>
            <select
              id="district-select"
              value={activeDistrict}
              onChange={(event) => setSelectedDistrict(event.target.value)}
              disabled={districtsQuery.isLoading || districts.length === 0}
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white outline-none focus:border-emerald-500 disabled:opacity-50"
            >
              {districts.map((district) => (
                <option key={district.code} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {districtsQuery.isLoading && (
          <p className="text-sm text-slate-400">Loading Karnataka districts…</p>
        )}
        {districtsQuery.isError && (
          <div role="alert" className="text-sm text-rose-300">
            District reference data could not be loaded.
            <button
              type="button"
              onClick={() => districtsQuery.refetch()}
              className="ml-2 underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}
        {mandisQuery.isLoading && (
          <p className="text-sm text-slate-400">Loading district reference entries…</p>
        )}
        {mandisQuery.isError && (
          <div role="alert" className="text-sm text-rose-300">
            APMC reference entries could not be loaded for this district.
            <button
              type="button"
              onClick={() => mandisQuery.refetch()}
              className="ml-2 underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}
        {!districtsQuery.isLoading && !districtsQuery.isError &&
          !mandisQuery.isLoading && !mandisQuery.isError && mandis.length === 0 && (
            <p className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-400">
              No APMC reference entries are available for this district.
            </p>
          )}

        {mandis.length > 0 && (
          <div className="grid gap-3 pt-2 sm:grid-cols-2 md:grid-cols-3">
            {mandis.map((mandi) => (
              <div
                key={mandi.name}
                className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4"
              >
                <span className="text-sm font-semibold text-white">{mandi.name}</span>
                <p className="mt-2 text-xs text-slate-400">
                  {activeDistrict}, Karnataka
                </p>
                <span className="mt-3 inline-block rounded-md border border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                  Reference entry
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 text-xs text-slate-500">
          <span>Live mandi prices are not currently available in AgriMart.</span>
          <a
            href="https://agmarknet.gov.in"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
          >
            AGMARKNET <ExternalLink size={12} />
          </a>
        </div>
      </section>
    </main>
  );
};

export default MarketIntelligencePage;
export { MarketIntelligencePage };

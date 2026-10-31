import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, BarChart3, Database, ShieldCheck } from "lucide-react";

import axiosClient from "../services/http/axiosClient";

const MarketIntelligencePage = () => {
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
          Market observations and 30, 60, and 90-day outlooks will be shown
          when verified AGMARKNET history is available and forecasting models
          have passed time-based backtesting.
        </p>
      </header>

      {statusQuery.isLoading && (
        <p className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-300">
          Checking market data readiness…
        </p>
      )}

      {statusQuery.isError && (
        <p role="alert" className="rounded-2xl border border-rose-800/60 bg-rose-950/30 p-5 text-sm text-rose-200">
          Market data status could not be loaded. Check the Django API connection and try again.
        </p>
      )}

      {status && (
        <>
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <Database size={17} /> Historical data source
              </div>
              <p className="mt-3 text-lg font-bold text-white">{status.data_source}</p>
              <p className="mt-2 text-xs text-slate-400">
                Karnataka-only initial rollout
              </p>
              <p className="mt-3 text-sm text-slate-300">
                {status.data_source_configured ? "API credential configured" : "API credential not configured"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <ShieldCheck size={17} /> Model validation
              </div>
              <p className="mt-3 text-lg font-bold text-white">
                {status.forecast_model_validated ? "Validated" : "Validation pending"}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Historical coverage and out-of-sample backtesting are required.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-amber-700/60 bg-amber-950/25 p-5">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <AlertTriangle size={18} />
              Forecasts are not yet available
            </div>
            <p className="mt-2 text-sm leading-6 text-amber-100/80">
              {status.message}
            </p>
            <p className="mt-3 text-xs text-slate-400">
              No sample mandi prices, predicted prices, crop rankings, or profit
              estimates are presented as live market information.
            </p>
          </section>
        </>
      )}
    </main>
  );
};

export default MarketIntelligencePage;
export { MarketIntelligencePage };

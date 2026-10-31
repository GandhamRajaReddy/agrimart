import { useQuery } from "@tanstack/react-query";
import { Activity, Database, ShieldAlert } from "lucide-react";

import axiosClient from "../../../services/http/axiosClient";

const StatusCard = ({ title, status, detail }) => (
  <section className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
    <h2 className="font-bold text-white">{title}</h2>
    <p className="mt-3 text-lg font-extrabold text-emerald-300">{status}</p>
    <p className="mt-2 text-sm text-slate-400">{detail}</p>
  </section>
);

export const AdminDashboardPage = () => {
  const backendQuery = useQuery({
    queryKey: ["admin", "backend-readiness"],
    queryFn: async () => (await axiosClient.get("/ready/")).data,
    refetchInterval: 30_000,
    retry: 1,
  });
  const marketQuery = useQuery({
    queryKey: ["admin", "market-readiness"],
    queryFn: async () => (await axiosClient.get("/market/status/")).data,
    refetchInterval: 60_000,
    retry: 1,
  });

  return (
    <main className="mx-auto max-w-6xl space-y-7 px-4 py-10">
      <header>
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
          <Activity size={18} /> Platform operations
        </div>
        <h1 className="mt-2 text-3xl font-extrabold text-white">AgriMart administration</h1>
        <p className="mt-2 text-sm text-slate-400">
          Live service readiness from configured APIs. Business metrics are shown only when backed by persisted records.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <StatusCard
          title="Django API and database"
          status={backendQuery.isLoading ? "Checking…" : backendQuery.data?.status || (backendQuery.isError ? "Unavailable" : "Unknown")}
          detail={backendQuery.data?.database ? `Database: ${backendQuery.data.database}` : backendQuery.error?.message || "Waiting for readiness response."}
        />
        <StatusCard
          title="Karnataka market intelligence"
          status={marketQuery.isLoading ? "Checking…" : marketQuery.data?.forecasts_available ? "Available" : "Not ready"}
          detail={marketQuery.data?.message || marketQuery.error?.message || "Waiting for market readiness response."}
        />
      </section>

      {(backendQuery.isError || marketQuery.isError) && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-amber-700/50 bg-amber-950/20 p-5 text-sm text-amber-100">
          <ShieldAlert size={20} className="mt-0.5 shrink-0" />
          <p>At least one service did not return a readiness response. Check the backend and its logs.</p>
        </div>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <div className="flex items-center gap-2 font-bold text-white">
          <Database size={18} /> Data integrity
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Revenue, user counts, procurement bids, AI accuracy, and service latency are not fabricated in this dashboard.
          Connect the relevant persisted reporting endpoints before publishing operational KPIs.
        </p>
      </section>
    </main>
  );
};

export default AdminDashboardPage;

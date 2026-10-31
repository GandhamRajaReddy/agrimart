import { AlertTriangle, Handshake, MapPin } from "lucide-react";

const ProcurementPage = () => (
  <main className="mx-auto max-w-5xl space-y-7 px-4 py-10">
    <header className="rounded-3xl border border-teal-800/60 bg-gradient-to-br from-teal-950 to-slate-950 p-7">
      <div className="flex items-center gap-2 text-sm font-bold text-teal-300">
        <Handshake size={18} />
        Karnataka produce marketplace
      </div>
      <h1 className="mt-3 text-3xl font-extrabold text-white">
        Sell produce and connect with buyers
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
        Farmer listings, buyer bids, and procurement orders will be enabled
        after the procurement API and verification workflow are implemented.
      </p>
    </header>

    <section className="rounded-2xl border border-amber-700/60 bg-amber-950/25 p-5">
      <div className="flex items-center gap-2 font-bold text-amber-300">
        <AlertTriangle size={18} />
        Procurement marketplace is not connected yet
      </div>
      <p className="mt-2 text-sm leading-6 text-amber-100/80">
        There are currently no verified buyer listings or live bids available
        from the backend. This page will not display fabricated buyer names,
        offer prices, guaranteed pickup times, or payment promises.
      </p>
      <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <MapPin size={14} />
        Initial service area: Karnataka
      </p>
    </section>
  </main>
);

export default ProcurementPage;
export { ProcurementPage };

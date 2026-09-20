import { ArrowRight, BarChart3, Handshake, MapPin, Tractor } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../../../components/common/Button";

const ProcurementCTA = () => (
  <section className="content-container pb-20 sm:pb-24">
    <div className="grid gap-5 lg:grid-cols-2">
      <article className="relative overflow-hidden rounded-[2rem] bg-[#d9e7c7] p-7 text-[#163124] sm:p-10">
        <div className="absolute -right-15 -top-12 h-48 w-48 rounded-full border-[28px] border-[#7faa55]/25" />
        <Handshake className="relative h-8 w-8 text-[#1d4b34]" aria-hidden="true" />
        <p className="eyebrow mt-7">Farmer procurement</p>
        <h2 className="display-font mt-3 max-w-md text-4xl font-semibold leading-[0.98] tracking-[-0.045em]">When harvest is ready, buyers should be too.</h2>
        <p className="mt-4 max-w-md text-sm leading-6 text-[#45604f]">List produce, compare interest, and move toward a direct buyer relationship from one dedicated marketplace.</p>
        <Link to="/procurement" className="mt-7 inline-flex"><Button icon={Tractor}>Sell your produce <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button></Link>
      </article>

      <article className="relative overflow-hidden rounded-[2rem] bg-[#f8e7c6] p-7 text-[#163124] sm:p-10">
        <div className="absolute bottom-0 right-0 h-44 w-44 rounded-tl-full bg-[#d68b35]/15" />
        <BarChart3 className="relative h-8 w-8 text-[#9a5e1f]" aria-hidden="true" />
        <p className="eyebrow mt-7 !text-[#9a5e1f]">Market intelligence</p>
        <h2 className="display-font mt-3 max-w-md text-4xl font-semibold leading-[0.98] tracking-[-0.045em]">Plan with the market, not just the calendar.</h2>
        <p className="mt-4 max-w-md text-sm leading-6 text-[#6e522d]">Follow mandi prices, compare crop movement, and begin every season with more context.</p>
        <Link to="/market-intelligence" className="mt-7 inline-flex"><Button variant="secondary" icon={MapPin}>View mandi intelligence <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button></Link>
      </article>
    </div>
  </section>
);

export default ProcurementCTA;

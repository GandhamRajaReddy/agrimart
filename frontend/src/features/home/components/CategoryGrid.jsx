import { ArrowRight, Droplets, Leaf, ShieldCheck, Sprout, Sun, Tractor } from "lucide-react";
import { Link } from "react-router-dom";

const icons = {
  sprout: Sprout,
  leaf: Leaf,
  shield: ShieldCheck,
  droplet: Droplets,
  tractor: Tractor,
  sun: Sun,
};

const CategoryGrid = ({ categories }) => (
  <section className="content-container py-20 sm:py-24">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="eyebrow">Start with what your farm needs</p>
        <h2 className="display-font mt-3 text-4xl font-semibold tracking-[-0.045em] text-[#163124] sm:text-5xl">Good inputs make calmer seasons.</h2>
      </div>
      <Link to="/catalog" className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#1d4b34] transition hover:text-[#5d8f3d]">
        Browse all inputs <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>

    <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const Icon = icons[category.icon] || Sprout;
        return (
          <Link
            key={category.id}
            to={category.to}
            className="group flex min-h-37 items-center gap-4 rounded-3xl border border-[#1d4b34]/10 bg-white p-5 shadow-[0_10px_26px_rgba(22,49,36,0.055)] transition duration-300 hover:-translate-y-1 hover:border-[#5d8f3d]/35 hover:shadow-[var(--shadow-lifted)]"
          >
            <span className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-[#eaf0e7] text-[#1d4b34] transition duration-300 group-hover:scale-105 group-hover:bg-[#1d4b34] group-hover:text-[#d9e7c7]">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center justify-between gap-3 text-base font-extrabold text-[#163124]">
                {category.name}
                <ArrowRight className="h-4 w-4 shrink-0 text-[#5d8f3d] transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
              <span className="mt-1 block text-sm leading-5 text-[#587062]">{category.description}</span>
            </span>
          </Link>
        );
      })}
    </div>
  </section>
);

export default CategoryGrid;

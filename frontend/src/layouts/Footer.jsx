import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, Phone } from "lucide-react";

import { ROUTES } from "../config/routes";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Farm inputs", to: ROUTES.catalog },
      { label: "Crop planner", to: ROUTES.cropPlanner },
      { label: "Mandi intelligence", to: ROUTES.marketIntelligence },
      { label: "Sell produce", to: ROUTES.procurement },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Crop health scan", to: ROUTES.aiDetection },
      { label: "Contact support", href: "tel:18001801551" },
      { label: "Farmer onboarding", to: ROUTES.register },
      { label: "Sign in", to: ROUTES.login },
    ],
  },
];

export const Footer = () => (
  <footer className="mt-auto bg-[#102b1d] text-[#eaf0e7]">
    <div className="content-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr] lg:gap-16">
      <div>
        <Link to={ROUTES.home} className="display-font text-3xl font-bold tracking-[-0.04em] text-white">
          AgriMart
        </Link>
        <p className="mt-3 max-w-sm text-sm leading-6 text-[#c5d3c2]">
          Practical farm commerce and decision tools—built to help growers buy better, plan earlier, and sell with confidence.
        </p>
        <a href="tel:18001801551" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#d9e7c7] hover:text-white">
          <Phone className="h-4 w-4" aria-hidden="true" />
          Kisan support: 1800-180-1551
        </a>
      </div>

      {footerGroups.map((group) => (
        <div key={group.title}>
          <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8fb56d]">{group.title}</h2>
          <ul className="mt-4 space-y-3">
            {group.links.map((link) => (
              <li key={link.label}>
                {link.to ? (
                  <Link className="text-sm text-[#d7e0d4] transition hover:text-white" to={link.to}>
                    {link.label}
                  </Link>
                ) : (
                  <a className="text-sm text-[#d7e0d4] transition hover:text-white" href={link.href}>
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-white/10">
      <div className="content-container flex flex-col gap-3 py-5 text-xs text-[#a9bda7] sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} AgriMart. Built for a more resilient farm economy.</p>
        <div className="flex items-center gap-1.5">
          <span>Made with care for growers</span>
          <Heart className="h-3.5 w-3.5 fill-[#d68b35] text-[#d68b35]" aria-hidden="true" />
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
      </div>
    </div>
  </footer>
);

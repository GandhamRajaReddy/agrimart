import { ArrowRight, BarChart3, CircleCheck, Sprout } from "lucide-react";
import { Link } from "react-router-dom";

import bannerImage from "../../../assets/images/banners/background_image.png";
import Button from "../../../components/common/Button";

const HeroSection = ({ hero }) => (
  <section className="content-container pt-6 sm:pt-8">
    <div className="relative isolate min-h-[35rem] overflow-hidden rounded-[2rem] bg-[#102b1d] px-6 py-12 text-white shadow-[0_28px_70px_rgba(16,43,29,0.3)] sm:px-10 lg:min-h-[39rem] lg:px-16 lg:py-16">
      <img
        src={bannerImage}
        alt="Sunrise over cultivated farmland"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(11,39,25,0.97)_0%,rgba(16,55,34,0.86)_42%,rgba(18,54,33,0.31)_100%)]" />
      <div className="absolute -left-20 bottom-0 -z-10 h-64 w-64 rounded-full bg-[#9fc85e]/30 blur-3xl" />

      <div className="flex min-h-[27rem] max-w-2xl flex-col justify-between lg:min-h-[31rem]">
        <div>
          <p className="animate-enter inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-extrabold tracking-wide text-[#edf4de] backdrop-blur">
            <Sprout className="h-3.5 w-3.5 text-[#b8da78]" aria-hidden="true" />
            {hero.eyebrow}
          </p>
          <h1 className="animate-enter animate-enter-delay-1 display-font mt-6 max-w-xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
            {hero.title}
          </h1>
          <p className="animate-enter animate-enter-delay-2 mt-6 max-w-lg text-base leading-7 text-[#e2eddb] sm:text-lg">
            {hero.description}
          </p>
          <div className="animate-enter animate-enter-delay-2 mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={hero.primaryAction.to}>
              <Button size="lg" icon={ArrowRight} className="w-full bg-[#d9e7c7] text-[#163124] hover:bg-white sm:w-auto">
                {hero.primaryAction.label}
              </Button>
            </Link>
            <Link to={hero.secondaryAction.to}>
              <Button size="lg" variant="glass" icon={BarChart3} className="w-full sm:w-auto">
                {hero.secondaryAction.label}
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 grid max-w-xl grid-cols-3 divide-x divide-white/18 border-y border-white/18 py-4 sm:mt-10">
          {hero.metrics.map((metric) => (
            <div key={metric.label} className="px-3 first:pl-0 sm:px-5">
              <p className="display-font text-2xl font-semibold text-white sm:text-3xl">{metric.value}</p>
              <p className="mt-1 text-[0.63rem] font-bold uppercase tracking-[0.1em] text-[#c7d9c2] sm:text-[0.68rem]">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-5 right-5 hidden max-w-64 rounded-2xl border border-white/15 bg-[#143a27]/85 p-4 text-sm shadow-xl backdrop-blur md:block">
        <div className="flex items-center gap-2 font-extrabold text-[#eaf4d9]">
          <span className="animate-pulse-ring h-2 w-2 rounded-full bg-[#b8da78]" />
          Today’s field note
        </div>
        <p className="mt-2 leading-5 text-[#d2e0cc]">Compare input prices and local mandi movement before you commit.</p>
        <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#c5e188]">
          <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Decisions, not noise
        </p>
      </div>
    </div>
  </section>
);

export default HeroSection;

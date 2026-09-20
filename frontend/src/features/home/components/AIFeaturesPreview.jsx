import { ArrowRight, Bot, ScanLine, ShieldCheck, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../../../components/common/Button";

const capabilities = [
  { icon: ScanLine, title: "Crop health scan", detail: "Turn a field image into a clearer next action." },
  { icon: TrendingUp, title: "Market movement", detail: "Compare local prices before planning a crop." },
  { icon: ShieldCheck, title: "Decision support", detail: "Keep your farm choices organised in one place." },
];

const AIFeaturesPreview = ({ onOpenAiAssistant }) => (
  <section className="content-container py-20 sm:py-24">
    <div className="grid overflow-hidden rounded-[2rem] bg-[#163124] text-white shadow-[0_24px_60px_rgba(16,43,29,0.22)] lg:grid-cols-[0.92fr_1.08fr]">
      <div className="relative min-h-80 overflow-hidden border-b border-white/10 p-7 sm:p-10 lg:min-h-full lg:border-b-0 lg:border-r">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#7daa53]/28 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-[#d68b35]/25 blur-3xl" />
        <div className="relative mx-auto mt-2 max-w-sm rounded-[1.7rem] border border-white/16 bg-[#0f2a1c]/70 p-4 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-bold text-[#cee4c9]">
            <span className="flex items-center gap-2"><span className="animate-pulse-ring h-2 w-2 rounded-full bg-[#b8da78]" />Field assistant</span>
            <span>Live preview</span>
          </div>
          <div className="mt-4 rounded-2xl border border-[#b8da78]/20 bg-[linear-gradient(135deg,#2c683f_0%,#6e9a4a_45%,#bad278_46%,#466e34_100%)] p-4">
            <div className="grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-white/35 bg-[#153b28]/25">
              <ScanLine className="h-12 w-12 text-white/90" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-4 rounded-xl bg-white/8 p-3">
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-[#b8da78]">Crop scan ready</p>
            <p className="mt-1 text-sm font-bold">Upload a leaf image to begin</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><span className="block h-full w-3/4 rounded-full bg-[#b8da78]" /></div>
          </div>
        </div>
      </div>

      <div className="p-7 sm:p-10 lg:p-14">
        <p className="eyebrow !text-[#b8da78]">A practical intelligence layer</p>
        <h2 className="display-font mt-4 max-w-xl text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl">Technology that stays close to the field.</h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-[#c8d8c6] sm:text-base">AgriMart will connect commerce with crop, market, and farm-context tools—without making your workflow feel complicated.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, detail }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <Icon className="h-5 w-5 text-[#b8da78]" aria-hidden="true" />
              <h3 className="mt-4 text-sm font-extrabold text-white">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-[#b7cbb5]">{detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/ai-detection"><Button variant="glass" icon={ScanLine} className="w-full sm:w-auto">Explore crop scan</Button></Link>
          <Button variant="ghost" icon={Bot} className="w-full !text-[#d9e7c7] hover:!bg-white/10 hover:!text-white sm:w-auto" onClick={onOpenAiAssistant}>
            Ask Agri AI <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default AIFeaturesPreview;

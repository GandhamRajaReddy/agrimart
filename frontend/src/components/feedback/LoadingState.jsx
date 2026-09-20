import { LoaderCircle } from "lucide-react";

const LoadingState = ({ label = "Loading…", className = "" }) => (
  <div
    className={`flex min-h-40 flex-col items-center justify-center gap-3 rounded-3xl border border-[#1d4b34]/10 bg-white/70 p-8 text-center ${className}`}
    role="status"
  >
    <LoaderCircle className="h-7 w-7 animate-spin text-[#5d8f3d]" aria-hidden="true" />
    <p className="text-sm font-semibold text-[#587062]">{label}</p>
  </div>
);

export default LoadingState;

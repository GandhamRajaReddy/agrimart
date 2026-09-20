import { SearchX } from "lucide-react";

import Button from "../common/Button";

const EmptyState = ({
  icon: Icon = SearchX,
  title = "Nothing here yet",
  message = "Try adjusting your filters or come back soon.",
  actionLabel,
  onAction,
  className = "",
}) => (
  <section className={`flex min-h-52 flex-col items-center justify-center rounded-3xl border border-dashed border-[#1d4b34]/20 bg-white/55 p-8 text-center ${className}`}>
    <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf0e7] text-[#1d4b34]">
      <Icon className="h-6 w-6" aria-hidden="true" />
    </span>
    <h2 className="display-font text-2xl font-semibold text-[#163124]">{title}</h2>
    <p className="mt-2 max-w-md text-sm leading-6 text-[#587062]">{message}</p>
    {actionLabel && onAction && (
      <Button className="mt-5" variant="secondary" size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </section>
);

export default EmptyState;

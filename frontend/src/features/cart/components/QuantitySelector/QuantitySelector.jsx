import React from "react";
import { Plus, Minus } from "lucide-react";

export const QuantitySelector = ({ quantity = 1, onDecrease, onIncrease, disabled = false, min = 1, max = 99 }) => {
  return (
    <div className="inline-flex items-center rounded-xl border border-[#1d4b34]/15 bg-white shadow-sm">
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabled || quantity <= min}
        className="grid h-8 w-8 place-items-center text-[#1d4b34] transition hover:bg-[#eaf0e7] disabled:pointer-events-none disabled:opacity-40 rounded-l-xl"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <span className="min-w-8 text-center text-xs font-extrabold text-[#163124]">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={disabled || quantity >= max}
        className="grid h-8 w-8 place-items-center text-[#1d4b34] transition hover:bg-[#eaf0e7] disabled:pointer-events-none disabled:opacity-40 rounded-r-xl"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default QuantitySelector;

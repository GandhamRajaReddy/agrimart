import React from "react";
import { Trash2 } from "lucide-react";
import QuantitySelector from "../QuantitySelector/QuantitySelector";

export const CartItem = ({ item, onUpdateQuantity, onRemove, isUpdating = false }) => {
  const product = item.product || item;
  const name = product.name || "Agricultural Input Product";
  const price = product.price || 0;
  const image = product.image_url || product.image || "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=200&auto=format&fit=crop&q=80";
  const unit = product.unit || "unit";

  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white border border-[#1d4b34]/10 shadow-sm transition hover:border-[#1d4b34]/25">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-[#163124] line-clamp-1">{name}</h4>
            <p className="text-xs text-[#587062]">{unit} • ₹{price}</p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={isUpdating}
            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between pt-2">
          <QuantitySelector
            quantity={item.quantity}
            onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
            onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={isUpdating}
          />
          <span className="text-sm font-extrabold text-[#1d4b34]">
            ₹{(price * item.quantity).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

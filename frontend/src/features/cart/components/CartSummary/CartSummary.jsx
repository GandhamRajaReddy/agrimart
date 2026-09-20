import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import Button from "../../../../components/common/Button";

export const CartSummary = ({ subtotal = 0, deliveryFee = 0, total = 0, onCheckout }) => {
  const isFreeDelivery = deliveryFee === 0 && subtotal > 0;

  return (
    <div className="rounded-3xl border border-[#1d4b34]/15 bg-white p-6 shadow-md space-y-4">
      <h3 className="text-lg font-extrabold text-[#163124]">Order Summary</h3>

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-[#587062]">
          <span>Subtotal</span>
          <span className="font-bold text-[#163124]">₹{subtotal.toLocaleString("en-IN")}</span>
        </div>

        <div className="flex justify-between text-[#587062]">
          <span className="flex items-center gap-1.5">
            <Truck className="h-4 w-4 text-[#5d8f3d]" />
            Mandi Express Delivery
          </span>
          <span className="font-bold text-[#163124]">
            {isFreeDelivery ? <span className="text-[#5d8f3d] font-black">FREE</span> : `₹${deliveryFee}`}
          </span>
        </div>

        <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-black text-[#163124]">
          <span>Total Payable</span>
          <span className="text-xl text-[#1d4b34]">₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-[#eaf0e7] p-3 text-xs text-[#1d4b34] flex items-center gap-2 font-medium">
        <ShieldCheck className="h-4 w-4 text-[#5d8f3d] shrink-0" />
        <span>Direct Mandi Quality Guarantee & 100% Secure Checkout</span>
      </div>

      <Link to="/checkout" className="block">
        <Button variant="primary" size="lg" fullWidth className="gap-2 font-bold text-base shadow-lg">
          Proceed to Checkout <ArrowRight className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
};

export default CartSummary;

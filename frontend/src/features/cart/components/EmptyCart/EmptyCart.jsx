import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Button from "../../../../components/common/Button";

export const EmptyCart = ({ onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#eaf0e7] text-[#1d4b34] shadow-inner">
        <ShoppingBag className="h-8 w-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-extrabold text-[#163124]">Your Cart is Empty</h3>
        <p className="text-xs text-[#587062] max-w-xs mx-auto">
          Explore certified seeds, bio-fertilizers, pesticides & tools with direct Mandi delivery.
        </p>
      </div>

      <Link to="/catalog" onClick={onClose}>
        <Button variant="primary" size="md" className="gap-2 font-bold">
          Explore Kisan Store <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};

export default EmptyCart;

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { toggleCartDrawer } from "../../../store/cartSlice";
import { useCart } from "../hooks/useCart";
import CartItem from "./CartItem/CartItem";
import EmptyCart from "./EmptyCart/EmptyCart";
import CartSummary from "./CartSummary/CartSummary";

export const CartDrawer = () => {
  const dispatch = useDispatch();
  const isCartOpen = useSelector((state) => state.cart.isCartOpen);
  const { items, subtotal, deliveryFee, total, itemCount, updateQuantity, removeFromCart, clearCart, isUpdatingQuantity, isRemovingFromCart } = useCart();

  if (!isCartOpen) return null;

  const handleClose = () => dispatch(toggleCartDrawer(false));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={handleClose} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-[#f6f5ef] border-l border-[#1d4b34]/15 shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1d4b34]/10 bg-white">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#1d4b34] text-white">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#163124]">My Shopping Cart</h3>
                <p className="text-xs text-[#587062]">{itemCount} items</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <EmptyCart onClose={handleClose} />
            ) : (
              <>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-xs font-bold text-[#587062] uppercase tracking-wider">Cart Items</span>
                  <button
                    type="button"
                    onClick={() => clearCart()}
                    className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Clear Cart
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={(id, qty) => updateQuantity({ itemId: id, quantity: qty })}
                      onRemove={(id) => removeFromCart(id)}
                      isUpdating={isUpdatingQuantity || isRemovingFromCart}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#1d4b34]/10">
              <CartSummary
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                onCheckout={handleClose}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;

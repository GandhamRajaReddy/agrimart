import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { toggleCartDrawer } from '../store/cartSlice';
import { useCart } from '../features/cart/hooks/useCart';

export const CartDrawer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.cart.isCartOpen);
  const {
    items,
    subtotal,
    deliveryFee,
    total,
    itemCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    isUpdatingQuantity,
    isRemovingFromCart,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay Backdrop */}
      <div 
        onClick={() => dispatch(toggleCartDrawer(false))}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Kisan Shopping Basket</h3>
                <p className="text-xs text-slate-400">{itemCount} items selected for delivery</p>
              </div>
            </div>
            <button
              onClick={() => dispatch(toggleCartDrawer(false))}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-300">Your basket is empty</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Explore certified seeds, pesticides, and machinery tailored for your crops.</p>
                </div>
                <Link
                  to="/catalog"
                  onClick={() => dispatch(toggleCartDrawer(false))}
                  className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-950"
                >
                  Explore Store Products
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const product = item.product || {};
                return (
                  <div 
                    key={item.id} 
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex gap-4"
                  >
                    <img 
                      src={product.image_url || product.image || "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=200&auto=format&fit=crop&q=80"} 
                      alt={product.name || "Product"} 
                      className="w-20 h-20 rounded-xl object-cover border border-slate-800 bg-slate-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                        {product.category_name || "Agri Input"}
                      </span>
                      <h4 className="font-bold text-slate-100 text-sm truncate">{product.name}</h4>
                      <p className="text-xs text-slate-400">{product.unit || "unit"} • ₹{product.price}</p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-slate-800">
                          <button
                            disabled={isUpdatingQuantity || item.quantity <= 1}
                            onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity - 1 })}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-40"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-200">{item.quantity}</span>
                          <button
                            disabled={isUpdatingQuantity}
                            onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity + 1 })}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-40"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-extrabold text-emerald-400">₹{(product.price * item.quantity).toLocaleString('en-IN')}</span>
                          <button
                            disabled={isRemovingFromCart}
                            onClick={() => removeFromCart(item.id)}
                            className="block text-[11px] text-slate-500 hover:text-rose-400 ml-auto mt-1"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline mr-0.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950 space-y-3">
              <div className="flex justify-between items-center text-xs pb-1">
                <span className="text-slate-400">Manage Cart</span>
                <button
                  onClick={() => clearCart()}
                  className="text-rose-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All Items
                </button>
              </div>
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-200">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Farm Doorstep Delivery</span>
                  <span className={deliveryFee === 0 ? "text-emerald-400 font-bold" : "text-slate-200"}>
                    {deliveryFee === 0 ? 'FREE (Orders > ₹1000)' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-slate-100">
                  <span>Total Payable</span>
                  <span className="text-emerald-400 text-lg">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/30 flex items-center gap-2 text-[11px] text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Genuine Certified Batch with Kisan Moneyback Guarantee</span>
              </div>

              <Link
                to="/checkout"
                onClick={() => dispatch(toggleCartDrawer(false))}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-950 flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Kisan Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

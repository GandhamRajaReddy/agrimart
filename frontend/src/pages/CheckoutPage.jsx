import React, { useState } from 'react';
import { Link,  } from 'react-router-dom';
import { 
  CreditCard, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  Loader2
} from 'lucide-react';
import useCart from '../features/cart/hooks/useCart';
import useCheckout from '../features/checkout/hooks/useCheckout';
import { useAuth } from '../features/auth/hooks/useAuth';

export const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, subtotal, deliveryFee, total, itemCount } = useCart();
  const { placeOrder, isPlacingOrder } = useCheckout();

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [createdOrder, setCreatedOrder] = useState(null);

  // Address fields state
  const [fullName, setFullName] = useState([user?.first_name, user?.last_name].filter(Boolean).join(' '));
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [district, setDistrict] = useState(user?.district || '');
  const [state, setState] = useState(user?.state || 'Karnataka');
  const [pincode, setPincode] = useState('');

  const handlePlaceOrder = async () => {
    if (!fullName.trim() || !phone.trim() || !addressLine1.trim() || !district.trim() || !state.trim() || !pincode.trim()) {
      window.alert('Complete all delivery address fields before placing the order.');
      return;
    }
    if (paymentMethod !== 'COD') {
      window.alert('Online payment is not enabled yet. Select Cash on Delivery.');
      return;
    }
    try {
      const payload = {
        shipping_address: {
          full_name: fullName,
          phone: phone,
          address_line1: addressLine1,
          district: district,
          state: state,
          pincode: pincode,
        },
        payment_method: paymentMethod,
      };

      const orderData = await placeOrder(payload);
      setCreatedOrder(orderData);
    } catch (err) {
      console.error('Failed to place order:', err);
      alert(err.response?.data?.detail || 'Order placement failed. Please try again.');
    }
  };

  if (createdOrder) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">Order Confirmed!</span>
          <h1 className="text-3xl font-extrabold text-white">Dhanyawad, {createdOrder.shipping_address?.full_name || 'Farmer Brother'}!</h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto">
            Your AgriMart certified order <strong>#{createdOrder.order_number}</strong> has been placed. Doorstep delivery will arrive in 2 business days.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2 text-left max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-slate-400">Total Amount:</span>
            <span className="font-extrabold text-emerald-400">₹{createdOrder.total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Payment Mode:</span>
            <span className="font-bold text-white uppercase">{createdOrder.payment_method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Delivery Address:</span>
            <span className="text-slate-200">
              {createdOrder.shipping_address?.address_line1}, {createdOrder.shipping_address?.district}, {createdOrder.shipping_address?.state}
            </span>
          </div>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <Link
            to="/orders"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            View My Orders
          </Link>
          <Link
            to="/catalog"
            className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-xs hover:bg-slate-800 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/catalog" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Kisan Checkout</h1>
          <p className="text-xs text-slate-400">Review your certified agricultural inputs & delivery details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery Address & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          {/* Address Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>Farm Doorstep Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-slate-400 block mb-1">Address / Village / Farm</label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">District / Mandi</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">PIN Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\\D/g, '').slice(0, 6))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <span>Select Payment Method</span>
            </h3>

            <div className="space-y-3">
              <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'COD' ? 'bg-emerald-950/40 border-emerald-500/60 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-sm block">Cash on Delivery (COD)</span>
                    <span className="text-xs text-slate-400">Pay cash upon batch inspection at your farm</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400">Popular</span>
              </label>

              <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'ONLINE' ? 'bg-emerald-950/40 border-emerald-500/60 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="ONLINE"
                    checked={paymentMethod === 'ONLINE'}
                    onChange={() => setPaymentMethod('ONLINE')}
                    disabled
                    className="accent-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-sm block">Online Payment (not available)</span>
                    <span className="text-xs text-slate-400">Payment gateway integration is pending.</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="font-extrabold text-slate-100 text-base">Order Summary ({itemCount} items)</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-xs border-b border-slate-800/60 pb-3">
                  <div className="flex items-center gap-3">
                    <img src={item.product?.image_url || '/placeholder.png'} alt={item.product?.name} className="w-12 h-12 rounded-xl object-cover border border-slate-800" />
                    <div>
                      <span className="font-bold text-slate-200 block truncate max-w-[160px]">{item.product?.name}</span>
                      <span className="text-slate-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-400">₹{item.line_total}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-white">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-emerald-400">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Total Amount</span>
                <span className="text-emerald-400 text-xl">₹{total}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || items.length === 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-950 transition-all flex items-center justify-center gap-2"
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <span>Confirm Order & Deliver to Farm</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

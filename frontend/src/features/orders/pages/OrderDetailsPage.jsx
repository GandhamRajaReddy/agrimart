import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useOrderDetail } from '../hooks/useOrders';

export const OrderDetailsPage = () => {
  const { id } = useParams();
  const { order, isLoading, isError, cancelOrder, isCancelling } = useOrderDetail(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        <span>Loading order invoice details...</span>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-md mx-auto py-12 text-center text-rose-400 space-y-4">
        <AlertCircle className="w-10 h-10 mx-auto" />
        <p>Order not found or access denied.</p>
        <Link to="/orders" className="px-4 py-2 bg-slate-900 border border-slate-700 text-slate-200 font-bold rounded-xl text-xs inline-block">
          Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link to="/orders" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Order #{order.order_number}</h1>
          <p className="text-xs text-slate-400">Placed on {new Date(order.created_at).toLocaleString()}</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        {/* Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Status</span>
            <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-extrabold">
              {order.status}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Payment Status</span>
            <span className="text-xs font-bold text-white uppercase">{order.payment_method} ({order.payment_status})</span>
          </div>
          {['PENDING', 'CONFIRMED'].includes(order.status) && (
            <button
              onClick={cancelOrder}
              disabled={isCancelling}
              className="px-4 py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-xs rounded-xl transition-all disabled:opacity-50"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>

        {/* Shipping Address */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-200 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Delivery Address</span>
          </h3>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-white">{order.shipping_address?.full_name}</div>
            <div>Phone: {order.shipping_address?.phone}</div>
            <div>{order.shipping_address?.address_line1}</div>
            <div>{order.shipping_address?.district}, {order.shipping_address?.state} - {order.shipping_address?.pincode}</div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-slate-200 text-sm">Ordered Items</h3>
          <div className="space-y-2">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-white block">{item.product_name}</span>
                  <span className="text-slate-400">Qty: {item.quantity} × ₹{item.unit_price}</span>
                </div>
                <span className="font-extrabold text-emerald-400">₹{item.line_total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-white font-bold">₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="text-emerald-400 font-bold">₹{order.delivery_fee}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
            <span>Grand Total</span>
            <span className="text-emerald-400 text-xl">₹{order.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

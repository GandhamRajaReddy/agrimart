import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';

export const OrdersPage = () => {
  const { orders, count, isLoading, isError, cancelOrder, isCancelling } = useOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        <span>Loading your orders...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto py-12 text-center text-rose-400 space-y-4">
        <p>Failed to load orders. Please make sure you are logged in.</p>
        <Link to="/login" className="px-4 py-2 bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs inline-block">
          Go to Login
        </Link>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">No Orders Found</h2>
          <p className="text-xs text-slate-400">You haven't placed any AgriMart orders yet.</p>
        </div>
        <Link
          to="/catalog"
          className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all"
        >
          Explore Agri Products
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">CONFIRMED</span>;
      case 'SHIPPED':
        return <span className="px-2.5 py-1 rounded-full bg-blue-950 border border-blue-500/40 text-blue-400 text-[10px] font-bold">SHIPPED</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-300 text-[10px] font-bold">DELIVERED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full bg-rose-950 border border-rose-500/40 text-rose-400 text-[10px] font-bold">CANCELLED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-400 text-[10px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">My Orders</h1>
          <p className="text-xs text-slate-400">Track and manage your AgriMart farm orders.</p>
        </div>
        <span className="text-xs text-slate-400 font-semibold">{count} Total Orders</span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">Order #{order.order_number}</span>
                <div className="text-xs text-slate-500">Placed on {new Date(order.created_at).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(order.status)}
                <span className="text-lg font-extrabold text-emerald-400">₹{order.total}</span>
              </div>
            </div>

            {/* Items snippet */}
            <div className="space-y-2">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-xs text-slate-300">
                  <span>{item.quantity} x {item.product_name}</span>
                  <span className="font-bold text-slate-400">₹{item.line_total}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 text-xs border-t border-slate-800/60">
              <span className="text-slate-400">Payment: <strong className="text-white uppercase">{order.payment_method}</strong> ({order.payment_status})</span>
              <div className="flex items-center gap-3">
                {['PENDING', 'CONFIRMED'].includes(order.status) && (
                  <button
                    onClick={() => cancelOrder(order.id)}
                    disabled={isCancelling}
                    className="text-rose-400 hover:text-rose-300 font-semibold transition-colors disabled:opacity-50"
                  >
                    Cancel Order
                  </button>
                )}
                <Link
                  to={`/orders/${order.id}`}
                  className="flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;

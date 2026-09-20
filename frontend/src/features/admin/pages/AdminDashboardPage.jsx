import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  Truck, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Layers, 
  Database,
  ArrowUpRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const stats = [
    { label: 'Total E-Commerce Revenue', value: '₹48,25,400', change: '+18.4%', isUp: true, icon: ShoppingBag, color: 'emerald' },
    { label: 'Active Farmer Procurement Bids', value: '142 Auctions', change: '+24.1%', isUp: true, icon: Truck, color: 'teal' },
    { label: 'AI Crop Scans Processed', value: '18,420 Scans', change: '96.2% Accuracy', isUp: true, icon: Cpu, color: 'amber' },
    { label: 'Mandi Storage Data Sync', value: '54 Mandis Active', change: 'Live Realtime', isUp: true, icon: Database, color: 'cyan' },
  ];

  const recentOrders = [
    { id: 'ORD-9081', farmer: 'Rajesh Kumar Patel', items: 'Bio-Shield Fungicide x 2', amount: '₹1,298', status: 'Delivered', date: '16 Sep 2026' },
    { id: 'ORD-9082', farmer: 'Sukhwinder Singh', items: 'Kisan Shakti BT-II Cotton Seeds x 4', amount: '₹3,560', status: 'Processing', date: '16 Sep 2026' },
    { id: 'ORD-9083', farmer: 'Rameshwar Pawar', items: 'Battery Knapsack Sprayer 16L', amount: '₹2,850', status: 'Shipped', date: '15 Sep 2026' },
  ];

  const recentProcurementBids = [
    { id: 'PROC-401', produce: 'Sharbati Wheat (500 Qtls)', farmer: 'Dinesh Sharma', topBid: '₹2,580/qtl', buyer: 'ITC Agribusiness', status: 'Matched' },
    { id: 'PROC-402', produce: 'Yellow Soybean (1200 Qtls)', farmer: 'Vikas Verma', topBid: '₹4,820/qtl', buyer: 'Adani Wilmar', status: 'Weighment Pending' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Enterprise Admin Command Center</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">AgriMart Microservices & Platform Overview</h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>All Services Operational</span>
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold">{stat.label}</span>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-extrabold text-white block">{stat.value}</span>
              <span className="text-xs text-emerald-400 font-semibold">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: E-Commerce & Procurement Logs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-slate-100 text-base flex items-center justify-between">
              <span>Recent E-Commerce Store Orders</span>
              <span className="text-xs text-emerald-400">Django Orders Service</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Farmer</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-900/60">
                      <td className="p-3 font-bold text-emerald-400">{ord.id}</td>
                      <td className="p-3">{ord.farmer}</td>
                      <td className="p-3 text-slate-400">{ord.items}</td>
                      <td className="p-3 font-bold text-white">{ord.amount}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold">{ord.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: AI Inference & Mandi Microservices Health */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-slate-100 text-base flex items-center justify-between">
              <span>Microservices Latency & Health</span>
              <span className="text-xs text-teal-400">FastAPI ML Workers</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">AI Vision Detection Service</span>
                  <span className="text-slate-400 text-[10px]">PyTorch ONNX Inference</span>
                </div>
                <span className="font-extrabold text-emerald-400">142 ms (Healthy)</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">Price Forecasting ML Service</span>
                  <span className="text-slate-400 text-[10px]">XGBoost Mandi Storage Pipeline</span>
                </div>
                <span className="font-extrabold text-emerald-400">88 ms (Healthy)</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">Procurement B2B Matcher</span>
                  <span className="text-slate-400 text-[10px]">FastAPI Async Auction Engine</span>
                </div>
                <span className="font-extrabold text-emerald-400">45 ms (Healthy)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

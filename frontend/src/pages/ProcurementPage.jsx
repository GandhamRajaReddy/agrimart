import React, { useState } from 'react';
import { 
  Truck, 
  Clock, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Warehouse,
  ArrowRight,
  X
} from 'lucide-react';

export const ProcurementPage = () => {
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [cropType, setCropType] = useState('Sharbati Wheat');
  const [quantityQuintals, setQuantityQuintals] = useState(150);
  const [expectedPrice, setExpectedPrice] = useState(2550);
  const [location, setLocation] = useState('Indore, Madhya Pradesh');

  const activeBids = [
    {
      id: 'bid-101',
      buyerName: 'ITC Agribusiness Division',
      buyerType: 'Verified Corporate Processor',
      crop: 'Sharbati Wheat Grade-A',
      bidPrice: 2580, // per qtl
      requiredQty: '500 Quintals',
      location: 'Indore Processing Hub',
      paymentTerms: 'Instant Account Transfer on Weighment',
      bidsCount: 14,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'bid-102',
      buyerName: 'Adani Wilmar Agri Logistics',
      buyerType: 'Verified Exporter',
      crop: 'Soybean (Yellow 54%)',
      bidPrice: 4820, // per qtl
      requiredQty: '1,200 Quintals',
      location: 'Ujjain Direct Silo',
      paymentTerms: '24-Hr Direct Bank Settlement',
      bidsCount: 22,
      image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 'bid-103',
      buyerName: 'Kisan-Connect Flour Mills',
      buyerType: 'Regional Processor',
      crop: 'Desi Chana (Gram)',
      bidPrice: 6180, // per qtl
      requiredQty: '300 Quintals',
      location: 'Dewas Logistics Center',
      paymentTerms: 'Immediate UPI / Cheque',
      bidsCount: 8,
      image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=400'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-950 to-slate-950 border border-teal-500/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950 border border-teal-500/40 text-teal-300 text-xs font-bold mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>Zero-Wait Farmer Procurement System</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white">Sell Produce Directly & Eliminate Mandi Waiting Queues</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Connect directly with verified corporate buyers, flour mills & exporters with guaranteed doorstep pickup.</p>
        </div>

        <button
          onClick={() => setIsListingModalOpen(true)}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-teal-950 flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>List My Produce Harvest</span>
        </button>
      </div>

      {/* Queue Reduction Performance Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-3 text-rose-400 text-xs font-bold">
            <Clock className="w-5 h-5" />
            <span>Traditional Mandi Waiting Queue</span>
          </div>
          <span className="text-3xl font-extrabold text-white block">14 to 28 Hours</span>
          <p className="text-xs text-slate-400">Long tractor lines, unloading delay & moisture deduction disputes.</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-emerald-500/50 space-y-2 bg-gradient-to-br from-emerald-950/40 to-slate-950">
          <div className="flex items-center gap-3 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5" />
            <span>AgriMart Direct Procurement Queue</span>
          </div>
          <span className="text-3xl font-extrabold text-emerald-300 block">0 Hours (Instant Farm Pickup)</span>
          <p className="text-xs text-slate-300">Verified digital weighment & immediate bank transfer within 2 hours.</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-3 text-amber-400 text-xs font-bold">
            <TrendingUp className="w-5 h-5" />
            <span>Average Farmer Realization</span>
          </div>
          <span className="text-3xl font-extrabold text-white block">+8.5% Higher Price</span>
          <p className="text-xs text-slate-400">Eliminating middleman agent commission & mandi gate charges.</p>
        </div>
      </div>

      {/* Active Buyer Bidding Marketplace */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white">Live Corporate Buyer Procurement Bids</h2>
            <p className="text-xs text-slate-400">Verified buyers actively seeking fresh harvest produce.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeBids.map((bid) => (
            <div 
              key={bid.id}
              className="glass-card rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">{bid.buyerType}</span>
                  <h3 className="font-extrabold text-slate-100 text-base mt-0.5">{bid.buyerName}</h3>
                </div>
                <div className="p-2 rounded-xl bg-teal-950 border border-teal-800 text-teal-400">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Crop:</span>
                  <span className="font-bold text-white">{bid.crop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bid Price Offered:</span>
                  <span className="font-extrabold text-emerald-400 text-sm">₹{bid.bidPrice}/qtl</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Required Harvest:</span>
                  <span className="font-bold text-slate-200">{bid.requiredQty}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Silo Location:</span>
                  <span className="text-slate-300 flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-400" /> {bid.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{bid.paymentTerms}</span>
              </div>

              <button className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-teal-950 transition-all">
                Accept Bid & Schedule Pickup
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* HARVEST LISTING MODAL */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div onClick={() => setIsListingModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"></div>

          <div className="relative w-full max-w-lg bg-slate-900 border border-teal-500/40 rounded-3xl p-6 shadow-2xl space-y-6 z-10">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-teal-950 border border-teal-800 text-teal-400">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-100 text-base">List Produce for Direct Procurement</h3>
                  <p className="text-xs text-slate-400">Receive bids from verified buyers within 1 hour</p>
                </div>
              </div>
              <button onClick={() => setIsListingModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Crop Variety:</label>
                <input
                  type="text"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Quantity (Quintals):</label>
                  <input
                    type="number"
                    value={quantityQuintals}
                    onChange={(e) => setQuantityQuintals(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Asking Rate (₹/Qtl):</label>
                  <input
                    type="number"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Farm / Village Pickup Address:</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <button
              onClick={() => {
                alert('Harvest produce listed successfully! Corporate buyers will be notified.');
                setIsListingModalOpen(false);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-950 transition-all"
            >
              Post Harvest Listing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Sprout, ShoppingBag, Store, CheckCircle2 } from 'lucide-react';

const ROLES = [
  {
    id: 'Farmer',
    title: 'Farmer / Kisan',
    subtitle: 'Buy genuine seeds, fertilizers, machinery & sell mandi produce directly.',
    icon: Sprout,
    color: 'emerald',
    badge: 'Popular for Farmers',
  },
  {
    id: 'Buyer',
    title: 'Bulk Buyer / Trader',
    subtitle: 'Procure bulk grains, pulses & vegetables directly from verified farmers.',
    icon: ShoppingBag,
    color: 'amber',
    badge: 'Mandi Procurement',
  },
  {
    id: 'Vendor',
    title: 'Agri Merchant / Dealer',
    subtitle: 'Sell agricultural products, tools & offer rental equipment services.',
    icon: Store,
    color: 'teal',
    badge: 'Store Owners',
  },
];

export const RoleSelectorCard = ({ selectedRole, onSelectRole, error }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-emerald-200">
        I am registering as a <span className="text-amber-400">*</span>
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ROLES.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              className={`relative flex flex-col justify-between p-4 rounded-2xl border text-left transition-all duration-200 group ${
                isSelected
                  ? 'bg-emerald-800/80 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg shadow-emerald-950/60 scale-[1.02]'
                  : 'bg-emerald-950/40 border-emerald-800/60 hover:bg-emerald-900/40 hover:border-emerald-700/60'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 fill-emerald-400/20" />
                </div>
              )}

              <div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    isSelected
                      ? 'bg-emerald-500 text-emerald-950 font-bold'
                      : 'bg-emerald-900/60 text-emerald-300 group-hover:bg-emerald-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-200">{role.title}</h4>
                <p className="text-xs text-emerald-300/70 mt-1 line-clamp-2">{role.subtitle}</p>
              </div>

              <div className="mt-3">
                <span
                  className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-emerald-900/40 text-emerald-400/80'
                  }`}
                >
                  {role.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-400 font-medium mt-1">{error}</p>}
    </div>
  );
};

export default RoleSelectorCard;

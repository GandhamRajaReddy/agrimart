import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  ShoppingCart, 
  Calculator, 
  X, 
  Leaf,
} from 'lucide-react';
import useCart from '../features/cart/hooks/useCart';
import axiosClient from '../services/http/axiosClient';



export const CatalogPage = () => {
  const { addToCart, isAddingToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dosage Calculator Modal state
  const [isDosageModalOpen, setIsDosageModalOpen] = useState(false);
  const [landAcres, setLandAcres] = useState(5);
  const [targetCropCalc, setTargetCropCalc] = useState('Wheat');

  const categories = ['All', 'Seeds', 'Pesticides & Fungicides', 'Fertilisers', 'Farm Machinery', 'Tools & Irrigation'];
  const crops = ['All', 'Wheat', 'Cotton', 'Paddy (Rice)', 'Soybean', 'Sugarcane', 'Tomato/Vegetables'];

  // Fetch live products from DRF backend
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axiosClient.get('/products/');
      return res.data?.results || res.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const rawProducts = productsQuery.data?.length ? productsQuery.data.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category_name || p.category || 'Agri Input',
    price: parseFloat(p.price) || 0,
    originalPrice: p.original_price ? parseFloat(p.original_price) : null,
    unit: p.unit || '1 unit',
    rating: p.rating ?? null,
    reviewsCount: p.reviews_count ?? 0,
    image: p.image_url || p.image || 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80',
    badge: p.badge || '',
    dosageNote: p.description || '',
    targetCrop: 'All',
    brand: p.brand || ''
  })) : [];

  const filteredProducts = rawProducts.filter(p => {
    const matchCategory = selectedCategory === 'All' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchCrop = selectedCrop === 'All' || p.targetCrop === selectedCrop || p.targetCrop === 'All';
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchCrop && matchSearch;
  });

  const calculateDosageRequirements = () => [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-950 border border-emerald-800/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-3">
            <Leaf className="w-3.5 h-3.5" />
            <span>Kisan Input Marketplace</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white">Quality Seeds, Bio-Pesticides & Machinery</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">100% Certified batches directly delivered to your farm doorstep.</p>
        </div>

        <button
          onClick={() => setIsDosageModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-950 flex items-center gap-2 transition-all"
        >
          <Calculator className="w-4 h-4" />
          <span>Dosage Guidance</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name or brand..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700/60 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Crop Selector Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-300 shrink-0">Target Crop:</span>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700/60 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {crops.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            className="glass-card rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between group"
          >
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm">
                {product.badge}
              </span>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider">{product.category}</span>
                  <span>Brand: <strong>{product.brand}</strong></span>
                </div>
                <h3 className="font-extrabold text-slate-100 text-base group-hover:text-emerald-300 transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-400">{product.unit} • Target: {product.targetCrop}</p>
              </div>

              {/* Dosage Guideline */}
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-amber-300">
                <span className="font-bold block text-[10px] text-amber-400 uppercase mb-0.5">Dosage Recommendation:</span>
                <span className="line-clamp-2">💡 {product.dosageNote}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xl font-extrabold text-white">₹{product.price}</span>
                  {product.originalPrice && <span className="text-xs text-slate-500 line-through ml-2">₹{product.originalPrice}</span>}
                </div>

                <button
                  disabled={isAddingToCart}
                  onClick={() => addToCart({ productId: product.id, quantity: 1 })}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-md shadow-emerald-950 flex items-center gap-2 text-xs"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DOSAGE CALCULATOR MODAL */}
      {isDosageModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div onClick={() => setIsDosageModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"></div>

          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-6 z-10">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-950 border border-amber-800 text-amber-400">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-100 text-base">Acreage Dosage Calculator</h3>
                  <p className="text-xs text-slate-400">Check whether validated crop-specific dosage guidance is available</p>
                </div>
              </div>
              <button
                onClick={() => setIsDosageModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Land Size (Acres):</label>
                <input
                  type="number"
                  value={landAcres}
                  onChange={(e) => setLandAcres(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Target Crop:</label>
                <select
                  value={targetCropCalc}
                  onChange={(e) => setTargetCropCalc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="Wheat">Wheat</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Paddy">Paddy (Rice)</option>
                  <option value="Soybean">Soybean</option>
                </select>
              </div>
            </div>

            {/* Recommended Results */}
            <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                Agronomic dosage guidance
              </h4>
              <p className="text-slate-300 leading-relaxed">A validated crop-specific dosage calculator is not connected yet. Follow the product label and local agricultural department guidance; do not use generic quantities.</p>

              <div className="space-y-2">
                {calculateDosageRequirements().map((req, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-300 font-medium">{req.item}:</span>
                    <span className="font-extrabold text-emerald-400">{req.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsDosageModalOpen(false)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;

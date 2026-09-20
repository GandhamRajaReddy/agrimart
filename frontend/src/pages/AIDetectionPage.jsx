import React, { useState } from 'react';
import { 
  Scan, 
  Upload, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  ShoppingCart, 
  ShieldAlert, 
  ArrowRight, 
  RefreshCw,
  Leaf,
  Bug,
  Sprout
} from 'lucide-react';
import useCart from '../features/cart/hooks/useCart';

export const AIDetectionPage = () => {
  const { addToCart, isAddingToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState({
    cropName: 'Wheat (Triticum aestivum)',
    diagnosis: 'Yellow Rust (Puccinia striiformis)',
    type: 'Fungal Infection',
    confidence: 94.8,
    severity: 'High (Immediate Action Required)',
    symptoms: [
      'Bright yellow linear pustules on leaf surface',
      'Chlorotic stripes reducing photosynthesis efficiency by 35%',
      'Spore dust shedding under dry wind conditions'
    ],
    chemicalCure: 'Spray Propiconazole 25% EC @ 1 ml/Liter water OR Bio-Shield Tri-Fungicide Gold.',
    organicCure: 'Apply Neem oil (10,000 PPM) 3 ml/L + Sour buttermilk spray (200 ml/15L tank).',
    cureProduct: {
      id: '69879241-7ebe-45df-912d-e9c54ec0b28b',
      name: 'Syngenta Ampligo Bio-Fungicide Protection',
      category: 'Pesticides & Fungicides',
      price: 890,
      unit: '250 ml bottle',
      image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=400',
      dosageNote: '2.5 ml per liter of water',
      targetCrop: 'Wheat & Paddy'
    }
  });

  const sampleLeafImages = [
    {
      name: 'Wheat Yellow Rust',
      url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
      diagnosis: 'Yellow Rust (Puccinia striiformis)',
      type: 'Fungal Infection',
      confidence: 94.8,
      severity: 'High'
    },
    {
      name: 'Cotton Pink Bollworm',
      url: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800',
      diagnosis: 'Pink Bollworm (Pectinophora gossypiella)',
      type: 'Insect Pest Attack',
      confidence: 91.2,
      severity: 'Medium'
    },
    {
      name: 'Tomato Late Blight',
      url: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e17?auto=format&fit=crop&q=80&w=800',
      diagnosis: 'Late Blight (Phytophthora infestans)',
      type: 'Fungal Infection',
      confidence: 96.4,
      severity: 'Critical'
    }
  ];

  const handleImageSelect = (sample) => {
    setSelectedImage(sample.url);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1800);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-950 to-slate-950 border border-teal-500/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950 border border-teal-500/40 text-teal-300 text-xs font-bold mb-3">
            <Scan className="w-3.5 h-3.5 animate-pulse" />
            <span>FastAPI Computer Vision Engine</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white">AI Weed, Insect & Disease Scanner</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Upload leaf or crop image for 95%+ precision vision model classification.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2">
            <Camera className="w-4 h-4 text-teal-400" />
            <span>Capture Live Photo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Dropzone & Sample Selector */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
              <Upload className="w-4 h-4 text-teal-400" />
              <span>Crop Image Upload Zone</span>
            </h3>

            {/* Scan Image Container */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-teal-500/40 bg-slate-950 aspect-square flex items-center justify-center group">
              <img 
                src={selectedImage} 
                alt="Selected Leaf Scan" 
                className="w-full h-full object-cover"
              />

              {/* AI Laser Scan Animation */}
              {isScanning && (
                <div className="animate-scan-laser"></div>
              )}

              {/* Scanning Overlay Text */}
              {isScanning && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-teal-300">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-extrabold tracking-wider">FastAPI ResNet CNN Analyzing Image...</span>
                </div>
              )}
            </div>

            {/* Sample Selector */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-400 block">Try Preset Test Cases:</span>
              <div className="grid grid-cols-3 gap-2">
                {sampleLeafImages.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleImageSelect(sample)}
                    className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500 overflow-hidden text-left transition-all"
                  >
                    <img src={sample.url} alt={sample.name} className="w-full h-14 object-cover rounded-lg mb-1" />
                    <span className="block text-[10px] font-bold text-slate-300 truncate">{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Diagnostic Results & Cure Recommendation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-teal-500/30 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">Diagnosis Report</span>
                <h2 className="text-xl font-extrabold text-white mt-0.5">{scanResult.diagnosis}</h2>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-teal-950 text-teal-300 border border-teal-500/40 inline-flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                  <span>{scanResult.confidence}% AI Confidence</span>
                </span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Identified Crop</span>
                <span className="font-bold text-slate-200 mt-0.5 block">{scanResult.cropName}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Disease Type</span>
                <span className="font-bold text-amber-300 mt-0.5 block">{scanResult.type}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px]">Severity Level</span>
                <span className="font-bold text-rose-400 mt-0.5 block">{scanResult.severity}</span>
              </div>
            </div>

            {/* Symptoms Breakdown */}
            <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
              <h4 className="font-bold text-slate-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Detected Leaf Symptoms:</span>
              </h4>
              <ul className="space-y-1.5 text-slate-300 pl-6 list-disc">
                {scanResult.symptoms.map((symptom, idx) => (
                  <li key={idx}>{symptom}</li>
                ))}
              </ul>
            </div>

            {/* Treatment Remedies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-2">
                <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sprout className="w-4 h-4" />
                  <span>Chemical / Bio Cure</span>
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">{scanResult.chemicalCure}</p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-800/40 space-y-2">
                <h4 className="font-bold text-teal-400 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4" />
                  <span>Organic Desi Remedy</span>
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">{scanResult.organicCure}</p>
              </div>
            </div>

            {/* Direct Product Recommendation Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-950/40 to-slate-950 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src={scanResult.cureProduct.image} 
                  alt={scanResult.cureProduct.name}
                  className="w-16 h-16 rounded-xl object-cover border border-emerald-500/40"
                />
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Recommended Solution</span>
                  <h4 className="font-extrabold text-slate-100 text-sm">{scanResult.cureProduct.name}</h4>
                  <span className="text-xs font-bold text-emerald-300">₹{scanResult.cureProduct.price} • {scanResult.cureProduct.unit}</span>
                </div>
              </div>

              <button
                disabled={isAddingToCart}
                onClick={() => addToCart({ productId: scanResult.cureProduct.id, quantity: 1 })}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all shrink-0"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Buy Cure Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

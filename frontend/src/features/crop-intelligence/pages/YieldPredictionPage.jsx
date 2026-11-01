import { AlertTriangle, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../config/routes';

export const YieldPredictionPage = () => {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl border border-amber-700/60 bg-amber-950/20 p-8 text-center">
        <Sprout size={40} className="mx-auto text-amber-400" />
        <h1 className="mt-4 text-2xl font-bold text-white">Crop Yield Forecasting</h1>
        <p className="mt-3 text-sm text-slate-300">
          Yield estimates are not yet published. Predictions require out-of-sample backtesting against Karnataka agro-climatic zone yields.
        </p>
        <div className="mt-6">
          <Link
            to={ROUTES.cropPlanner}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 font-bold text-slate-950 hover:bg-emerald-400"
          >
            Go to Crop Planner
          </Link>
        </div>
      </div>
    </main>
  );
};

export default YieldPredictionPage;

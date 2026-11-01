import { AlertTriangle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../config/routes';

export const ProfitabilityPage = () => {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl border border-amber-700/60 bg-amber-950/20 p-8 text-center">
        <TrendingUp size={40} className="mx-auto text-amber-400" />
        <h1 className="mt-4 text-2xl font-bold text-white">Crop Profitability Analysis</h1>
        <p className="mt-3 text-sm text-slate-300">
          Historical mandi price baselines and crop profitability rankings remain fail-closed until Karnataka AGMARKNET datasets and time-based backtesting are completed.
        </p>
        <div className="mt-6">
          <Link
            to={ROUTES.marketIntelligence}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 font-bold text-slate-950 hover:bg-amber-400"
          >
            <AlertTriangle size={16} />
            View Mandi Status & Readiness
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ProfitabilityPage;

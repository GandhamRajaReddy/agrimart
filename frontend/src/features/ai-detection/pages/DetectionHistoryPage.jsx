import { ScanSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../config/routes';

export const DetectionHistoryPage = () => {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-center">
        <ScanSearch size={40} className="mx-auto text-teal-400" />
        <h1 className="mt-4 text-2xl font-bold text-white">Detection History</h1>
        <p className="mt-2 text-sm text-slate-400">
          Scans and diagnostic reports from your account will appear here.
        </p>
        <Link
          to={ROUTES.aiDetection}
          className="mt-6 inline-block rounded-xl bg-teal-400 px-5 py-2.5 font-bold text-slate-950 hover:bg-teal-300"
        >
          Scan a leaf now
        </Link>
      </div>
    </main>
  );
};

export default DetectionHistoryPage;

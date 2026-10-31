import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, ImagePlus, Loader2, ScanSearch } from "lucide-react";

import { detectPlantDisease } from "../features/ai-detection/api/detectionApi";
import { useAuth } from "../features/auth/hooks/useAuth";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const AIDetectionPage = () => {
  const { isAuthenticated } = useAuth();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] || null;
    setResult(null);
    setError("");
    if (!selected) {
      setFile(null);
      return;
    }
    if (!selected.type.startsWith("image/")) {
      setFile(null);
      setError("Choose a valid image file.");
      return;
    }
    if (selected.size > MAX_IMAGE_BYTES) {
      setFile(null);
      setError("Image must be 5 MB or smaller.");
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Select a clear plant-leaf image first.");
      return;
    }
    setError("");
    setResult(null);
    setIsSubmitting(true);
    try {
      const response = await detectPlantDisease(file);
      setResult(response);
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
        requestError.response?.data?.message ||
        "Disease detection is unavailable. Confirm the ML service is configured and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl space-y-7 px-4 py-10">
      <header className="rounded-3xl border border-teal-800/50 bg-gradient-to-br from-teal-950 to-slate-950 p-7">
        <div className="flex items-center gap-2 text-sm font-bold text-teal-300">
          <ScanSearch size={18} /> Plant disease detection
        </div>
        <h1 className="mt-3 text-3xl font-extrabold text-white">AI leaf health check</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Upload a clear leaf image for analysis by the connected Harvestify disease model.
          Results are shown only when returned by the inference service.
        </p>
      </header>

      {!isAuthenticated && (
        <div role="alert" className="rounded-2xl border border-amber-700/50 bg-amber-950/20 p-4 text-sm text-amber-100">
          Sign in to use plant disease detection.
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-2xl border border-slate-800 bg-slate-950 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-6 text-center hover:border-teal-500">
            <ImagePlus size={32} className="text-teal-300" />
            <span className="font-semibold text-white">{file?.name || "Choose leaf image"}</span>
            <span className="text-xs text-slate-400">JPG, PNG or WEBP · maximum 5 MB</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
          </label>
          <button type="submit" disabled={!file || !isAuthenticated || isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ScanSearch size={18} />}
            {isSubmitting ? "Analyzing image…" : "Analyze leaf"}
          </button>
        </div>

        <div className="flex min-h-48 items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          {previewUrl ? (
            <img src={previewUrl} alt="Selected plant leaf" className="max-h-80 w-full object-contain" />
          ) : (
            <p className="px-6 text-center text-sm text-slate-500">Your selected leaf image preview appears here.</p>
          )}
        </div>
      </form>

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-800/60 bg-rose-950/30 p-4 text-sm text-rose-200">
          <AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      {result && (
        <section className="space-y-3 rounded-2xl border border-emerald-800/50 bg-emerald-950/20 p-6">
          <div className="flex items-center gap-2 font-bold text-emerald-300">
            <CheckCircle2 size={18} /> Model response
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-xs text-slate-200">{JSON.stringify(result, null, 2)}</pre>
          <p className="text-xs leading-5 text-slate-400">
            AI output is decision support, not a confirmed laboratory diagnosis. Consult an agricultural expert before treatment.
          </p>
        </section>
      )}
    </main>
  );
};

export default AIDetectionPage;
export { AIDetectionPage };

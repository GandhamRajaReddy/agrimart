import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ImagePlus,
  Info,
  Loader2,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Sprout,
} from "lucide-react";

import { detectPlantDisease } from "../features/ai-detection/api/detectionApi";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ROUTES } from "../config/routes";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formatClassification = (raw) => {
  if (!raw || typeof raw !== "string") {
    return { crop: "Unknown Crop", condition: "Analysis pending", isHealthy: false };
  }
  const parts = raw.split("___");
  const rawCrop = (parts[0] || "Unknown Crop").replace(/_/g, " ").trim();
  const rawCondition = (parts[1] || parts[0] || "Undetermined").replace(/_/g, " ").trim();
  const isHealthy = rawCondition.toLowerCase() === "healthy";

  return {
    crop: rawCrop,
    condition: isHealthy ? "Healthy" : rawCondition,
    isHealthy,
  };
};

const AIDetectionPage = () => {
  const { isAuthenticated } = useAuth();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidatingImage, setIsValidatingImage] = useState(false);

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

    // Strict MIME validation (JPEG, PNG, WebP)
    if (!ALLOWED_MIME_TYPES.includes(selected.type)) {
      setFile(null);
      setError("Please choose a JPEG, PNG, or WebP image. Other formats are not supported.");
      return;
    }

    // Size limit (5 MB)
    if (selected.size > MAX_IMAGE_BYTES) {
      setFile(null);
      setError("Image must be 5 MB or smaller. Please choose a smaller image.");
      return;
    }

    // Client-side image readability / integrity verification
    setIsValidatingImage(true);
    const tempUrl = URL.createObjectURL(selected);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(tempUrl);
      setIsValidatingImage(false);
      setFile(selected);
    };

    img.onerror = () => {
      URL.revokeObjectURL(tempUrl);
      setIsValidatingImage(false);
      setFile(null);
      setError("The selected file is corrupt or unreadable. Please take or choose a clearer photo.");
    };

    img.src = tempUrl;
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError("");
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
      const status = requestError.response?.status;
      if (status === 401) {
        setError("Your session has expired. Please log in again to continue.");
      } else if (status === 413) {
        setError("Image size exceeds the 5 MB limit. Please compress or choose a smaller image.");
      } else if (status === 415) {
        setError("Unsupported file format. Please upload a JPEG, PNG, or WebP image.");
      } else {
        setError(
          requestError.response?.data?.detail ||
          requestError.response?.data?.message ||
          "Disease detection service is temporarily unavailable. Check the backend connection and try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const parsedData = result?.data || result;
  const classificationInfo = parsedData?.classification
    ? formatClassification(parsedData.classification)
    : null;
  const confidenceScore = typeof parsedData?.confidence === "number"
    ? Math.round(parsedData.confidence * 100)
    : null;

  return (
    <main className="mx-auto max-w-5xl space-y-7 px-4 py-10">
      <header className="rounded-3xl border border-teal-800/50 bg-gradient-to-br from-teal-950 to-slate-950 p-7">
        <div className="flex items-center gap-2 text-sm font-bold text-teal-300">
          <ScanSearch size={18} /> Plant disease detection
        </div>
        <h1 className="mt-3 text-3xl font-extrabold text-white">AI leaf health check</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Upload a clear plant leaf image to identify potential diseases using our connected
          Harvestify ResNet-9 deep learning model.
        </p>
      </header>

      {!isAuthenticated && (
        <div role="alert" className="flex items-center justify-between rounded-2xl border border-amber-700/50 bg-amber-950/20 p-4 text-sm text-amber-100">
          <span>Sign in to run plant disease detection and access agricultural advisory.</span>
          <Link
            to={ROUTES.login}
            className="ml-4 shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-500"
          >
            Log in
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-2xl border border-slate-800 bg-slate-950 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-6 text-center transition hover:border-teal-500">
            <ImagePlus size={32} className="text-teal-300" />
            <span className="font-semibold text-white">{file?.name || "Choose leaf image"}</span>
            <span className="text-xs text-slate-400">JPG, PNG or WEBP · Maximum 5 MB</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!file || !isAuthenticated || isSubmitting || isValidatingImage}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Analyzing leaf…</span>
                </>
              ) : isValidatingImage ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Checking image…</span>
                </>
              ) : (
                <>
                  <ScanSearch size={18} />
                  <span>Analyze leaf</span>
                </>
              )}
            </button>
            {file && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="rounded-xl border border-slate-700 px-4 py-3 text-slate-300 transition hover:bg-slate-900 disabled:opacity-50"
                title="Reset selection"
              >
                <RefreshCw size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="flex min-h-48 items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          {previewUrl ? (
            <img src={previewUrl} alt="Selected plant leaf" className="max-h-80 w-full object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-2 p-6 text-center text-slate-500">
              <Sprout size={36} className="text-slate-600" />
              <p className="text-sm">Your selected leaf image preview will appear here.</p>
              <p className="text-xs text-slate-600">Ensure good lighting and capture individual lesions clearly.</p>
            </div>
          )}
        </div>
      </form>

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-800/60 bg-rose-950/30 p-4 text-sm text-rose-200">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {classificationInfo && (
        <section className={`space-y-4 rounded-2xl border p-6 ${
          classificationInfo.isHealthy
            ? "border-emerald-700/60 bg-emerald-950/20"
            : "border-amber-700/60 bg-amber-950/20"
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2 font-bold text-lg text-white">
              {classificationInfo.isHealthy ? (
                <>
                  <CheckCircle2 size={22} className="text-emerald-400" />
                  <span>Healthy Foliage Detected</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={22} className="text-amber-400" />
                  <span>Foliage Issue Identified</span>
                </>
              )}
            </div>
            {confidenceScore !== null && (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                confidenceScore >= 80
                  ? "bg-emerald-900/60 text-emerald-300 border border-emerald-700/50"
                  : "bg-amber-900/60 text-amber-300 border border-amber-700/50"
              }`}>
                <ShieldCheck size={14} />
                {confidenceScore}% confidence
              </span>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Crop Identified</span>
              <p className="mt-1 text-xl font-bold text-white capitalize">{classificationInfo.crop}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Diagnosis</span>
              <p className={`mt-1 text-xl font-bold capitalize ${
                classificationInfo.isHealthy ? "text-emerald-300" : "text-amber-300"
              }`}>
                {classificationInfo.condition}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs leading-5 text-slate-300">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200 mb-1">
              <Info size={14} className="text-teal-400" /> Farmer Advisory Notes
            </div>
            {classificationInfo.isHealthy ? (
              <p>
                No symptoms of common leaf spot, blight, or viral infection were detected. Continue regular crop scouting, balanced fertilization, and good field drainage.
              </p>
            ) : (
              <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-300">
                <li>Isolate severely affected leaves to minimize airborne fungal or bacterial spore transmission.</li>
                <li>Avoid overhead watering during humid evenings to keep canopy foliage dry.</li>
                <li>Verify symptoms with your local agricultural officer or Raitha Samparka Kendra before applying fungicidal sprays.</li>
              </ul>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
            <HelpCircle size={14} />
            <span>
              {result?.disclaimer || "AI output is decision support, not a laboratory confirmation. Always consult an agronomist before chemical treatment."}
            </span>
          </div>
        </section>
      )}
    </main>
  );
};

export default AIDetectionPage;
export { AIDetectionPage };

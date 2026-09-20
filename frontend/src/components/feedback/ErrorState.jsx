import { AlertCircle, RefreshCw } from "lucide-react";

import Button from "../common/Button";

const ErrorState = ({
  title = "We could not load this right now",
  message = "Please check your connection and try again.",
  onRetry,
  className = "",
}) => (
  <section
    className={`flex min-h-52 flex-col items-center justify-center rounded-3xl border border-[#b84736]/20 bg-[#fff8f5] p-8 text-center ${className}`}
    role="alert"
  >
    <AlertCircle className="mb-3 h-8 w-8 text-[#b84736]" aria-hidden="true" />
    <h2 className="display-font text-2xl font-semibold text-[#163124]">{title}</h2>
    <p className="mt-2 max-w-md text-sm leading-6 text-[#587062]">{message}</p>
    {onRetry && (
      <Button className="mt-5" variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
        Try again
      </Button>
    )}
  </section>
);

export default ErrorState;

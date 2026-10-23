import React, { useState, useEffect, useRef } from 'react';
import { KeyRound, RefreshCw, X, ShieldAlert } from 'lucide-react';
import Button from '../../../components/common/Button';

export const OTPVerificationModal = ({
  isOpen,
  onClose,
  phone,
  onVerify,
  onResend,
  isLoading,
  error,
}) => {
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!isOpen) return undefined;
    setOtpValues(['', '', '', '', '', '']);
    setResendTimer(30);
    setCanResend(false);
    const focusTimer = setTimeout(() => inputRefs.current[0]?.focus(), 100);
    return () => clearTimeout(focusTimer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || resendTimer <= 0) {
      setCanResend(resendTimer <= 0);
      return undefined;
    }
    const interval = setInterval(() => setResendTimer((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(interval);
  }, [isOpen, resendTimer]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    setOtpValues((current) => current.map((item, itemIndex) => itemIndex === index ? digit : item));
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      setOtpValues(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const fullOtp = otpValues.join('');
  const isComplete = fullOtp.length === 6;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isComplete && !isLoading) onVerify(fullOtp);
  };

  const handleResendClick = () => {
    if (!canResend || isLoading) return;
    setResendTimer(30);
    setCanResend(false);
    setOtpValues(['', '', '', '', '', '']);
    onResend();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-emerald-900/90 border border-emerald-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/90">
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close OTP verification" className="absolute top-4 right-4 p-2 text-emerald-400 hover:text-white rounded-full bg-emerald-800/40 hover:bg-emerald-800/80 transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <KeyRound className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-white font-display">Verify Mobile OTP</h3>
          <p className="text-xs sm:text-sm text-emerald-200/80">
            Enter the 6-digit security code sent to <span className="font-bold text-emerald-300">+91 {phone}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="flex justify-between items-center gap-2" onPaste={handlePaste}>
            {otpValues.map((value, index) => (
              <input
                key={index}
                ref={(element) => { inputRefs.current[index] = element; }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                aria-label={`OTP digit ${index + 1}`}
                maxLength={1}
                value={value}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                className={`w-11 h-13 text-center font-mono text-2xl font-bold rounded-xl bg-emerald-950/60 border ${
                  value ? 'border-emerald-400 text-white bg-emerald-900/80' : 'border-emerald-700/60 text-emerald-300'
                } focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 transition-all`}
              />
            ))}
          </div>

          {error && (
            <div role="alert" className="flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-300">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading} disabled={!isComplete || isLoading} className="shadow-lg shadow-emerald-900/60">
            Verify & Authenticate
          </Button>

          <div className="text-center text-xs text-emerald-300/70 pt-2 flex items-center justify-center gap-2">
            <span>Didn't receive code?</span>
            {canResend ? (
              <button type="button" onClick={handleResendClick} disabled={isLoading} className="text-amber-400 font-bold hover:underline flex items-center gap-1 disabled:opacity-50">
                <RefreshCw className="w-3.5 h-3.5" />
                Resend OTP
              </button>
            ) : (
              <span className="font-mono text-emerald-400 font-semibold">Resend in {resendTimer}s</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerificationModal;

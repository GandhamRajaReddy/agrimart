import React, { useState, useEffect, useRef } from 'react';
import { KeyRound, CheckCircle, RefreshCw, X, ShieldAlert } from 'lucide-react';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';

export const OTPVerificationModal = ({
  isOpen,
  onClose,
  phone,
  demoOtp = '123456',
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
    if (isOpen) {
      setOtpValues(['', '', '', '', '', '']);
      setResendTimer(30);
      setCanResend(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval = null;
    if (isOpen && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, resendTimer]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newValues = [...otpValues];
    newValues[index] = value.slice(-1);
    setOtpValues(newValues);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split('');
      setOtpValues(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const fullOtp = otpValues.join('');
  const isComplete = fullOtp.length === 6;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (isComplete) {
      onVerify(fullOtp);
    }
  };

  const handleResendClick = () => {
    if (canResend) {
      setResendTimer(30);
      setCanResend(false);
      setOtpValues(['', '', '', '', '', '']);
      onResend();
      inputRefs.current[0]?.focus();
    }
  };

  const fillDemoOtp = () => {
    if (demoOtp && demoOtp.length === 6) {
      setOtpValues(demoOtp.split(''));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-emerald-900/90 border border-emerald-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/90">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-emerald-400 hover:text-white rounded-full bg-emerald-800/40 hover:bg-emerald-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/40">
            <KeyRound className="w-7 h-7" />
          </div>

          <h3 className="text-2xl font-bold text-white font-display">Verify Mobile OTP</h3>
          <p className="text-xs sm:text-sm text-emerald-200/80">
            We sent a 6-digit security code to{' '}
            <span className="font-bold text-emerald-300">+91 {phone}</span>
          </p>

          {/* Demo OTP Helper Badge */}
          {demoOtp && (
            <div className="pt-1">
              <button
                type="button"
                onClick={fillDemoOtp}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                Demo OTP: <span className="font-mono font-bold tracking-widest">{demoOtp}</span> (Click to auto-fill)
              </button>
            </div>
          )}
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="flex justify-between items-center gap-2" onPaste={handlePaste}>
            {otpValues.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={val}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-11 h-13 text-center font-mono text-2xl font-bold rounded-xl bg-emerald-950/60 border ${
                  val
                    ? 'border-emerald-400 text-white bg-emerald-900/80 shadow-md shadow-emerald-900/40'
                    : 'border-emerald-700/60 text-emerald-300'
                } focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 transition-all duration-200`}
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-300">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={!isComplete || isLoading}
            className="shadow-lg shadow-emerald-900/60"
          >
            Verify & Authenticate
          </Button>

          {/* Resend OTP Section */}
          <div className="text-center text-xs text-emerald-300/70 pt-2 flex items-center justify-center gap-2">
            <span>Didn't receive code?</span>
            {canResend ? (
              <button
                type="button"
                onClick={handleResendClick}
                className="text-amber-400 font-bold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Resend OTP
              </button>
            ) : (
              <span className="font-mono text-emerald-400 font-semibold">
                Resend in {resendTimer}s
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerificationModal;

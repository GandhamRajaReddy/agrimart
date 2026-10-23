import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, Lock, ArrowRight } from 'lucide-react';
import { loginSchema } from '../schemas/authSchemas';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import OTPVerificationModal from '../components/OTPVerificationModal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const LOGIN_ROLES = [
  { value: 'Farmer', label: 'Farmer' },
  { value: 'Buyer', label: 'Buyer / Trader' },
  { value: 'Vendor', label: 'Vendor / Merchant' },
];

export const LoginPage = () => {
  const [authMode, setAuthMode] = useState('password');
  const [otpRole, setOtpRole] = useState('Farmer');
  const {
    requestOTP,
    isRequestingOTP,
    verifyOTP,
    isVerifyingOTP,
    pendingOTP,
    cancelOTP,
    login,
    isLoggingIn,
    loginError,
  } = useAuth();
  const [localError, setLocalError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      authMode: 'password',
      phoneOrEmail: '',
      password: '',
    },
  });

  const watchPhoneOrEmail = watch('phoneOrEmail');

  const onFormSubmit = async (data) => {
    setLocalError('');
    try {
      if (authMode === 'otp') {
        const cleanedPhone = data.phoneOrEmail.replace(/[^\d+]/g, '');
        await requestOTP(cleanedPhone, otpRole);
      } else {
        await login({
          phoneOrEmail: data.phoneOrEmail,
          password: data.password,
        });
      }
    } catch (err) {
      setLocalError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Authentication failed. Please check your inputs.'
      );
    }
  };

  const handleVerifyOTP = async (otpCode) => {
    if (!pendingOTP?.phone) return;
    setLocalError('');
    try {
      await verifyOTP({
        phone: pendingOTP.phone,
        otp: otpCode,
        role: pendingOTP.role || otpRole,
      });
    } catch (err) {
      setLocalError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Invalid or expired OTP code.'
      );
    }
  };

  const handleResendOTP = async () => {
    setLocalError('');
    try {
      await requestOTP(pendingOTP?.phone || watchPhoneOrEmail, pendingOTP?.role || otpRole);
    } catch (err) {
      setLocalError(err.response?.data?.detail || err.message || 'Failed to resend OTP.');
    }
  };

  return (
    <AuthLayout
      title="Welcome Back to AgriMart"
      subtitle="Sign in to manage your crop orders, mandi auctions & AI insights"
    >
      <div className="flex p-1.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 mb-6">
        <button
          type="button"
          onClick={() => {
            setAuthMode('otp');
            setValue('authMode', 'otp');
            setLocalError('');
          }}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
            authMode === 'otp'
              ? 'bg-emerald-500 text-emerald-950 shadow-md'
              : 'text-emerald-300 hover:text-white'
          }`}
        >
          <Phone className="w-4 h-4" />
          Mobile + OTP Login
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode('password');
            setValue('authMode', 'password');
            setLocalError('');
          }}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
            authMode === 'password'
              ? 'bg-emerald-500 text-emerald-950 shadow-md'
              : 'text-emerald-300 hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" />
          Password Login
        </button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        <Input
          label={authMode === 'otp' ? 'Mobile Number' : 'Mobile Number or Email'}
          placeholder={authMode === 'otp' ? 'Enter your mobile number' : 'Enter mobile number or email'}
          leftIcon={<Phone className="w-4 h-4" />}
          error={errors.phoneOrEmail?.message}
          autoComplete="username"
          {...register('phoneOrEmail')}
        />

        {authMode === 'otp' && (
          <div className="space-y-1.5">
            <label htmlFor="otp-role" className="block text-sm font-semibold text-emerald-200">
              Account role
            </label>
            <select
              id="otp-role"
              value={otpRole}
              onChange={(event) => setOtpRole(event.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
            >
              {LOGIN_ROLES.map((role) => (
                <option key={role.value} value={role.value} className="bg-emerald-900 text-white">
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {authMode === 'password' && (
          <Input
            label="Password"
            type="password"
            placeholder="Enter your account password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            autoComplete="current-password"
            {...register('password')}
          />
        )}

        {(localError || loginError) && (
          <div role="alert" className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-300">
            {localError || loginError?.response?.data?.detail || loginError?.response?.data?.message || loginError?.message}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isRequestingOTP || isLoggingIn}
          className="shadow-lg shadow-emerald-900/60 gap-2 text-base font-bold"
        >
          {authMode === 'otp' ? (
            <>Send Verification OTP <ArrowRight className="w-5 h-5" /></>
          ) : (
            <>Sign In <ArrowRight className="w-5 h-5" /></>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-emerald-300/80">
        Don't have an AgriMart account?{' '}
        <Link to="/register" className="text-emerald-400 font-bold hover:underline">
          Register New Account
        </Link>
      </div>

      <OTPVerificationModal
        isOpen={!!pendingOTP && pendingOTP.mode !== 'register'}
        onClose={cancelOTP}
        phone={pendingOTP?.phone || watchPhoneOrEmail}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        isLoading={isVerifyingOTP}
        error={localError}
      />
    </AuthLayout>
  );
};

export default LoginPage;

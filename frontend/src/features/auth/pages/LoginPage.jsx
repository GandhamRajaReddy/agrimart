import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, Lock, ArrowRight, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';
import { loginSchema } from '../schemas/authSchemas';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import OTPVerificationModal from '../components/OTPVerificationModal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const LoginPage = () => {
  const [authMode, setAuthMode] = useState('otp'); // 'otp' | 'password'
  const {
    requestOTP,
    isRequestingOTP,
    verifyOTP,
    isVerifyingOTP,
    pendingOTP,
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
      authMode: 'otp',
      phoneOrEmail: '9876543210',
      password: '',
    },
  });

  const watchPhoneOrEmail = watch('phoneOrEmail');

  const onFormSubmit = async (data) => {
    setLocalError('');
    try {
      if (authMode === 'otp') {
        const cleanedPhone = data.phoneOrEmail.replace(/\D/g, '');
        await requestOTP(cleanedPhone, 'Farmer');
      } else {
        await login({
          phoneOrEmail: data.phoneOrEmail,
          password: data.password,
        });
      }
    } catch (err) {
      setLocalError(err.message || 'Authentication failed. Please check your inputs.');
    }
  };

  const handleVerifyOTP = async (otpCode) => {
    if (!pendingOTP?.phone) return;
    try {
      await verifyOTP({
        phone: pendingOTP.phone,
        otp: otpCode,
        role: pendingOTP.role || 'Farmer',
      });
    } catch (err) {
      setLocalError(err.message || 'Invalid OTP code. Please enter 123456.');
    }
  };

  // Quick Demo Login Helper
  const handleQuickDemoLogin = (role) => {
    let phone = '9876543210';
    if (role === 'Buyer') phone = '9812345678';
    if (role === 'Vendor') phone = '9765432109';

    setValue('phoneOrEmail', phone);
    setValue('authMode', 'otp');
    setAuthMode('otp');
    requestOTP(phone, role);
  };

  return (
    <AuthLayout
      title="Welcome Back to AgriMart"
      subtitle="Sign in to manage your crop orders, mandi auctions & AI insights"
    >
      {/* Auth Mode Toggle Tabs */}
      <div className="flex p-1.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 mb-6">
        <button
          type="button"
          onClick={() => {
            setAuthMode('otp');
            setValue('authMode', 'otp');
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

      {/* Main Login Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        <Input
          label={authMode === 'otp' ? 'Mobile Number' : 'Mobile Number or Email'}
          placeholder={authMode === 'otp' ? 'e.g. 9876543210' : 'e.g. 9876543210 or name@agrimart.in'}
          leftIcon={<Phone className="w-4 h-4" />}
          error={errors.phoneOrEmail?.message}
          {...register('phoneOrEmail')}
        />

        {authMode === 'password' && (
          <Input
            label="Password"
            type="password"
            placeholder="Enter your account password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
        )}

        {(localError || loginError) && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-300">
            {localError || loginError?.message}
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
            <>
              Send Verification OTP <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            <>
              Sign In <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </form>

      {/* Quick Demo Login Presets */}
      <div className="mt-8 pt-6 border-t border-emerald-800/50 space-y-3">
        <div className="flex items-center justify-between text-xs text-emerald-300/80">
          <span className="flex items-center gap-1 font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Instant Demo Logins:
          </span>
          <span className="text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
            1-Click Test
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('Farmer')}
            className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 hover:bg-emerald-800/40 text-left transition-colors text-xs"
          >
            <div className="font-bold text-white flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Farmer
            </div>
            <div className="text-[10px] text-emerald-300/70 truncate">Rajesh Patel</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('Buyer')}
            className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 hover:bg-emerald-800/40 text-left transition-colors text-xs"
          >
            <div className="font-bold text-white flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Buyer
            </div>
            <div className="text-[10px] text-emerald-300/70 truncate">Priya Sharma</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('Vendor')}
            className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 hover:bg-emerald-800/40 text-left transition-colors text-xs"
          >
            <div className="font-bold text-white flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Merchant
            </div>
            <div className="text-[10px] text-emerald-300/70 truncate">Kisan Equipment</div>
          </button>
        </div>
      </div>

      {/* Footer link to Register */}
      <div className="mt-6 text-center text-xs text-emerald-300/80">
        Don't have an AgriMart account?{' '}
        <Link to="/register" className="text-emerald-400 font-bold hover:underline">
          Register New Account
        </Link>
      </div>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={!!pendingOTP}
        phone={pendingOTP?.phone || watchPhoneOrEmail}
        demoOtp={pendingOTP?.demoOtp || '123456'}
        onVerify={handleVerifyOTP}
        onResend={() => requestOTP(pendingOTP?.phone || watchPhoneOrEmail, pendingOTP?.role || 'Farmer')}
        isLoading={isVerifyingOTP}
        error={localError}
      />
    </AuthLayout>
  );
};

export default LoginPage;

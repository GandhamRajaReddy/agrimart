import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Phone, MapPin, Sprout, Building, ArrowRight, CheckSquare, Square } from 'lucide-react';
import { registerSchema } from '../schemas/authSchemas';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import RoleSelectorCard from '../components/RoleSelectorCard';
import OTPVerificationModal from '../components/OTPVerificationModal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const INDIAN_STATES = [
  'Madhya Pradesh', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra',
  'Rajasthan', 'Gujarat', 'Karnataka', 'Telangana', 'Andhra Pradesh',
  'Tamil Nadu', 'Bihar', 'West Bengal',
];

export const RegisterPage = () => {
  const {
    register: registerUser, isRegistering, registerError,
    verifyOTP, isVerifyingOTP, pendingOTP, requestOTP, cancelPendingOTP,
  } = useAuth();
  const [localError, setLocalError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Farmer',
      fullName: '',
      phone: '',
      email: '',
      state: 'Madhya Pradesh',
      district: '',
      mandi: 'Indore Grain Mandi',
      landAreaAcres: 5,
      primaryCrop: 'Wheat & Soybean',
      companyName: '',
      gstin: '',
      agreeToTerms: true,
    },
  });

  const selectedRole = watch('role');
  const agreeToTerms = watch('agreeToTerms');

  const onFormSubmit = async (data) => {
    setLocalError('');
    try {
      await registerUser(data);
    } catch (err) {
      setLocalError(err.response?.data?.detail || err.response?.data?.message || err.message || 'Registration failed.');
    }
  };

  const handleVerifyOTP = async (otpCode) => {
    if (!pendingOTP?.phone) return;
    setLocalError('');
    try {
      await verifyOTP({
        phone: pendingOTP.phone,
        otp: otpCode,
        role: pendingOTP.role,
        profileData: pendingOTP.profileData,
      });
    } catch (err) {
      setLocalError(err.response?.data?.detail || err.response?.data?.message || err.message || 'Invalid or expired OTP code.');
    }
  };

  const handleResendOTP = async () => {
    if (!pendingOTP?.phone) return;
    setLocalError('');
    try {
      if (pendingOTP.mode === 'register' && pendingOTP.profileData) {
        await registerUser(pendingOTP.profileData);
      } else {
        await requestOTP(pendingOTP.phone, pendingOTP.role || 'Farmer');
      }
    } catch (err) {
      setLocalError(err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to resend OTP.');
    }
  };

  return (
    <AuthLayout
      title="Create Your AgriMart Account"
      subtitle="Join India's premier digital agricultural ecosystem for farmers & merchants"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        <RoleSelectorCard
          selectedRole={selectedRole}
          onSelectRole={(role) => setValue('role', role, { shouldValidate: true })}
          error={errors.role?.message}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.fullName?.message}
            autoComplete="name"
            {...register('fullName')}
          />
          <Input
            label="10-Digit Mobile Number"
            placeholder="e.g. 9876543210"
            leftIcon={<Phone className="w-4 h-4" />}
            error={errors.phone?.message}
            autoComplete="tel"
            {...register('phone')}
          />
        </div>

        <Input
          label="Email (optional)"
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          autoComplete="email"
          {...register('email')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-emerald-200">State</label>
            <select
              {...register('state')}
              className="w-full h-11 px-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
            >
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state} className="bg-emerald-900 text-white">{state}</option>
              ))}
            </select>
            {errors.state?.message && <p className="text-xs text-red-400">{errors.state.message}</p>}
          </div>
          <Input
            label="District / Location"
            placeholder="e.g. Indore, Ujjain, Dewas"
            leftIcon={<MapPin className="w-4 h-4" />}
            error={errors.district?.message}
            {...register('district')}
          />
        </div>

        {selectedRole === 'Farmer' && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-4">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-400" /> Farmer / Agricultural Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Land Size (Acres)" type="number" step="0.5" placeholder="e.g. 5.5" error={errors.landAreaAcres?.message} {...register('landAreaAcres')} />
              <Input label="Primary Crops Grown" placeholder="e.g. Wheat, Soybean, Cotton" error={errors.primaryCrop?.message} {...register('primaryCrop')} />
            </div>
            <Input label="Nearest Mandi Hub" placeholder="e.g. Indore Grain Mandi" error={errors.mandi?.message} {...register('mandi')} />
          </div>
        )}

        {(selectedRole === 'Buyer' || selectedRole === 'Vendor') && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-4">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4 text-amber-400" /> Business Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Company / Firm Name" placeholder="e.g. Apex Grain Traders" error={errors.companyName?.message} {...register('companyName')} />
              <Input label="GSTIN (Optional)" placeholder="Enter GSTIN" error={errors.gstin?.message} {...register('gstin')} />
            </div>
          </div>
        )}

        <div className="pt-1">
          <label
            onClick={() => setValue('agreeToTerms', !agreeToTerms, { shouldValidate: true })}
            className="flex items-start gap-2.5 text-xs text-emerald-200/80 cursor-pointer select-none"
          >
            <div className="mt-0.5 text-emerald-400">
              {agreeToTerms ? <CheckSquare className="w-4 h-4 fill-emerald-400/20" /> : <Square className="w-4 h-4 text-emerald-600" />}
            </div>
            <span>I agree to the <span className="text-emerald-300 font-bold">Terms of Service</span>, <span className="text-emerald-300 font-bold">Farmer Data Privacy</span> and SMS OTP alerts.</span>
          </label>
          {errors.agreeToTerms?.message && <p className="text-xs text-red-400 mt-1">{errors.agreeToTerms.message}</p>}
        </div>

        {(localError || registerError) && (
          <div role="alert" className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-300">
            {localError || registerError?.response?.data?.detail || registerError?.response?.data?.message || registerError?.message}
          </div>
        )}

        <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isRegistering} className="shadow-lg shadow-emerald-900/60 gap-2 text-base font-bold">
          Create Account & Verify OTP <ArrowRight className="w-5 h-5" />
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-emerald-300/80">
        Already have an account? <Link to="/login" className="text-emerald-400 font-bold hover:underline">Sign In</Link>
      </div>

      <OTPVerificationModal
        isOpen={!!pendingOTP && pendingOTP.mode === 'register'}
        onClose={() => { cancelPendingOTP(); setLocalError(''); }}
        phone={pendingOTP?.phone || watch('phone')}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        isLoading={isVerifyingOTP}
        error={localError}
      />
    </AuthLayout>
  );
};

export default RegisterPage;

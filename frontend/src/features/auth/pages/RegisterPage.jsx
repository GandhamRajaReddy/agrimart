import React, { useEffect, useState } from 'react';
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
import axiosClient from '../../../services/http/axiosClient';

export const RegisterPage = () => {
  const {
    register: registerUser, isRegistering, registerError,
    verifyOTP, isVerifyingOTP, pendingOTP, requestOTP,
  } = useAuth();
  const [localError, setLocalError] = useState('');
  const [districtOptions, setDistrictOptions] = useState([]);
  const [talukOptions, setTalukOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [villageSearch, setVillageSearch] = useState('');
  const [locationError, setLocationError] = useState('');

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
      state: 'Karnataka',
      district: '',
      taluk: '',
      village: '',
      mandi: '',
      landAreaAcres: 5,
      primaryCrop: 'Wheat & Soybean',
      companyName: '',
      gstin: '',
      agreeToTerms: true,
    },
  });

  const selectedRole = watch('role');
  const selectedDistrict = watch('district');
  const selectedTaluk = watch('taluk');
  const selectedVillage = watch('village');
  const agreeToTerms = watch('agreeToTerms');

  useEffect(() => {
    let active = true;
    axiosClient.get('/locations/karnataka/', { params: { level: 'district' } })
      .then(({ data }) => { if (active) setDistrictOptions(data.results || []); })
      .catch(() => { if (active) setLocationError('Could not load Karnataka districts. Check that the backend is running.'); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selectedDistrict) { setTalukOptions([]); return undefined; }
    let active = true;
    axiosClient.get('/locations/karnataka/', { params: { level: 'taluk', district: selectedDistrict } })
      .then(({ data }) => { if (active) setTalukOptions(data.results || []); })
      .catch(() => { if (active) setLocationError('Could not load taluks for this district.'); });
    return () => { active = false; };
  }, [selectedDistrict]);

  useEffect(() => {
    if (!selectedDistrict || !selectedTaluk || villageSearch.trim().length < 2) {
      setVillageOptions([]);
      return undefined;
    }
    let active = true;
    const timeout = window.setTimeout(() => {
      axiosClient.get('/locations/karnataka/', { params: {
        level: 'village', district: selectedDistrict, taluk: selectedTaluk, search: villageSearch.trim(),
      } }).then(({ data }) => {
        if (active) {
          setVillageOptions(data.results || []);
          if (data.data_ready === false) setLocationError('Village data is not installed yet. Run python manage.py sync_karnataka_locations in backend/django.');
          else setLocationError('');
        }
      }).catch(() => { if (active) setLocationError('Could not search villages. Please try again.'); });
    }, 250);
    return () => { active = false; window.clearTimeout(timeout); };
  }, [selectedDistrict, selectedTaluk, villageSearch]);

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

        <input type="hidden" {...register('state')} value="Karnataka" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-emerald-200">State</label>
            <div className="flex h-11 items-center rounded-xl border border-emerald-800/60 bg-emerald-950/60 px-3.5 text-sm text-white">Karnataka</div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-emerald-200">District</label>
            <select value={selectedDistrict || ''} onChange={(event) => {
              setValue('district', event.target.value, { shouldValidate: true });
              setValue('taluk', '', { shouldValidate: true });
              setValue('village', '', { shouldValidate: true });
              setVillageSearch('');
              setVillageOptions([]);
            }} className="w-full h-11 px-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30">
              <option value="" className="bg-emerald-900">Select district</option>
              {districtOptions.map((item) => <option key={item.code} value={item.name} className="bg-emerald-900">{item.name}</option>)}
            </select>
            {errors.district?.message && <p className="text-xs text-red-400">{errors.district.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-emerald-200">Taluk</label>
            <select value={selectedTaluk || ''} disabled={!selectedDistrict} onChange={(event) => {
              setValue('taluk', event.target.value, { shouldValidate: true });
              setValue('village', '', { shouldValidate: true });
              setVillageSearch('');
              setVillageOptions([]);
            }} className="w-full h-11 px-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-white text-sm disabled:opacity-50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30">
              <option value="" className="bg-emerald-900">Select taluk</option>
              {talukOptions.map((item) => <option key={item.code} value={item.name} className="bg-emerald-900">{item.name}</option>)}
            </select>
            {errors.taluk?.message && <p className="text-xs text-red-400">{errors.taluk.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-emerald-200">Village</label>
            <input value={villageSearch} disabled={!selectedTaluk} onChange={(event) => {
              setVillageSearch(event.target.value);
              setValue('village', '', { shouldValidate: true });
            }} placeholder="Type at least 2 letters to search" className="w-full h-11 px-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-white text-sm disabled:opacity-50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30" />
            <select value={selectedVillage || ''} disabled={!selectedTaluk || villageOptions.length === 0} onChange={(event) => {
              setValue('village', event.target.value, { shouldValidate: true });
              const chosen = villageOptions.find((item) => item.name === event.target.value);
              if (chosen?.pincode) setValue('villagePincode', chosen.pincode);
            }} className="w-full h-11 px-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-white text-sm disabled:opacity-50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30">
              <option value="" className="bg-emerald-900">{villageOptions.length ? 'Select village' : 'Search results appear here'}</option>
              {villageOptions.map((item) => <option key={item.code} value={item.name} className="bg-emerald-900">{item.name}</option>)}
            </select>
            {errors.village?.message && <p className="text-xs text-red-400">{errors.village.message}</p>}
            {villageSearch.trim().length >= 2 && villageOptions.length === 0 && !locationError && <p className="text-xs text-emerald-200/70">No matching villages found for this taluk.</p>}
          </div>
        </div>
        {locationError && <p role="status" className="text-xs text-amber-300">{locationError}</p>}

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

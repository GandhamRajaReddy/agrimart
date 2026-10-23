import axiosClient from '../../../services/http/axiosClient';

const getAuthPayload = (data) => ({
  success: data.success ?? true,
  token: data.token || data.access || null,
  refreshToken: data.refresh_token || data.refresh || null,
  user: data.user || null,
  message: data.message || '',
});

export const authApi = {
  // OTP endpoints are development-only until an SMS provider is configured.
  requestOTP: async (phone, role = 'Farmer') => {
    const response = await axiosClient.post('/auth/request-otp/', { phone, role });
    const data = response.data;
    return {
      success: data.success ?? true,
      message: data.message || '',
      otpRefId: data.otp_ref_id || data.otpRefId || null,
      // Never invent a fallback OTP. Only the backend may return a dev OTP.
      demoOtp: data.demo_otp || data.demoOtp || null,
    };
  },

  verifyOTP: async ({ phone, otp, role, profileData }) => {
    const response = await axiosClient.post('/auth/verify-otp/', {
      phone,
      otp,
      role,
      full_name: profileData?.fullName,
      email: profileData?.email,
      state: profileData?.state,
      district: profileData?.district,
      taluk: profileData?.taluk,
      village: profileData?.village,
      mandi: profileData?.mandi,
      land_area_acres: profileData?.landAreaAcres,
      primary_crop: profileData?.primaryCrop,
      company_name: profileData?.companyName,
      gstin: profileData?.gstin,
    });
    return {
      ...getAuthPayload(response.data),
      message: response.data.message || 'Authentication successful',
    };
  },

  loginWithPassword: async ({ phoneOrEmail, password }) => {
    const response = await axiosClient.post('/auth/login/', {
      phone_or_email: phoneOrEmail,
      password,
    });
    return {
      ...getAuthPayload(response.data),
      message: response.data.message || 'Logged in successfully',
    };
  },

  registerUser: async (registrationData) => {
    const response = await axiosClient.post('/auth/register/', {
      full_name: registrationData.fullName,
      phone: registrationData.phone,
      email: registrationData.email,
      role: registrationData.role,
      state: registrationData.state,
      district: registrationData.district,
      taluk: registrationData.taluk,
      village: registrationData.village,
      mandi: registrationData.mandi,
      land_area_acres: registrationData.landAreaAcres,
      primary_crop: registrationData.primaryCrop,
      company_name: registrationData.companyName,
      gstin: registrationData.gstin,
    });
    const data = response.data;
    return {
      success: data.success ?? true,
      otpRequired: data.otp_required ?? true,
      message: data.message || 'Registration OTP requested.',
      phone: data.phone || registrationData.phone,
      demoOtp: data.demo_otp || null,
    };
  },

  getProfile: async () => {
    const response = await axiosClient.get('/auth/me/');
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('agrimart_refresh_token');
    if (!refreshToken) return { success: true };
    try {
      await axiosClient.post('/auth/logout/', { refresh_token: refreshToken });
    } catch {
      // Always clear local auth state even if the API is unavailable.
    }
    return { success: true };
  },
};

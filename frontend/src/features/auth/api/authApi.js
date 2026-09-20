import axiosClient from '../../../services/http/axiosClient';

export const authApi = {
  // 1. Request OTP for login or registration
  requestOTP: async (phone, role = 'Farmer') => {
    const response = await axiosClient.post('/auth/request-otp/', { phone, role });
    const data = response.data;
    return {
      success: data.success ?? true,
      message: data.message,
      otpRefId: data.otp_ref_id || data.otpRefId,
      demoOtp: data.demo_otp || data.demoOtp || '123456',
    };
  },

  // 2. Verify OTP and authenticate / register
  verifyOTP: async ({ phone, otp, role, profileData }) => {
    const response = await axiosClient.post('/auth/verify-otp/', {
      phone,
      otp,
      role,
      full_name: profileData?.fullName,
      email: profileData?.email,
      state: profileData?.state,
      district: profileData?.district,
      mandi: profileData?.mandi,
      ...profileData,
    });
    const data = response.data;
    return {
      success: data.success ?? true,
      token: data.token,
      user: data.user,
      message: data.message || 'Authentication successful',
    };
  },

  // 3. Login with password
  loginWithPassword: async ({ phoneOrEmail, password }) => {
    const response = await axiosClient.post('/auth/login/', {
      phone_or_email: phoneOrEmail,
      password,
    });
    const data = response.data;
    return {
      success: data.success ?? true,
      token: data.token,
      user: data.user,
      message: data.message || 'Logged in successfully',
    };
  },

  // 4. Register new user
  registerUser: async (registrationData) => {
    const response = await axiosClient.post('/auth/register/', {
      full_name: registrationData.fullName,
      phone: registrationData.phone,
      email: registrationData.email,
      role: registrationData.role,
      state: registrationData.state,
      district: registrationData.district,
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
      message: data.message || 'Registration validated. OTP sent to mobile number.',
      phone: registrationData.phone,
      demoOtp: data.demo_otp || '123456',
    };
  },

  // 5. Get current user profile
  getProfile: async () => {
    const response = await axiosClient.get('/auth/me/');
    return response.data;
  },

  // 6. Logout
  logout: async () => {
    const refreshToken = localStorage.getItem('agrimart_refresh_token');
    try {
      await axiosClient.post('/auth/logout/', { refresh_token: refreshToken });
    } catch (e) {
      // Ignore network errors on local state wipe
    }
    return { success: true };
  }
};

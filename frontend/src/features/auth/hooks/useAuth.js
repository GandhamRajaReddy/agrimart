import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import {
  setCredentials,
  setPendingOTP,
  clearPendingOTP,
  logout as logoutAction,
  selectCurrentUser,
  selectIsAuthenticated,
  selectPendingOTP,
  setError,
} from '../authSlice';

export const ROLE_HOME_PATHS = Object.freeze({
  FARMER: '/farmer/dashboard',
  BUYER: '/buyer/dashboard',
  SELLER: '/vendor/dashboard',
  EXPERT: '/expert/dashboard',
  STAFF: '/staff/dashboard',
  ADMIN: '/admin',
});

const normalizeRole = (role) => String(role || '').trim().toUpperCase();

export const getRoleHomePath = (role) =>
  ROLE_HOME_PATHS[normalizeRole(role)] || '/';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const pendingOTP = useSelector(selectPendingOTP);

  const redirectAfterLogin = (user) => {
    navigate(getRoleHomePath(user?.role), { replace: true });
  };

  const requestOTPMutation = useMutation({
    mutationFn: ({ phone, role }) => authApi.requestOTP(phone, role),
    onSuccess: (data, variables) => {
      dispatch(setPendingOTP({
        phone: variables.phone,
        role: variables.role || 'Farmer',
        refId: data.otpRefId,
        demoOtp: data.demoOtp || null,
      }));
    },
    onError: (err) => dispatch(setError(err.message || 'Failed to send OTP')),
  });

  const verifyOTPMutation = useMutation({
    mutationFn: (payload) => authApi.verifyOTP(payload),
    onSuccess: (data) => {
      if (data.token && data.user) {
        dispatch(setCredentials({
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
        }));
        dispatch(clearPendingOTP());
        redirectAfterLogin(data.user);
      }
    },
    onError: (err) => dispatch(setError(err.message || 'Invalid OTP code')),
  });

  const loginMutation = useMutation({
    mutationFn: (credentials) => authApi.loginWithPassword(credentials),
    onSuccess: (data) => {
      if (data.token && data.user) {
        dispatch(setCredentials({
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
        }));
        redirectAfterLogin(data.user);
      }
    },
    onError: (err) => dispatch(setError(err.message || 'Login failed')),
  });

  const registerMutation = useMutation({
    mutationFn: (formData) => authApi.registerUser(formData),
    onSuccess: (data, formData) => {
      if (data.otpRequired) {
        dispatch(setPendingOTP({
          phone: formData.phone,
          role: formData.role,
          profileData: formData,
          demoOtp: data.demoOtp || null,
          mode: 'register',
        }));
      }
    },
    onError: (err) => dispatch(setError(err.message || 'Registration failed')),
  });

  const handleLogout = async () => {
    await authApi.logout();
    dispatch(logoutAction());
    navigate('/login', { replace: true });
  };

  return {
    user: currentUser,
    isAuthenticated,
    pendingOTP,
    cancelPendingOTP: () => dispatch(clearPendingOTP()),

    requestOTP: (phone, role = 'Farmer') => requestOTPMutation.mutateAsync({ phone, role }),
    isRequestingOTP: requestOTPMutation.isPending,
    requestOTPError: requestOTPMutation.error,

    verifyOTP: verifyOTPMutation.mutateAsync,
    isVerifyingOTP: verifyOTPMutation.isPending,
    verifyOTPError: verifyOTPMutation.error,

    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    logout: handleLogout,
  };
};

export default useAuth;

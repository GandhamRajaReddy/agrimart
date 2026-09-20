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

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const pendingOTP = useSelector(selectPendingOTP);

  // 1. Request OTP Mutation
  const requestOTPMutation = useMutation({
    mutationFn: ({ phone, role }) => authApi.requestOTP(phone, role),
    onSuccess: (data, variables) => {
      dispatch(
        setPendingOTP({
          phone: variables.phone,
          role: variables.role || 'Farmer',
          refId: data.otpRefId,
          demoOtp: data.demoOtp || '123456',
        })
      );
    },
    onError: (err) => {
      dispatch(setError(err.message || 'Failed to send OTP'));
    },
  });

  // 2. Verify OTP Mutation
  const verifyOTPMutation = useMutation({
    mutationFn: (payload) => authApi.verifyOTP(payload),
    onSuccess: (data) => {
      if (data.token && data.user) {
        dispatch(setCredentials({ user: data.user, token: data.token }));
        dispatch(clearPendingOTP());
        navigate('/', { replace: true });
      }
    },
    onError: (err) => {
      dispatch(setError(err.message || 'Invalid OTP code'));
    },
  });

  // 3. Login Mutation (Password / Email)
  const loginMutation = useMutation({
    mutationFn: (credentials) => authApi.loginWithPassword(credentials),
    onSuccess: (data) => {
      if (data.token && data.user) {
        dispatch(setCredentials({ user: data.user, token: data.token }));
        navigate('/', { replace: true });
      }
    },
    onError: (err) => {
      dispatch(setError(err.message || 'Login failed'));
    },
  });

  // 4. Register Mutation
  const registerMutation = useMutation({
    mutationFn: (formData) => authApi.registerUser(formData),
    onSuccess: (data, formData) => {
      if (data.otpRequired) {
        dispatch(
          setPendingOTP({
            phone: formData.phone,
            role: formData.role,
            profileData: formData,
            demoOtp: data.demoOtp || '123456',
            mode: 'register',
          })
        );
      }
    },
    onError: (err) => {
      dispatch(setError(err.message || 'Registration failed'));
    },
  });

  // 5. Logout Handler
  const handleLogout = () => {
    authApi.logout();
    dispatch(logoutAction());
    navigate('/login');
  };

  return {
    user: currentUser,
    isAuthenticated,
    pendingOTP,
    
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

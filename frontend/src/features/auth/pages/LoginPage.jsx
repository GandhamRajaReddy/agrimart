import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, Lock, ArrowRight } from 'lucide-react';
import { loginSchema } from '../schemas/authSchemas';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const LoginPage = () => {
  const { login, isLoggingIn, loginError } = useAuth();
  const [localError, setLocalError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { phoneOrEmail: '', password: '' },
  });

  const onFormSubmit = async (data) => {
    setLocalError('');
    try {
      await login({ phoneOrEmail: data.phoneOrEmail, password: data.password });
    } catch (err) {
      setLocalError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Authentication failed. Please check your inputs.'
      );
    }
  };


  return (
    <AuthLayout
      title="Welcome Back to AgriMart"
      subtitle="Sign in to manage your crop orders, mandi auctions & AI insights"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        <Input
          label="Mobile Number or Email"
          placeholder="Enter mobile number or email"
          leftIcon={<Phone className="w-4 h-4" />}
          error={errors.phoneOrEmail?.message}
          autoComplete="username"
          {...register('phoneOrEmail')}
        />

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
          isLoading={isLoggingIn}
          className="shadow-lg shadow-emerald-900/60 gap-2 text-base font-bold"
        >
          Sign In <ArrowRight className="w-5 h-5" />
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-emerald-300/80">
        Don't have an AgriMart account?{' '}
        <Link to="/register" className="text-emerald-400 font-bold hover:underline">
          Register New Account
        </Link>
      </div>

    </AuthLayout>
  );
};

export default LoginPage;

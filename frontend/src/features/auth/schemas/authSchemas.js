import { z } from 'zod';

export const phoneRegex = /^[6-9]\d{9}$/;

export const phoneSchema = z.string().trim().refine((val) => {
  const cleaned = val.replace(/\D/g, '');
  return cleaned.length === 10 && /^[6-9]/.test(cleaned);
}, {
  message: 'Enter a valid 10-digit Indian mobile number (e.g. 9876543210)',
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain numbers only'),
});

export const loginSchema = z.object({
  authMode: z.enum(['otp', 'password']).default('otp'),
  phoneOrEmail: z.string().min(1, 'Phone number or email is required').refine((val) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const cleanedPhone = val.replace(/\D/g, '');
    const isPhone = cleanedPhone.length === 10 && /^[6-9]/.test(cleanedPhone);
    return isEmail || isPhone;
  }, {
    message: 'Enter a valid 10-digit mobile number or email address',
  }),
  password: z.string().optional(),
}).refine((data) => {
  if (data.authMode === 'password') {
    return !!data.password && data.password.length >= 6;
  }
  return true;
}, {
  message: 'Password must be at least 6 characters long',
  path: ['password'],
});

export const registerSchema = z.object({
  role: z.enum(['Farmer', 'Buyer', 'Vendor'], {
    required_error: 'Please select a role to register',
  }),
  fullName: z.string().min(2, 'Full Name must be at least 2 characters long'),
  phone: phoneSchema,
  email: z.string().email('Invalid email address').or(z.literal('')).optional(),
  state: z.string().min(1, 'Please select your State'),
  district: z.string().min(1, 'Please enter your District / Location'),
  
  // Role-specific fields
  mandi: z.string().optional(),
  landAreaAcres: z.coerce.number().min(0, 'Land area cannot be negative').optional(),
  primaryCrop: z.string().optional(),
  companyName: z.string().optional(),
  gstin: z.string().optional(),
  
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and privacy policy',
  }),
});

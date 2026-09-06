const { z } = require('zod');

const nameSchema = z
  .string()
  .min(20, 'Name must be at least 20 characters')
  .max(60, 'Name must be at most 60 characters');

const addressSchema = z
  .string()
  .max(400, 'Address must be at most 400 characters');

const emailSchema = z.string().email('Must be a valid email address');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Password must include at least one special character'
  );

const ratingValueSchema = z
  .number()
  .int('Rating must be a whole number')
  .min(1, 'Rating must be at least 1')
  .max(5, 'Rating must be at most 5');

const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

const adminCreateUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  role: z.enum(['ADMIN', 'NORMAL_USER', 'STORE_OWNER']),
});

const adminCreateStoreSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  ownerId: z.number().int().positive().optional(),
});

const submitRatingSchema = z.object({
  ratingValue: ratingValueSchema,
});

module.exports = {
  signupSchema,
  loginSchema,
  updatePasswordSchema,
  adminCreateUserSchema,
  adminCreateStoreSchema,
  submitRatingSchema,
};

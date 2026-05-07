import { z } from 'zod';

export const registerDto = z.object({
  name: z
    .string({ message: 'Name is required.' })
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not exceed 100 characters.'),

  email: z
    .string({ message: 'Email is required.' })
    .email('Must be a valid email address.'),

  password: z
    .string({ message: 'Password is required.' })
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password must not exceed 128 characters.'),
});

export const loginDto = z.object({
  email: z
    .string({ message: 'Email is required.' })
    .email('Must be a valid email address.'),

  password: z
    .string({ message: 'Password is required.' })
    .min(1, 'Password is required.'),
});

export type RegisterDto = z.infer<typeof registerDto>;
export type LoginDto = z.infer<typeof loginDto>;

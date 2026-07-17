import { z } from 'zod';

export const registerSchema = z.object({
    userName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    age: z.number().optional(),
    gender: z.enum(['male', 'female']).optional()
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});
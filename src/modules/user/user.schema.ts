import { z } from 'zod';

export const updateProfileSchema = z.object({
    userName: z.string().min(3).optional(),
    age: z.coerce.number().optional(),
    gender: z.enum(['male', 'female']).optional()
});

export const updatePasswordSchema = z.object({
    oldPassword: z.string().min(1),
    newPassword: z.string().min(6)
});
import { z } from 'zod';

export const createPostSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1)
});

export const updatePostSchema = z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional()
});

export const reactionSchema = z.object({
    type: z.enum(['like', 'love', 'haha', 'wow', 'sad', 'angry']).default('like')
});
import { z } from 'zod';

export const createCommentSchema = z.object({
    content: z.string().min(1)
});

export const reactionSchema = z.object({
    type: z.enum(['like', 'love', 'haha', 'wow', 'sad', 'angry']).default('like')
});
import { z } from 'zod';

export const resumeSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    content: z.string().min(1, { message: "Content is required" }),
    score: z.number().int().optional(),
    keywords: z.array(z.string()).optional(),
    targetJobDescriptions: z.array(z.string()).optional(),
});

export type ResumeFormData = z.infer<typeof resumeSchema>;
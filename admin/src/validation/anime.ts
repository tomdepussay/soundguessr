import { z } from "zod";

export const AnimeSchema = z.object({
    isActive: z.boolean(),
    title: z.string().min(3, "Le titre doit faire au moins 3 caractères."),
    top100: z.boolean(),
    image: z.instanceof(File).optional(),
})
import { z } from "zod";

export const SeasonSchema = z.object({
    name: z.string().min(3, "Le nom doit faire au moins 3 caractères.")
})
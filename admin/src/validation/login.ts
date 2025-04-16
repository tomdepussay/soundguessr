import { z } from "zod"

export const LoginSchema = z.object({
    email: z.string().email("L'email doit être valide."),
    password: z.string()
})
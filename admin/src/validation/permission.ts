import { z } from "zod";

export const PermissionSchema = z.object({
    name: z.string().min(3, "Le nom doit faire au moins 3 caractères."),
    description: z.string().optional(),
    roles: z.array(z.string()).optional()
})
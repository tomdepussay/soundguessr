import { z } from "zod";

// const passwordSchema = z.string()
//   .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
//   .regex(/[a-zA-Z]/, { message: "Le mot de passe doit contenir des lettres." })
//   .regex(/[0-9]/, { message: "Le mot de passe doit contenir des chiffres." })
//   .regex(/[@$!%*?&]/, { message: "Le mot de passe doit contenir un caractère spécial." });

const passwordSchema = z.string()
.min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." });

export const  SignupFormSchema = z.object({
    username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
    email: z.string().email("L'email doit être valide."),
    password: passwordSchema,
    confirmPassword: z.string()
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Les mots de passe ne correspondent pas",
            path: ["confirmPassword"]
        });
    }
})
'use server'

import { z } from "zod"
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'
import { createSession } from "@/src/lib/session"

const prisma = new PrismaClient()

// const passwordSchema = z.string()
//   .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
//   .regex(/[a-zA-Z]/, { message: "Le mot de passe doit contenir des lettres." })
//   .regex(/[0-9]/, { message: "Le mot de passe doit contenir des chiffres." })
//   .regex(/[@$!%*?&]/, { message: "Le mot de passe doit contenir un caractère spécial." });

const passwordSchema = z.string()
.min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." });

const  SignupFormSchema = z.object({
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

export async function signup(state: any, formData: { get: (arg0: string) => any }){
    
    const validationResult = SignupFormSchema.safeParse({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword")
    });

    if (!validationResult.success) {
        return {
            // errors: validationResult.error.errors
            errors: validationResult.error.flatten().fieldErrors
        }
    }

    const { username, email, password } = validationResult.data;

    const user = await prisma.users.findFirst({
        where: {
            OR: [
                { username },
                { email }
            ]
        }
    });

    if(user){
        return {
            errors: {
                username: user.username
                    ? "Ce nom d'utilisateur est déjà utilisé."
                    : null,
                email: user.email
                    ? "Cet email est déjà utilisé."
                    : null,
                password: null,
                confirmPassword: null
            }
        }
    }

    const hash = await bcrypt.hash(password, 12);

    const newUser = await prisma.users.create({
        data: {
            username: username,
            email: email,
            password: hash
        }
    });

    await createSession(newUser.id_user);

}
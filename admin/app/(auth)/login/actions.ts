'use server'

import { z } from "zod"
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'
import { createSession } from "@/src/lib/session"

const prisma = new PrismaClient()

const LoginSchema = z.object({
    email: z.string().email("L'email doit être valide."),
    password: z.string()
})

export async function login(state: any, formData: { get: (arg0: string) => any }){

    const validationResult = LoginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password")
    });
    
    if (!validationResult.success) {
        return {
            error: "Email ou mot de passe incorrect."
        }
    }

    const { email, password } = validationResult.data;

    const user = await prisma.users.findFirst({
        where: { email }
    });

    if(!user){
        return {
            error: "Email ou mot de passe incorrect."
        }
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return {
            error: "Email ou mot de passe incorrect."
        }
    }

    await createSession(user.id_user)
}
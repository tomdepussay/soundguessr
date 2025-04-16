'use server'

import { LoginSchema } from "@/src/validation/login"
import prisma from "@/src/lib/prisma"
import bcrypt from 'bcrypt'
import { createSession } from "@/src/lib/session"

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

    const user = await prisma.user.findFirst({
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

    await createSession(user.id)
}
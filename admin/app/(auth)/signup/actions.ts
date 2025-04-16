'use server'

import { SignupFormSchema } from "@/src/validation/signup"
import prisma from "@/src/lib/prisma"
import bcrypt from 'bcrypt'
import { createSession } from "@/src/lib/session"

export async function signup(state: any, formData: { get: (arg0: string) => any }){
    
    const validationResult = SignupFormSchema.safeParse({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword")
    });

    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        }
    }

    const { username, email, password } = validationResult.data;

    const user = await prisma.user.findFirst({
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

    const newUser = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hash,
            roleId: 4
        }
    });

    await createSession(newUser.id);

}
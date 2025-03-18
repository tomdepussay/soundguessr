"use server"

import { PrismaClient } from "@prisma/client"
import { z } from "zod"

const prisma = new PrismaClient()

const RoleSchema = z.object({
    name: z.string().min(3, "Le nom doit faire au moins 3 caractères.")
})

export async function editRole(state: any, formData: any, id_role: number){

    const validationResult = RoleSchema.safeParse({
        name: formData.get("name")
    });

    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        }
    }

    await prisma.roles.update({
        where: { id_role },
        data: {
            name: validationResult.data.name
        }
    })
}
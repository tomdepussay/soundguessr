'use server'

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function test(){
    const roles = await prisma.roles.findMany({
        orderBy: {
            id_role: 'asc'
        }
    })

    console.log(roles);

}
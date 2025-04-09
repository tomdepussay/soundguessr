import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma"
import { Permission } from "@/src/types/Permission";

export async function GET(
    req: Request
) {
    try {
        const roles = await prisma.role.findMany({
            select: {
                id: true,
                name: true,
            }
        });

        return NextResponse.json(roles);
    } catch(error) {
        return NextResponse.json({ error: "Erreur de la récupération" }, { status: 500 }); 
    }
}
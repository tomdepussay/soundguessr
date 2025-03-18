import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {

        const roles = await prisma.roles.findMany({
            select: {
                id_role: true,
                name: true
            }
        });

        return NextResponse.json(roles);
    } catch (error) {
        return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
    }
}

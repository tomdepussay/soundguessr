import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT({ params, req }: { params: { id: string }; req: Request }) {
    const { id } = params;
    const { name } = await req.json();

    try {
        const updatedRole = await prisma.roles.update({
            where: { 
                id_role: Number(id) 
            },
            data: { 
                name 
            },
        });
        return NextResponse.json(updatedRole);
    } catch (error) {
        return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
    }
}

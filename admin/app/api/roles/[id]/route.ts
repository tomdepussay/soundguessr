import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;
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

export async function DELETE(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await prisma.roles.delete({
            where: { 
                id_role: Number(id) 
            }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
    }
}

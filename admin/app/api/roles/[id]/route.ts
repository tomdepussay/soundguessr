import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Role } from "@/src/types/Role";

const prisma = new PrismaClient();

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { name } = await req.json();

    try {
        const updatedRole: Role = await prisma.role.update({
            where: { 
                id: Number(id) 
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
        await prisma.role.delete({
            where: { 
                id: Number(id) 
            }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
    }
}

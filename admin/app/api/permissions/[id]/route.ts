import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Permission } from "@/src/types/Permission";

const prisma = new PrismaClient();

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { name, description } = await req.json();

    try {
        const updatedPermission: Permission = await prisma.permissions.update({
            where: { 
                id_permission: Number(id) 
            },
            data: { 
                name,
                description
            },
        });
        return NextResponse.json(updatedPermission);
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
        await prisma.permissions.delete({
            where: { 
                id_permission: Number(id) 
            }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
    }
}

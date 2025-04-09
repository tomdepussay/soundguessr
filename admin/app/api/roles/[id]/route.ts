import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma"
import { Role } from "@/src/types/Role";
import { hasAccessApi } from "@/src/lib/session";

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { name } = await req.json();

    try {
        await hasAccessApi("admin.rights.roles.edit");

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
        if (error instanceof NextResponse) return error;

        return NextResponse.json(
            { error: "Erreur de mise à jour" },
            { status: 500 }
        );
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

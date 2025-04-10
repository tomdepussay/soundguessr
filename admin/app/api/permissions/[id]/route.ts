import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma"
import { Permission } from "@/src/types/Permission";

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { name, description, roles } = await req.json();

    try {
        const updatedPermission: Permission = await prisma.permission.update({
            where: { 
                id: Number(id) 
            },
            data: { 
                name,
                description,
                roles: {
                    set: roles.map((roleId: string | number) => ({ id: Number(roleId) }))
                }
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
        await prisma.permission.delete({
            where: { 
                id: Number(id) 
            }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
    }
}

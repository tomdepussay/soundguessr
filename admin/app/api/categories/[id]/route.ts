import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { Category } from "@/src/types/Category";

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { name, isActive } = await req.json();

    try {
        const updatedCategory: Category = await prisma.category.update({
            where: { 
                id: Number(id) 
            },
            data: { 
                name,
                isActive
            },
        });
        return NextResponse.json(updatedCategory);
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
        await prisma.category.delete({
            where: { 
                id: Number(id) 
            }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
    }
}

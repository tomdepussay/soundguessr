import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Category } from "@/src/types/Category";

const prisma = new PrismaClient();

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { name, is_active } = await req.json();

    try {
        const updatedCategory: Category = await prisma.categories.update({
            where: { 
                id_category: Number(id) 
            },
            data: { 
                name,
                is_active
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
        await prisma.categories.delete({
            where: { 
                id_category: Number(id) 
            }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
    }
}

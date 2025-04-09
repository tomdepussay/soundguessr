import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { Category } from "@/src/types/Category";

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {

        const category: Category | null = await prisma.category.findUnique({
            where: { id: Number(id) }
        });

        if(!category){
            return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
        }

        const updatedCategory = await prisma.category.update({
            where: { 
                id: Number(id) 
            },
            data: {
                isActive: !category.isActive
            }
        });
        return NextResponse.json(updatedCategory);
    } catch (error) {
        return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
    }
}
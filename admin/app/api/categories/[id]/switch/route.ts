import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Category } from "@/src/types/Category";

const prisma = new PrismaClient();

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {

        const category: Category | null = await prisma.categories.findUnique({
            where: { id_category: Number(id) }
        });

        if(!category){
            return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
        }

        const updatedCategory = await prisma.categories.update({
            where: { 
                id_category: Number(id) 
            },
            data: {
                is_active: !category.is_active
            }
        });
        return NextResponse.json(updatedCategory);
    } catch (error) {
        return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
    }
}
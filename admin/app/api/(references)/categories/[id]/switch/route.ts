import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { Category } from "@/src/types/Category";
import { hasAccessApi } from "@/src/lib/session";

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await hasAccessApi("admin.references.categories.active");

        const category: Category | null = await prisma.category.findUnique({
            where: { id: Number(id) }
        });

        if(!category){
            throw new NextResponse("Catégorie non trouvée", { status: 404 });
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
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { Category } from "@/src/types/Category";
import { hasAccessApi } from "@/src/lib/session";
import { CategorySchema } from "@/src/validation/category";

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { name, isActive } = await req.json();

    try {
        await hasAccessApi("admin.references.categories.edit");
        
        const { success } = CategorySchema.safeParse({ name, isActive });  
        
        if (!success) {
            throw NextResponse.json({ error: "Erreur de validation" }, { status: 422 });
        }

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
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await hasAccessApi("admin.references.categories.delete");

        await prisma.category.delete({
            where: { 
                id: Number(id) 
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { Category } from "@/src/types/Category";
import { hasAccessApi } from "@/src/lib/session";
import { CategorySchema } from "@/src/validation/category";

export async function GET(
    req: Request
) {

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const max = 10;

    try {
        await hasAccessApi("admin.references.categories");

        const categories: Category[] = await prisma.category.findMany({
            select: {
                id: true,
                isActive: true,
                name: true,
            },
            orderBy: {
                id: "asc"
            },
            skip: (page - 1) * max,
            take: max,
        });

        const total = await prisma.category.count();
        const pages = Math.ceil(total / max);

        return NextResponse.json({ categories, pages });
    } catch (error) {
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
    }
}

export async function POST(
    req: Request
){
    const { name, isActive } = await req.json();

    try {
        await hasAccessApi("admin.references.categories.add");
        
        const { success } = CategorySchema.safeParse({ name, isActive });  
    
        if (!success) {
            throw NextResponse.json({ error: "Erreur de validation" }, { status: 422 });
        }

        const newCategory: Category = await prisma.category.create({
            data: { 
                name,
                isActive
            },
        });

        return NextResponse.json(newCategory);
    } catch (error) {
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
    }
}
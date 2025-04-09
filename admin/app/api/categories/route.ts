import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { Category } from "@/src/types/Category";

export async function GET(
    req: Request
) {

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const max = 10;

    try {

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

        return NextResponse.json({
            categories,
            pages
        });
    } catch (error) {
        return NextResponse.json({ error: "Erreur de la récupération" }, { status: 500 });
    }
}

export async function POST(
    req: Request
){
    const { name, isActive } = await req.json();

    try {
        const newCategory: Category = await prisma.category.create({
            data: { 
                name,
                isActive
            },
        });
        return NextResponse.json(newCategory);
    } catch (error) {
        return NextResponse.json({ error: "Erreur de l'ajout" }, { status: 500 });
    }
}
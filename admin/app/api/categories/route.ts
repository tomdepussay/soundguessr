import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    req: Request
) {

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const max = 10;

    try {

        const categories = await prisma.categories.findMany({
            select: {
                id_category: true,
                name: true,
                is_active: true
            },
            orderBy: {
                id_category: "asc"
            },
            skip: (page - 1) * max,
            take: max,
        });

        const total = await prisma.categories.count();
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
    const { name, is_active } = await req.json();

    try {
        const newCategory = await prisma.categories.create({
            data: { 
                name,
                is_active
            },
        });
        return NextResponse.json(newCategory);
    } catch (error) {
        return NextResponse.json({ error: "Erreur de l'ajout" }, { status: 500 });
    }
}
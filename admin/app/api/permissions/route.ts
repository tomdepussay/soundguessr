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

        const permissions = await prisma.permissions.findMany({
            select: {
                id_permission: true,
                name: true,
                description: true
            },
            orderBy: {
                id_permission: "asc"
            },
            skip: (page - 1) * max,
            take: max,
        });

        const total = await prisma.permissions.count();
        const pages = Math.ceil(total / max);

        return NextResponse.json({
            permissions,
            pages
        });
    } catch (error) {
        return NextResponse.json({ error: "Erreur de la récupération" }, { status: 500 });
    }
}

export async function POST(
    req: Request
){
    const { name, description } = await req.json();

    try {
        const newPermission = await prisma.permissions.create({
            data: { 
                name,
                description
            },
        });
        return NextResponse.json(newPermission);
    } catch (error) {
        return NextResponse.json({ error: "Erreur de l'ajout" }, { status: 500 });
    }
}
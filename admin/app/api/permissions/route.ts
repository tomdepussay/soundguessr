import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {

        const permissions = await prisma.permissions.findMany({
            select: {
                id_permission: true,
                name: true,
                description: true
            },
            orderBy: {
                id_permission: "asc"
            }
        });

        return NextResponse.json(permissions);
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
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {

        const roles = await prisma.roles.findMany({
            select: {
                id_role: true,
                name: true
            },
            orderBy: {
                id_role: "asc"
            }
        });

        return NextResponse.json(roles);
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
    }
}

export async function POST(
    req: Request
){
    const { name } = await req.json();

    try {
        const newRole = await prisma.roles.create({
            data: { 
                name 
            },
        });
        return NextResponse.json(newRole);
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
    }
}
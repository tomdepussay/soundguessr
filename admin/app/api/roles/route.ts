import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Role } from "@/src/types/Role";

const prisma = new PrismaClient();

export async function GET() {
    try {

        const roles: Role[] = await prisma.role.findMany({
            select: {
                id: true,
                name: true
            },
            orderBy: {
                id: "asc"
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
        const newRole: Role = await prisma.role.create({
            data: { 
                name 
            },
        });
        return NextResponse.json(newRole);
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
    }
}
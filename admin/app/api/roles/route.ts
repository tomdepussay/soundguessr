import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Role } from "@/src/types/Role";
import { hasAccessApi } from "@/src/lib/session";

const prisma = new PrismaClient();

export async function GET() {

    try {
        await hasAccessApi("admin.rights.roles");

        const roles: Role[] = await prisma.role.findMany({
            select: {
                id: true,
                name: true,
                permissions: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    },
                    orderBy: {
                        id: "asc"
                    }
                }
            },
            orderBy: {
                id: "asc"
            }
        });

        return NextResponse.json(roles);
    } catch (error) {
        if (error instanceof NextResponse) return error;

        return NextResponse.json(
            { error: "Erreur lors de la récupération" },
            { status: 500 }
        );
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
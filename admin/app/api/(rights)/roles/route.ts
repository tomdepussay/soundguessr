import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma"
import { Role } from "@/src/types/Role";
import { hasAccessApi } from "@/src/lib/session";

export async function GET(
    req: Request
) {

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const max = 10;

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
            },
            skip: (page - 1) * max,
            take: max,
        });
        
        const total = await prisma.anime.count();
        const pages = Math.ceil(total / max);

        return NextResponse.json({ roles, pages });
    } catch (error) {
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
    }
}

export async function POST(
    req: Request
){
    const { name } = await req.json();

    try {
        await hasAccessApi("admin.rights.roles.add");

        const newRole: Role = await prisma.role.create({
            data: { 
                name 
            },
        });

        return NextResponse.json(newRole);
    } catch (error) {
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { Permission } from "@/src/types/Permission";

export async function GET(
    req: Request
) {

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const max = 10;

    try {

        const permissions: Permission[] = await prisma.permission.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                roles: {
                    select: {
                        id: true,
                        name: true,
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

        const total = await prisma.permission.count();
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
    const { name, description, roles } = await req.json();

    try {
        const newPermission: Permission = await prisma.permission.create({
            data: { 
                name,
                description,
                roles: {
                    connect: roles.map((roleId: string | number) => ({ id: Number(roleId) }))
                }
            }
        });
        return NextResponse.json(newPermission);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Erreur de l'ajout" }, { status: 500 });
    }
}
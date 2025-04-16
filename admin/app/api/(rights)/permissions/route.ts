import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { Permission } from "@/src/types/Permission";
import { hasAccessApi } from "@/src/lib/session";

export async function GET(
    req: Request
) {

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const max = 10;

    try {
        await hasAccessApi("admin.rights.permissions");

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

        const roles = await prisma.role.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                id: "asc"
            }
        });

        return NextResponse.json({ permissions, roles, pages });
    } catch (error) {
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
    }
}

export async function POST(
    req: Request
){
    const { name, description, roles } = await req.json();

    try {
        await hasAccessApi("admin.rights.permissions.add");

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
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
    }
}
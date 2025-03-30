import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Role } from "@/src/types/Role";
import { Permission } from "@/src/types/Permission";
import { disconnect } from "process";

const prisma = new PrismaClient();

export async function GET(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const permissions: Permission[] = await prisma.permission.findMany({
            select: {
                id: true,
                name: true,
                description: true
            },
            orderBy: {
                id: "asc"
            },
        });

        return NextResponse.json(permissions);
    } catch (error) {
        return NextResponse.json({ error: "Erreur de la récupération des permissions" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { permissionIds } = await req.json();

    try {

        const role: Role | null = await prisma.role.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                permissions: true
            }
        });

        if (!role) {
            return NextResponse.json({ error: "Role non trouvé" }, { status: 404 });
        }

        await prisma.role.update({
            where: {
                id: Number(id)
            },
            data: {
                permissions: {
                    disconnect: role?.permissions?.map(permission => ({ id: permission.id })) ?? [],
                    connect: permissionIds.map((permissionId: number) => ({ id: permissionId }))
                }
            }
        })

        return NextResponse.json({ message: "Permissions mises à jour" });

    } catch (error) {
        return NextResponse.json({ error: "Erreur de la récupération des permissions" }, { status: 500 });
    }
}
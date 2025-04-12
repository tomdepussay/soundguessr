import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma"
import { hasAccessApi } from "@/src/lib/session";
import { Role } from "@/src/types/Role";

export async function GET(
    req: Request
) {
    try {
        await hasAccessApi("admin.rights.permissions.roles");

        const roles: Role[] = await prisma.role.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc"
            }
        });

        return NextResponse.json(roles);
    } catch(error) {
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la récupération des rôles" }, { status: 500 });
    }
}
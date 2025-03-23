import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifySession } from "@/src/lib/session";
import { User } from "@/src/types/User";

const prisma = new PrismaClient();

export async function GET(
    req: Request
) {

    const session = await verifySession();
    if (!session) {
        return NextResponse.redirect("/login");
    }

    const { id_user } = session;

    try {

        const user: User | null = await prisma.users.findUnique({
            select: {
                id_user: true,
                email: true,
                username: true,
                id_role: true,
                id_picture: true
            },
            where: {
                id_user: id_user 
            }
        });

        if (user) {
            return NextResponse.json({ user });
        }
    } catch (error) {
        return NextResponse.json({ error: "Erreur de la récupération" }, { status: 500 });
    }
}
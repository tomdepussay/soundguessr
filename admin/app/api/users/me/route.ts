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

    const { id } = session;

    try {

        const user: User | null = await prisma.user.findUnique({
            select: {
                id: true,
                email: true,
                username: true,
                roleId: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    } 
                },
                activePictureId: true,
                activePicture: {
                    select: {
                        id: true,
                        link: true,
                    } 
                }
            },
            where: {
                id: id 
            }
        });

        if (user) {
            return NextResponse.json({ user });
        }
    } catch (error) {
        return NextResponse.json({ error: "Erreur de la récupération" }, { status: 500 });
    }
}
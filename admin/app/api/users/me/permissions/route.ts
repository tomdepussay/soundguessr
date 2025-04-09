import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma"
import { verifySession } from "@/src/lib/session";
import { redirect } from "next/navigation";

export async function GET(
    req: Request
) {

    const session = await verifySession();
    if (!session) {
        return NextResponse.redirect("/login");
    }

    const { id } = session;
    let permissions: string[] = [];

    try {

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                roleId: true, 
            }
        })
    
        if(!user) return redirect("/login")

        const permissionsRole = await prisma.role.findUnique({
            where: { id: user.roleId },
            select: {
                permissions: {
                    select: {
                        name: true
                    }
                }
            }
        })

        if(!permissionsRole) return redirect("/login")
        
        permissionsRole.permissions.forEach((permission: { name: string; }) => {
            permissions.push(permission.name)
        })

        return NextResponse.json(permissions, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ error: "Erreur de la récupération" }, { status: 500 });
    }
}
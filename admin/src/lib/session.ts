import 'server-only'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

const key = new TextEncoder().encode(process.env.JWT_SECRET)

const cookie = {
    name: "auth-token",
    options: { httpOnly: true, secure: true, sameSite: 'lax' as const, path: "/" },
    duration: 24 * 60 * 60 * 1000
}

export async function encrypt(payload: JWTPayload | undefined){
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1day')
        .sign(key)
}

export async function decrypt(session: any){
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256']
        })
        return payload
    } catch(error){
        return null
    }
}

export async function createSession(id: number){
    const expires = new Date(Date.now() + cookie.duration)
    const session = await encrypt({ id, expires })

    const cookieStore = await cookies();
    cookieStore.set(cookie.name, session, {...cookie.options, expires})

    redirect("/")
}

export async function verifySession(){
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(cookie.name)?.value
    const session = await decrypt(cookieValue)

    if(!session || typeof session.id !== "number") return null

    return { id: session.id }
}

export async function deleteSession(){
    const cookieStore = await cookies();
    cookieStore.set(cookie.name, "", {...cookie.options, expires: new Date(0)})
    redirect("/login")
}

export async function hasAccess(permission: string){
    const session = await verifySession()
    
    if(!session) return redirect("/login")

    const { id } = session;

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            roleId: true, 
        }
    })

    if(!user) return redirect("/login")

    // Vérification si le rôle possède la permission
    const roleHasPermission = await prisma.role.findFirst({
        where: {
            id: user.roleId,
            permissions: {
                some: {
                    name: permission
                }
            }
        }
    })

    if(roleHasPermission) return true;

    return false;

}

export async function hasAccessApi(permission: string){
    const access = await hasAccess(permission);

    if (!access) {
        throw NextResponse.json(
            { error: "Vous n'avez pas la permission de faire cette action" },
            { status: 401 }
        );
    }
}
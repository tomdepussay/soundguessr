import 'server-only'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
// import { redirect } from 'next/navigation'
// import prisma from "@/src/lib/prisma"
import { NextResponse } from 'next/server';

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

export async function verifySession(){
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(cookie.name)?.value
    const session = await decrypt(cookieValue)

    if(!session || typeof session.id !== "number") return null

    return { id: session.id }
}

// async function getPermissions(){
//     const session = await verifySession()
    
//     if(!session) return redirect("/login")

//     const { id } = session;

//     const permissionsResponse = await prisma.permission.findMany({
//         where: {
//             roles: {
//                 some: {
//                     users: {
//                         some: {
//                             id: id
//                         }
//                     }
//                 }
//             }
//         },
//         select: {
//             name: true
//         }
//     })

//     return permissionsResponse.map((permission) => permission.name)
// }

// export async function hasAccess(permission: string){

//     const permissions = await getPermissions();

//     if (permissions.includes(permission)) return true

//     return false;

// }

// export async function hasAccessApi(permission: string){
//     const access = await hasAccess(permission);

//     if (!access) {
//         throw NextResponse.json(
//             { error: "Vous n'avez pas la permission de faire cette action" },
//             { status: 401 }
//         );
//     }
// }
import 'server-only'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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
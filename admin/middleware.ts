import { type NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/src/lib/session'

export default async function middleware(req: NextRequest){
    const safeRoutes = ["/login", "/signup"]
    const currentPath = req.nextUrl.pathname
    const isSafe = safeRoutes.includes(currentPath)

    if(!isSafe){

        const session = await verifySession()

        console.log(session);
        
        if(!session?.userId){
            return NextResponse.redirect(new URL("/login", req.nextUrl.origin).toString())
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image).*)']
}
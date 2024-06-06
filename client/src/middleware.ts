import type { NextRequest } from "next/server";
import { getToken, removeToken } from "./lib/auth";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest){
    const currentUser = await getToken()
    
    const host = request.headers.get('x-forwarded-host')
    const port = request.headers.get('x-forwarded-port')
    const protocol = request.headers.get('x-forwarded-proto')
    const cururl = `${protocol}://${host}:${port}`
    
    if (currentUser){
        const res = await fetch(`http://api:${process.env.API_PORT!}${process.env.API_PATHNAME!}/users`, {
            headers: {
                Authorization: `Bearer ${currentUser}`,
            },
        })
    
        if (!res.ok) {
            cookies().getAll().forEach(cookie => {
                cookies().delete(cookie.name)
            })
            return Response.redirect(`${cururl}/auth/signout`)
        }
    }
    
    if (!currentUser && !request.nextUrl.pathname.startsWith('/auth')) {
        return Response.redirect(`${cururl}/auth/signin`)
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],  
}
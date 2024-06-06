'use client'
import { removeToken } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Signout(){
    const router = useRouter()
    useEffect(() => {
        removeToken()
        router.push('/auth/signin')
    })
}
import NoteCardData from "@/components/template/note-carddata"
import { getToken } from "@/lib/auth"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata:Metadata = {
    title: 'My Notes'
}

async function getData(page: number = 0, limit: number = 10, search: string = '') {
    const res = await fetch(`http://api:${process.env.API_PORT!}${process.env.API_PATHNAME!}/notes/?page=${page}&limit=${limit}&search=${search}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getToken()}`,
        },
        method: 'GET',
    })
    if (!res.ok) {
        notFound()
    }
    return res.json()
}

export default async function Note() {
    const { data } = await getData()
    return (
        <main className="flex min-h-screen flex-col justify-between mx-4 relative mt-4">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-4">
                    <NoteCardData data={data} />
                </div>
            </div>
        </main>
    )
}
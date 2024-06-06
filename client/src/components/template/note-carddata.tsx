'use client'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { toast } from "sonner"
import { NoteData } from "@/lib/types"
import { getToken } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function NoteCardData({ data }: { data: Array<NoteData> }) {
    const router = useRouter()
    const handleDelete = async (id: string | Number) => {
        toast.info('Deleting note...')
        const res = await fetch(`${process.env.API_PATHNAME!}/notes/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getToken()}`,
            },
            method: 'DELETE',
            body: JSON.stringify({})
        })
        if (!res.ok) {
            toast.error('Failed to delete note.')
        }
        setTimeout(() => {
            toast.success('Note deleted.')
            router.refresh()
        }, 500)
    }
    return <>
        {
            data.map((item: NoteData, i) => {
                return <ContextMenu key={i}>
                    <ContextMenuTrigger>
                        <Link href={`/dashboard/notes/${item.id}`}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{item.title}</CardTitle>
                                    <CardDescription>{item.description}</CardDescription>
                                </CardHeader>
                                <CardFooter className="text-sm text-muted-foreground">
                                    {new Date(item.updatedAt).toDateString()}
                                </CardFooter>
                            </Card>
                        </Link>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem>Edit</ContextMenuItem>
                        <Separator />
                        <ContextMenuItem className="text-red-500" onClick={() => handleDelete(item.id)}>Delete</ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            })
        }
    </>
}
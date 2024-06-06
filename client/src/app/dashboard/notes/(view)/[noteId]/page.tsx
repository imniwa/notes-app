import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getToken } from "@/lib/auth"
import { NoteData } from "@/lib/types"
import { Metadata } from "next"
import { notFound } from "next/navigation"

async function getData(params: { noteId: string }) {
  const res = await fetch(`http://api:${process.env.API_PORT!}${process.env.API_PATHNAME!}/notes/${params.noteId}`, {
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

export async function generateMetadata({ params }: { params: { noteId: string } }): Promise<Metadata> {
  const { data } = await getData(params)
  return {
    title: data.title,
  }
}

export default async function ViewNote({ params }: { params: { noteId: string } }) {
  const { data }: { data: NoteData } = await getData(params)
  return (
    <div className="mx-4 pt-4 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{data.title}</CardTitle>
          <CardDescription>{data.description}</CardDescription>
        </CardHeader>
      </Card>
      <Separator />
      <div className="text-justify" dangerouslySetInnerHTML={{__html:data.details}}></div>
    </div>
  )
}
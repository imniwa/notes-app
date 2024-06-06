'use client'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { getToken } from "@/lib/auth"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    title: z.string().min(1, {
        message: 'title must not be empty.'
    }).max(64, {
        message: 'sorry your title is too long.'
    }),
    description: z.string().max(255, {
        message: 'sorry your description is too long.'
    }).optional(),
    details: z.string().optional(),
})

export default function NewNote() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            details: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const response = await fetch(`${process.env.API_PATHNAME!}/notes`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${await getToken()}`
            },
            method: 'POST',
            body: JSON.stringify(values)
        })
        setLoading(true)
        if (response.ok) {
            const { data } = await response.json()
            setLoading(false)
            toast.success('note created successfully.')
            form.reset()
            setTimeout(() => {
                router.push(`/dashboard/notes/${data[0].id}`)
            }, 500)
        } else {
            toast.error('failed to create note.')
        }
        setLoading(false)
    }

    return (
        <div className="mx-4 pt-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="set new cool title for your note." type="text" {...field} className={
                                    form.formState.errors.title ? 'border-red-500' : ''
                                } />
                            </FormControl>
                            {
                                form.formState.errors.title ? (
                                    <FormDescription className="text-red-500">
                                        {form.formState.errors.title?.message}
                                    </FormDescription>
                                ) : ''}
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="give simple description to your note."  {...field} />
                            </FormControl>
                        </FormItem>
                    )} />
                    <Separator />
                    <FormField control={form.control} name="details" render={({ field }) => (
                        <FormItem>
                            <FormLabel>create your own note</FormLabel>
                            <FormControl>
                                <Textarea placeholder="write here..." rows={15}  {...field} />
                            </FormControl>
                        </FormItem>
                    )} />
                    <Button disabled={loading}>{
                        loading ? (
                            <>
                                <svg className="animate-spin fill-white" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" /></svg>
                                <span className="ml-2">Loading...</span>
                            </>
                        ) : (
                            <>
                                Save
                            </>
                        )
                    }</Button>
                </form>
            </Form>
        </div>
    )
}
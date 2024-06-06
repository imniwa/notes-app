'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { setToken } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
    username: z.string().max(255),
    password: z.string().max(255),
});


export default function Signin() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const response = await fetch(`${process.env.API_PATHNAME!}/auth`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(values),
        })
        setLoading(true)
        if (response.ok) {
            const { data } = await response.json()
            setError(null)
            setToken(data.token)
            setTimeout(() => {
                router.push('/dashboard')
            }, 500)
        } else {
            setLoading(false)
            setError('Invalid username or password')
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome</CardTitle>
                    <CardDescription>enter your credentials to login</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <FormField control={form.control} name="username" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field} className={
                                            form.formState.errors.username ? 'border-red-500' : ''
                                        } />
                                    </FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="password" type="password" {...field} className={
                                            form.formState.errors.password ? 'border-red-500' : ''
                                        } />
                                    </FormControl>
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={loading}>
                                {
                                    loading ? (
                                        <>
                                            <svg className="animate-spin fill-white" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" /></svg>
                                            <span className="ml-2">Loading...</span>
                                        </>
                                    ) : (
                                        <>
                                            Signin
                                        </>
                                    )
                                }
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <p className="text-sm">Don&apos;t have an account? <Link href="/auth/signup" className="text-blue-500">register</Link></p>
                </CardFooter>
            </Card>
            {
                error &&
                <Alert variant="destructive" className="absolute bottom-8 right-8 w-1/5">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            }
        </>
    )
}
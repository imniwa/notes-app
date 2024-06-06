'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';


import { z } from 'zod';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

const formSchema = z.object({
    fullname: z.string().min(8, {
        message: 'fullname must be at least 8 characters long',
    }).max(255),
    username: z.string().min(4, {
        message: 'username must be at least 4 characters long',
    }).max(255),
    password: z.string().min(8, {
        message: 'password must be at least 8 characters long',
    }).max(255),
});


export default function Signup() {
    const [created, setCreated] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: '',
            username: '',
            password: '',
        }
    })
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const response = await fetch(`${process.env.API_PATHNAME!}/users`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(values),
        })
        if (response.ok) {
            await response.json()
            setCreated(true)
            setError(null)
            form.reset()
        } else {
            setCreated(false)
            setError('Failed to create account')
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>create your own todo</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField control={form.control} name="fullname" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fullname</FormLabel>
                                <FormControl>
                                    <Input placeholder="fullname" {...field} className={
                                        form.formState.errors.fullname ? 'border-red-500' : ''
                                    } />
                                </FormControl>
                                {
                                    form.formState.errors.fullname && (
                                    <FormDescription className="text-red-500">
                                        {form.formState.errors.fullname.message}
                                    </FormDescription>
                                )}
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="username" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" {...field} className={
                                        form.formState.errors.username ? 'border-red-500' : ''
                                    } />
                                </FormControl>
                                {
                                    form.formState.errors.username && (
                                    <FormDescription className="text-red-500">
                                        {form.formState.errors.username.message}
                                    </FormDescription>
                                )}
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="password" type="password" {...field} className={
                                        form.formState.errors.password ? 'border-red-500' : ''
                                    }/>
                                </FormControl>
                                {
                                    form.formState.errors.password && (
                                    <FormDescription className="text-red-500">
                                        {form.formState.errors.password.message}
                                    </FormDescription>
                                )}
                            </FormItem>
                        )} />
                        {
                            error && (
                                <FormDescription className="text-red-500">
                                    {error}
                                </FormDescription>
                            )
                        }
                        {
                            created && (
                                <FormDescription className="text-green-500">
                                    Account created successfully
                                </FormDescription>
                            )
                        }
                        <Button type="submit">Register</Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <p className="text-sm">Already have an account? <Link href="/auth/signin" className="text-blue-500">login</Link></p>
            </CardFooter>
        </Card>
    )
}
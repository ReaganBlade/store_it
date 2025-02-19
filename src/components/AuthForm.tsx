"use client";
import React, { useState } from 'react';
import { unknown, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import Link from 'next/link';
import { createAccount } from '@/lib/actions/user.actions';

type FormType = 'sign-in' | 'sign-up';

const formSchema = z.object({
    username: z.string().min(2).max(30),
})

const authFormSchema = (formType: FormType) => {
    return z.object({
        email: z.string().email(),
        fullname: formType === 'sign-up' ? z.string().min(3).max(50): z.null(),
    })
}

const AuthForm = ({ type }: { type: FormType }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [accountId, setAccountId] = useState(unknown);
    
    const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: "", email: "",
        },
    })


    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // console.log(values)
        setIsLoading(true);
        setErrorMessage("");

        try {
            const user = await createAccount({
                fullname: values.fullname || "",
                email: values.email
            });

            console.log(user);
    
            setAccountId(user.accountId);

        } catch (error) {
            console.log(error);
            setErrorMessage('Failed to create an account. Please try again later')
        } finally {
            setIsLoading(false);
        }
        
    }
    return (
        <>        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
                <h1 className='form-title'>
                    { type === "sign-in" ? "Sign In": "Sign Up"}
                </h1>

                {   type === 'sign-up' &&
                    <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                        <FormItem>
                            <div className="shad-form-item">
                                <FormLabel className='shad-form-label'>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} className='shad-input' />
                                </FormControl>
                            </div>
                            <FormMessage className='shad-form-message' />
                        </FormItem>
                    )}
                />
                }
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <div className="shad-form-item">
                                <FormLabel className='shad-form-label'>Email    </FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} className='shad-input' />
                                </FormControl>
                            </div>
                            <FormMessage className='shad-form-message' />
                        </FormItem>
                    )}
                />
                <Button type="submit" className='form-submit-button' disabled={isLoading}>
                    
                    {type=== "sign-in" ? "Sign In": "Sign Up"}

                    {isLoading &&
                    <Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className="ml-2 animate-spin"/>
                    }
                </Button>
                {errorMessage && (
                    <p className='error-message'>*{errorMessage}</p>
                )}

                <div className='body-2 justify-center flex'>
                    <p className='text-light-100'>
                        {
                            type === 'sign-in' 
                            ? "Don't have an account?"
                            : "Already have an account?"
                        }
                    </p>
                    <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className='ml-1 font-medium text-brand'> {type === 'sign-in' ? 'Sign Up' : 'Sign In'} </Link>
                </div>

            </form>
        </Form>
        {/* OTP VERIFICATION */}
        </>
    )
}

export default AuthForm

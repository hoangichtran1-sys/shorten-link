"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { HatGlassesIcon, LockIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { loginSchema } from "@/modules/auth/schemas";
import { useLogin } from "@/modules/auth/api/use-login";
import { useLoginWithGuest } from "../api/login-with-guest";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const { mutate, isPending } = useLogin();

    const loginWithGuest = useLoginWithGuest();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: LoginFormValues) => {
        mutate(values);
    };

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription>Login to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-6">
                            <Button
                                className="w-full"
                                variant="outline"
                                type="button"
                                onClick={() => loginWithGuest.mutate()}
                                disabled={loginWithGuest.isPending}
                            >
                                <HatGlassesIcon />
                                Continue with Guest
                            </Button>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>
                            <div className="grid gap-6">
                                <FieldGroup>
                                    <Controller
                                        name="email"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        {...field}
                                                        type="email"
                                                        placeholder="e.g. john_smith@example.com"
                                                        aria-invalid={fieldState.invalid}
                                                        autoComplete="off"
                                                    />
                                                    <InputGroupAddon>
                                                        <MailIcon />
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="password"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor={field.name}>
                                                    Password
                                                </FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        {...field}
                                                        type="password"
                                                        placeholder="*********"
                                                        autoComplete="off"
                                                    />
                                                    <InputGroupAddon>
                                                        <LockIcon />
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                                <Button disabled={isPending} type="submit" className="w-full">
                                    Login
                                </Button>
                            </div>
                        </div>
                        <div className="text-center text-sm mt-1">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="underline underline-offset-4">
                                Register
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

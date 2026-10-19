"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { generateSlug } from "random-word-slugs";
import { z } from "zod";
import { LockIcon, MailIcon, RefreshCcwIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { registerSchema } from "@/modules/auth/schemas";
import { useRegister } from "@/modules/auth/api/use-register";

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const { mutate, isPending } = useRegister();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: RegisterFormValues) => {
        mutate(values);
    };

    const handleRandomName = () => {
        const randomName = generateSlug(3, { format: "title" });
        form.setValue("name", randomName, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Get started!</CardTitle>
                    <CardDescription>Create your account to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-6">
                            <FieldGroup>
                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    type="text"
                                                    placeholder="e.g. John Smith"
                                                    aria-invalid={fieldState.invalid}
                                                    autoComplete="off"
                                                />
                                                <InputGroupAddon>
                                                    <UserIcon />
                                                </InputGroupAddon>
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupButton
                                                        title="Generate name"
                                                        aria-label="Generate name"
                                                        onClick={handleRandomName}
                                                        size="icon-xs"
                                                    >
                                                        <RefreshCcwIcon className="text-muted-foreground" />
                                                    </InputGroupButton>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
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
                                            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
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
                                Register
                            </Button>
                        </div>
                        <div className="text-center text-sm mt-1">
                            Already have an account?{" "}
                            <Link href="/login" className="underline underline-offset-4">
                                Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Mail, MailIcon, MapPin, Phone } from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group";
import { contactFormSchema } from "../schemas";
import { useSendContact } from "../api/use-send-contact";

type ContactFormValues = z.infer<typeof contactFormSchema>;

export const ContactSection = ({ className }: { className?: string }) => {
    const { mutate, isPending } = useSendContact();
    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    const onSubmit = (values: ContactFormValues) => {
        mutate(values, { onSuccess: () => form.reset() });
    };

    const message = useWatch({
        control: form.control,
        name: "message",
    });

    return (
        <section className={cn("py-16", className)}>
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl">
                        Get in Touch
                    </h2>
                    <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                        Have a question or want to work together? We&apos;d love to hear from you.
                        Send us a message and we&apos;ll respond as soon as possible.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
                    {/* Contact Form */}
                    <Card className="h-full py-6">
                        <CardHeader className="px-6">
                            <CardTitle className="text-balance">Send us a Message</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-6 px-6">
                            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                                <FieldGroup>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <Controller
                                            name="firstName"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor={field.name}>
                                                        First Name
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder="John"
                                                        aria-invalid={fieldState.invalid}
                                                        autoComplete="off"
                                                    />

                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="lastName"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor={field.name}>
                                                        Last Name
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder="Doe"
                                                        aria-invalid={fieldState.invalid}
                                                        autoComplete="off"
                                                    />

                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </div>
                                </FieldGroup>
                                <FieldGroup>
                                    <Controller
                                        name="email"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    aria-invalid={fieldState.invalid}
                                                    autoComplete="off"
                                                />

                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                                <FieldGroup>
                                    <Controller
                                        name="subject"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor={field.name}>
                                                    Subject
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="How can we help?"
                                                    aria-invalid={fieldState.invalid}
                                                    autoComplete="off"
                                                />

                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                                <FieldGroup>
                                    <Controller
                                        name="message"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor={field.name}>
                                                    Message
                                                </FieldLabel>
                                                <InputGroup>
                                                    <InputGroupTextarea
                                                        {...field}
                                                        className="min-h-30"
                                                        id={field.name}
                                                        placeholder="Tell us more about your product..."
                                                        aria-invalid={fieldState.invalid}
                                                    />
                                                    <InputGroupAddon align="block-end">
                                                        <InputGroupText>
                                                            {message ? message.trim().length : 0}
                                                            /1000
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>

                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="h-9 px-4 py-2 w-full cursor-pointer"
                                >
                                    <MailIcon className="size-4 text-white" />
                                    Send Message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Contact Information & Additional Info */}
                    <div className="flex h-full flex-col gap-6">
                        {/* Contact Information */}
                        <Card className="flex-1 gap-3 py-6">
                            <CardHeader className="px-6">
                                <CardTitle className="text-lg text-balance">
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4 px-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
                                        <Mail className="text-primary size-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">Email</h4>
                                        <p className="text-muted-foreground text-xs">
                                            support@gmail.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
                                        <Phone className="text-primary size-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">Phone</h4>
                                        <p className="text-muted-foreground text-xs">
                                            +1 (555) 123-4567
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-primary/10 mt-0.5 flex size-8 items-center justify-center rounded-full">
                                        <MapPin className="text-primary size-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">Office</h4>
                                        <p className="text-muted-foreground text-xs">
                                            123 Business Ave, Suite 100
                                            <br />
                                            San Francisco, CA 94105
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Business Hours */}
                        <Card className="gap-3 py-6">
                            <CardHeader className="px-6">
                                <CardTitle className="text-lg text-balance">
                                    Business Hours
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-6">
                                <div className="flex flex-col gap-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Monday - Friday</span>
                                        <span className="text-muted-foreground">
                                            9:00 AM - 6:00 PM
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday</span>
                                        <span className="text-muted-foreground">
                                            10:00 AM - 4:00 PM
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span className="text-muted-foreground">Closed</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Alternative Contact */}
                        <Card className="gap-3 py-6">
                            <CardHeader className="px-6">
                                <CardTitle className="text-lg text-balance">
                                    Prefer to Call?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-6">
                                <p className="text-muted-foreground mb-3 text-sm">
                                    Speak directly with our team for immediate assistance.
                                </p>
                                <Button
                                    onClick={() => toast.info("You call to your system...")}
                                    variant="outline"
                                    className="h-9 px-4 py-2 w-full cursor-pointer"
                                >
                                    <Phone />
                                    Schedule a Call
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

"use client";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { ArrowRight, MailIcon } from "lucide-react";
import { useSubscriber } from "../api/use-subscriber";

export const linkColumns = [
    { title: "Home", links: ["About Us", "Collection", "Blog & News"] },
    { title: "Security", links: ["Privacy Policy", "User Agreements", "Copyright"] },
    { title: "Social Media", links: ["Instagram", "Facebook", "Twitter"] },
] as const;

const subscribeFormSchema = z.object({
    email: z.email(),
});

type SubscribeFormValues = z.infer<typeof subscribeFormSchema>;

export const FooterSection = () => {
    const { mutate, isPending } = useSubscriber();
    const form = useForm<SubscribeFormValues>({
        resolver: zodResolver(subscribeFormSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (values: SubscribeFormValues) => {
        mutate(values, { onSuccess: () => form.reset() });
    };

    return (
        <footer className="bg-secondary w-full py-16" aria-label="Site footer">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Left Section */}
                    <div className="me-8 md:col-span-5">
                        <div className="mb-6 flex items-center gap-2">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M26 24.75C26.4142 24.75 26.75 24.4142 26.75 24C26.75 23.5858 26.4142 23.25 26 23.25V24.75ZM26 23.25H11V24.75H26V23.25ZM8.75 21V15H7.25V21H8.75ZM11 23.25C9.75736 23.25 8.75 22.2426 8.75 21H7.25C7.25 23.0711 8.92893 24.75 11 24.75V23.25Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M1.5 3.25C1.08579 3.25 0.75 3.58579 0.75 4C0.75 4.41421 1.08579 4.75 1.5 4.75V3.25ZM1.5 4.75H6V3.25H1.5V4.75ZM7.25 6V21H8.75V6H7.25ZM6 4.75C6.69036 4.75 7.25 5.30964 7.25 6H8.75C8.75 4.48122 7.51878 3.25 6 3.25V4.75Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M22 21.75C22.4142 21.75 22.75 21.4142 22.75 21C22.75 20.5858 22.4142 20.25 22 20.25V21.75ZM22 20.25H11V21.75H22V20.25ZM8.75 18V12H7.25V18H8.75ZM11 20.25C9.75736 20.25 8.75 19.2426 8.75 18H7.25C7.25 20.0711 8.92893 21.75 11 21.75V20.25Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M27.2057 19.754C27.0654 20.1438 26.6357 20.346 26.246 20.2057C25.8562 20.0654 25.654 19.6357 25.7943 19.246L27.2057 19.754ZM30.0361 9.67744L29.3305 9.4234L29.3305 9.4234L30.0361 9.67744ZM25.7943 19.246L29.3305 9.4234L30.7418 9.93148L27.2057 19.754L25.7943 19.246ZM28.1543 7.75L8 7.75V6.25L28.1543 6.25V7.75ZM29.3305 9.4234C29.6237 8.60882 29.0201 7.75 28.1543 7.75V6.25C30.059 6.25 31.3869 8.13941 30.7418 9.93148L29.3305 9.4234Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M13.5 21.75C13.0858 21.75 12.75 21.4142 12.75 21C12.75 20.5858 13.0858 20.25 13.5 20.25V21.75ZM26.7111 19.009L27.4174 19.2613L27.4174 19.2613L26.7111 19.009ZM13.5 20.25H23.8858V21.75H13.5V20.25ZM26.0048 18.7568L27.7937 13.7477L29.2063 14.2523L27.4174 19.2613L26.0048 18.7568ZM23.8858 20.25C24.8367 20.25 25.6849 19.6522 26.0048 18.7568L27.4174 19.2613C26.8843 20.7537 25.4706 21.75 23.8858 21.75V20.25Z"
                                    fill="currentColor"
                                />
                                <path d="M21.1694 10.5806L14.5651 17.1849" stroke="currentColor" />
                                <path d="M22.1694 14.5806L18.5632 18.1868" stroke="currentColor" />
                                <circle cx="13.1" cy="26.1" r="1.7" stroke="currentColor" />
                                <circle cx="22.1" cy="26.1" r="1.7" stroke="currentColor" />
                            </svg>
                            <span className="text-xl font-semibold">ShadcnStore</span>
                        </div>
                        <p className="text-muted-foreground mb-8 max-w-sm text-sm leading-relaxed text-balance">
                            A collection of beautifully designed components built with ShadCN UI and
                            Tailwind CSS.
                        </p>
                        <form className="relative" onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <Controller
                                    name="email"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <InputGroup className="border-muted-foreground/20 bg-background/80 h-12 pe-32">
                                                <InputGroupInput
                                                    {...field}
                                                    type="email"
                                                    placeholder="Enter your email"
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
                            </FieldGroup>
                            <Button
                                type="submit"
                                variant="default"
                                className="absolute inset-e-1 top-1 h-10 cursor-pointer px-4"
                                aria-label="Subscribe to newsletter"
                                disabled={isPending}
                            >
                                Subscribe
                                <ArrowRight />
                            </Button>
                        </form>
                    </div>

                    {/* Right Section */}
                    <div className="md:col-span-7">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                            {linkColumns.map((column) => (
                                <div key={column.title}>
                                    <h3 className="mb-4 text-lg font-medium">{column.title}</h3>
                                    <ul className="flex flex-col gap-3">
                                        {column.links.map((link) => (
                                            <li key={link}>
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                    }}
                                                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                                                >
                                                    {link}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

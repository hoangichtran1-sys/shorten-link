"use client";

import { z } from "zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldError, FieldLabel } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
    InputGroupButton,
} from "@/components/ui/input-group";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { CheckIcon, CopyIcon, MinusIcon, PlusIcon } from "lucide-react";
import { createFormSchema } from "../schemas";
import { useCreatShortenLink } from "../api/use-create-shorten-link";

type CreateFormValues = z.infer<typeof createFormSchema>;

export const CreateShortenLinkForm = () => {
    const { isCopied, copyToClipboard } = useCopyToClipboard();

    const { mutate, isPending } = useCreatShortenLink();

    const form = useForm<CreateFormValues>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            longUrl: "",
            codeLength: 6,
        },
    });

    const onSubmit = (values: CreateFormValues) => {
        mutate(values, {
            onSuccess: () => {
                form.reset();
            },
        });
    };

    const longUrl = useWatch({
        control: form.control,
        name: "longUrl",
    });

    return (
        <Card className="w-full h-full shadow-none border-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">Create a new shorten link</CardTitle>
            </CardHeader>
            <CardContent className="p-7">
                <form className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-8">
                        <FieldGroup>
                            <Controller
                                control={form.control}
                                name="longUrl"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Long URL</FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                placeholder="https://example.com"
                                                type="url"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="off"
                                            />
                                            <InputGroupAddon align="inline-end">
                                                <InputGroupButton
                                                    aria-label="Copy"
                                                    title="Copy"
                                                    size="icon-xs"
                                                    onClick={() => {
                                                        copyToClipboard(longUrl);
                                                    }}
                                                >
                                                    {isCopied ? <CheckIcon /> : <CopyIcon />}
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
                                control={form.control}
                                name="codeLength"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Code Length</FieldLabel>
                                        <ButtonGroup>
                                            <Input
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(e.target.valueAsNumber)
                                                }
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="off"
                                                type="number"
                                                className="h-auto max-h-8 [appearance:textfield]"
                                                min={6}
                                                max={20}
                                                step={1}
                                            />
                                            <Button
                                                onClick={() => {
                                                    const currentValue = field.value;
                                                    const nextValue = currentValue - 1;
                                                    form.setValue(
                                                        "codeLength",
                                                        Math.max(1, nextValue),
                                                    );
                                                }}
                                                disabled={field.value === 6}
                                                variant="outline"
                                                type="button"
                                                size="icon-sm"
                                            >
                                                <MinusIcon />
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    const currentValue = field.value;
                                                    const nextValue = currentValue + 1;
                                                    form.setValue("codeLength", nextValue);
                                                }}
                                                variant="outline"
                                                type="button"
                                                size="icon-sm"
                                                disabled={field.value === 20}
                                            >
                                                <PlusIcon />
                                            </Button>
                                        </ButtonGroup>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </div>
                    <Button disabled={isPending} type="submit" className="ml-auto w-full md:w-auto">
                        Create shorten link
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

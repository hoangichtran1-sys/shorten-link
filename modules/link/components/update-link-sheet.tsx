"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import { generateSlug } from "random-word-slugs";
import { CheckIcon, CopyIcon, LoaderIcon, RefreshCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
    InputGroupButton,
} from "@/components/ui/input-group";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { GetLinks } from "../api/use-get-links";
import { updateFormSchema } from "../schemas";
import { useUpdateShortenLink } from "../api/use-update-shorten-link";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

interface UpdateLinkSheetProps extends React.ComponentProps<typeof Sheet> {
    initialData: GetLinks[number];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type UpdateFormValues = z.infer<typeof updateFormSchema>;

export function UpdateLinkSheet({ initialData, open, onOpenChange }: UpdateLinkSheetProps) {
    return (
        <Sheet onOpenChange={onOpenChange} open={open}>
            <SheetContent className="flex flex-col gap-6 sm:max-w-md">
                <SheetHeader className="text-left">
                    <SheetTitle>Update link</SheetTitle>
                    <SheetDescription>
                        Update the link details and save the changes
                    </SheetDescription>
                </SheetHeader>
                <UpdateLinkForm data={initialData} onClose={() => onOpenChange(false)} />
            </SheetContent>
        </Sheet>
    );
}

interface UpdateTaskFormProps {
    data: GetLinks[number];
    onClose?: () => void;
}

const UpdateLinkForm = ({ data, onClose }: UpdateTaskFormProps) => {
    const { isCopied, copyToClipboard } = useCopyToClipboard();

    const { mutate, isPending } = useUpdateShortenLink();

    const form = useForm<UpdateFormValues>({
        resolver: zodResolver(updateFormSchema),
        defaultValues: {
            name: data.name,
            longUrl: data.longUrl,
        },
    });

    console.log(form.formState.dirtyFields);

    const onSubmit = (values: UpdateFormValues) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {};

        Object.keys(form.formState.dirtyFields).forEach((field) => {
            const key = field as keyof typeof values;
            updateData[key] = values[key];
        });

        mutate(
            {
                id: data.id,
                body: updateData,
            },
            {
                onSuccess: (data) => {
                    onClose?.();
                    form.reset({
                        longUrl: data.longUrl,
                        name: data.name,
                    });
                },
            },
        );
    };

    const longUrl = useWatch({
        control: form.control,
        name: "longUrl",
    });

    const handleRandomName = () => {
        const randomName = generateSlug(3, { format: "lower" });
        form.setValue("name", randomName, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4 px-4">
            <FieldGroup>
                <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    type="text"
                                    value={field.value || ""}
                                    placeholder="e.g. Untitled"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                />
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
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    control={form.control}
                    name="longUrl"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Long URL</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    type="url"
                                    placeholder="e.g. https://example.com"
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                />
                                {longUrl && (
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            aria-label="Copy"
                                            title="Copy"
                                            size="icon-xs"
                                            onClick={() => copyToClipboard(longUrl)}
                                        >
                                            {isCopied ? <CheckIcon /> : <CopyIcon />}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                )}
                            </InputGroup>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Field data-disabled>
                    <FieldLabel htmlFor="code">Code</FieldLabel>
                    <Input
                        id="code"
                        type="text"
                        placeholder="Short code"
                        disabled
                        value={data.shortCode}
                    />
                    <FieldDescription className="text-xs">
                        {process.env.NEXT_PUBLIC_APP_URL}/api/shorten/{data.shortCode}
                    </FieldDescription>
                </Field>
            </FieldGroup>

            <SheetFooter className="px-0">
                <Button disabled={isPending || !form.formState.isDirty}>
                    {isPending && <LoaderIcon className="animate-spin" />}
                    Save
                </Button>
                <SheetClose asChild>
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                </SheetClose>
            </SheetFooter>
        </form>
    );
};

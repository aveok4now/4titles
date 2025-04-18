import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/common/form'
import { Input } from '@/components/ui/common/input'
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

interface UsernameFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
    form: UseFormReturn<TFieldValues>
    name: TName
    label: string
    placeholder?: string
    description?: string
    disabled?: boolean
    shouldShowErrors?: boolean
    autoComplete?: string
}

export function UsernameField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    form,
    name,
    label,
    placeholder = 'nostylist44',
    description,
    disabled,
    shouldShowErrors,
    autoComplete = 'username',
}: UsernameFieldProps<TFieldValues, TName>) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className='space-y-1.5'>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            disabled={disabled}
                            autoComplete={autoComplete}
                            {...field}
                        />
                    </FormControl>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    {shouldShowErrors && (
                        <div className='h-3.5 md:h-1'>
                            <FormMessage className='text-xs' />
                        </div>
                    )}
                </FormItem>
            )}
        />
    )
}

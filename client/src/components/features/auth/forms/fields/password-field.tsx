import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/common/form'
import { PasswordInput } from '@/components/ui/custom/content/password-input'
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

interface PasswordFieldProps<
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
    action?: React.ReactNode
}

export function PasswordField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    form,
    name,
    label,
    placeholder = '********',
    description,
    disabled,
    shouldShowErrors,
    autoComplete = 'current-password',
    action,
}: PasswordFieldProps<TFieldValues, TName>) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className='space-y-1.5'>
                    {action ? (
                        <div className='flex items-center justify-center'>
                            <FormLabel>{label}</FormLabel>
                            {action && (
                                <div className='ml-auto inline-block'>
                                    {action}
                                </div>
                            )}
                        </div>
                    ) : (
                        <FormLabel>{label}</FormLabel>
                    )}

                    <FormControl>
                        <PasswordInput
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

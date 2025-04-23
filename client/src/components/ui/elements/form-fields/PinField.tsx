import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/common/form'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/common/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

interface PinFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
    form: UseFormReturn<TFieldValues>
    name: TName
    label: string
    description?: string
    onPinChange?: (pin: string, isValid: boolean) => void
    pinLength?: number
    otpRef?: React.RefObject<HTMLDivElement | null>
    className?: string
}

export function PinField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    form,
    name,
    label,
    description,
    onPinChange,
    pinLength = 6,
    otpRef,
    className,
}: PinFieldProps<TFieldValues, TName>) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div ref={otpRef}>
                            <InputOTP
                                maxLength={pinLength}
                                pattern={REGEXP_ONLY_DIGITS}
                                {...field}
                                onChange={value => {
                                    field.onChange(value)
                                    const isValid = value.length === pinLength
                                    onPinChange?.(value, isValid)
                                }}
                            >
                                <InputOTPGroup>
                                    {Array.from({ length: pinLength }).map(
                                        (_, index) => (
                                            <InputOTPSlot
                                                key={index}
                                                index={index}
                                                className='w-12 md:w-14'
                                            />
                                        ),
                                    )}
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    </FormControl>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                </FormItem>
            )}
        />
    )
}

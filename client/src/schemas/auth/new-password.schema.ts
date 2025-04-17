import { MIN_PASSWORD_LENGTH, VALIDATION_REGEX } from '@/constants/auth'
import { z } from 'zod'

export interface NewPasswordSchemaMessages {
    passwordMinLengthValidationError: string
    passwordWeaknessError: string
    passwordRepeatError: string
}

export const newPasswordSchema = (messages: NewPasswordSchemaMessages) =>
    z
        .object({
            password: z
                .string()
                .min(MIN_PASSWORD_LENGTH, {
                    message: messages.passwordMinLengthValidationError,
                })
                .regex(VALIDATION_REGEX.STRONG_PASSWORD, {
                    message: messages.passwordWeaknessError,
                }),

            passwordRepeat: z.string().min(MIN_PASSWORD_LENGTH, {
                message: messages.passwordMinLengthValidationError,
            }),
        })
        .refine(data => data.password === data.passwordRepeat, {
            path: ['passwordRepeat'],
            message: messages.passwordRepeatError,
        })

export type NewPasswordSchemaType = z.infer<
    ReturnType<typeof newPasswordSchema>
>

import {
    MIN_PASSWORD_LENGTH,
    MIN_USERNAME_LENGTH,
    VALIDATION_REGEX,
} from '@/libs/constants/auth.constants'
import { z } from 'zod'

export interface CreateAccountSchemaMessages {
    usernameMinLengthValidationError: string
    usernameInvalidCharactersValidationError: string
    emailValidationError: string
    passwordMinLengthValidationError: string
    passwordWeaknessError: string
}

export const createAccountSchema = (messages: CreateAccountSchemaMessages) =>
    z.object({
        username: z
            .string()
            .min(MIN_USERNAME_LENGTH, {
                message: messages.usernameMinLengthValidationError,
            })
            .regex(VALIDATION_REGEX.USERNAME, {
                message: messages.usernameInvalidCharactersValidationError,
            }),
        email: z
            .string()
            .email({
                message: messages.emailValidationError,
            })
            .trim()
            .toLowerCase(),
        password: z
            .string()
            .min(MIN_PASSWORD_LENGTH, {
                message: messages.passwordMinLengthValidationError,
            })
            .regex(VALIDATION_REGEX.STRONG_PASSWORD, {
                message: messages.passwordWeaknessError,
            }),
    })

export type CreateAccountSchemaType = z.infer<
    ReturnType<typeof createAccountSchema>
>

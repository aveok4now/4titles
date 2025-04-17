import { z } from 'zod'

export interface ResetPasswordSchemaMessages {
    emailValidationError: string
}

export const resetPasswordSchema = (messages: ResetPasswordSchemaMessages) =>
    z.object({
        email: z
            .string()
            .email({ message: messages.emailValidationError })
            .trim()
            .toLowerCase(),
    })

export type ResetPasswordSchemaType = z.infer<
    ReturnType<typeof resetPasswordSchema>
>

import { z } from 'zod'

export const resetPasswordSchema = (t: {
    emailValidationErrorMessage: string
}) =>
    z.object({
        email: z
            .string()
            .email({ message: t.emailValidationErrorMessage })
            .transform(val => val.trim()),
    })

export type ResetPasswordSchemaType = z.infer<
    ReturnType<typeof resetPasswordSchema>
>

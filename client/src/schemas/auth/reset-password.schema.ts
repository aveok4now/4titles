import { z } from 'zod'

export const resetPasswordSchema = (t: {
    emailValidationErrorMessage: string
}) =>
    z.object({
        email: z.string().email({ message: t.emailValidationErrorMessage }),
    })

export type ResetPasswordSchemaType = z.infer<
    ReturnType<typeof resetPasswordSchema>
>

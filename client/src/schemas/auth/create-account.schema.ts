import { z } from 'zod'

export const createAccountSchema = (t: {
    usernameMinLengthValidationError: string
    usernameInvalidCharactersValidationError: string
    emailValidationError: string
    passwordMinLengthValidationError: string
    passwordWeaknessError: string
}) =>
    z.object({
        username: z
            .string()
            .min(5, {
                message: t.usernameMinLengthValidationError,
            })
            .regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, {
                message: t.usernameInvalidCharactersValidationError,
            }),
        email: z.string().email({
            message: t.emailValidationError,
        }),
        password: z
            .string()
            .min(8, { message: t.passwordMinLengthValidationError })
            .regex(/^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d).+$/u, {
                message: t.passwordWeaknessError,
            }),
    })

export type CreateAccountSchemaType = z.infer<
    ReturnType<typeof createAccountSchema>
>

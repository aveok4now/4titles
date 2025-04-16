import { z } from 'zod'

export const newPasswordSchema = (t: {
    passwordMinLengthValidationError: string
    passwordWeaknessError: string
    passwordRepeatError: string
}) =>
    z
        .object({
            password: z
                .string()
                .min(8, { message: t.passwordMinLengthValidationError })
                .regex(/^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d).+$/u, {
                    message: t.passwordWeaknessError,
                }),

            passwordRepeat: z
                .string()
                .min(8, { message: t.passwordMinLengthValidationError }),
        })
        .refine(data => data.password === data.passwordRepeat, {
            path: ['passwordRepeat'],
            message: t.passwordRepeatError,
        })

export type NewPasswordSchemaType = z.infer<
    ReturnType<typeof newPasswordSchema>
>

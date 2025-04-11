import { z } from 'zod'

export const createAccountSchema = z.object({
    username: z.string().min(3, {
        message: 'Имя пользователя должно содержать не менее 3 символов',
    }),
    email: z.string().email({
        message: 'Пожалуйста, введите корректный email',
    }),
    password: z.string().min(8, {
        message: 'Пароль должен содержать не менее 8 символов',
    }),
})

export type CreateAccountSchemaType = z.infer<typeof createAccountSchema>

import { z } from 'zod'

export const loginAccountSchema = z.object({
    login: z.string().min(5),
    password: z.string().min(8),
    pin: z.string().optional(),
})

export type LoginAccountSchemaType = z.infer<typeof loginAccountSchema>

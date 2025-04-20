import {
    MIN_PASSWORD_LENGTH,
    MIN_USERNAME_LENGTH,
} from '@/libs/constants/auth.constants'
import { z } from 'zod'

export const loginAccountSchema = z.object({
    login: z.string().min(MIN_USERNAME_LENGTH).trim(),
    password: z.string().min(MIN_PASSWORD_LENGTH),
    pin: z.string().optional(),
})

export type LoginAccountSchemaType = z.infer<typeof loginAccountSchema>

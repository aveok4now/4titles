import { MIN_PASSWORD_LENGTH } from '@/libs/constants/auth.constants'
import { z } from 'zod'

export const deactivateAccountSchema = z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(MIN_PASSWORD_LENGTH),
    pin: z.string().optional(),
})

export type DeactivateAccountSchemaType = z.infer<
    typeof deactivateAccountSchema
>

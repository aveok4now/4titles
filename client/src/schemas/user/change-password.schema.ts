import { VALIDATION_REGEX } from '@/libs/constants/auth.constants'
import { z } from 'zod'

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8).regex(VALIDATION_REGEX.STRONG_PASSWORD),
})

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>

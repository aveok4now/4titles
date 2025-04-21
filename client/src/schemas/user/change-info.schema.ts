import { VALIDATION_REGEX } from '@/libs/constants/auth.constants'
import { z } from 'zod'

export const changeInfoSchema = z.object({
    username: z.string().min(1).regex(VALIDATION_REGEX.USERNAME),
    displayName: z.string().min(1),
    bio: z.string().max(200),
})

export type ChangeInfoSchemaType = z.infer<typeof changeInfoSchema>

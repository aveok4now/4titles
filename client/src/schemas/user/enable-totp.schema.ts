import { TOTP_PIN_LENGTH } from '@/libs/constants/auth.constants'
import { z } from 'zod'

export const enableTotpSchema = z.object({
    pin: z.string().length(TOTP_PIN_LENGTH),
})

export type EnableTotpSchemaType = z.infer<typeof enableTotpSchema>

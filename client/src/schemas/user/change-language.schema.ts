import { z } from 'zod'

import { LANGUAGES } from '@/libs/i18n/config'

export const changeLanguageSchema = z.object({
    language: z.enum(LANGUAGES),
})

export type ChangeLanguageSchemaType = z.infer<typeof changeLanguageSchema>

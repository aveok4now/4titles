import { z } from 'zod'

export const ThemeType = z.enum(['light', 'dark', 'system'])
export type ThemeType = z.infer<typeof ThemeType>

export const changeThemeSchema = z.object({
    theme: ThemeType,
})

export type ChangeThemeSchemaType = z.infer<typeof changeThemeSchema>

import { z } from 'zod'

export const changeNotificationSettingsSchema = z.object({
    isSiteNotificationsEnabled: z.boolean(),
    isTelegramNotificationsEnabled: z.boolean(),
})

export type ChangeNotificationSettingsSchemaType = z.infer<
    typeof changeNotificationSettingsSchema
>

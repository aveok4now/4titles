import { z } from 'zod'

export interface ReportLocationSchemaMessages {
    message: {
        minLengthError: string
        maxLengthError: string
    }
}

export const reportLocationSchema = (messages: ReportLocationSchemaMessages) =>
    z.object({
        message: z
            .string()
            .min(10, {
                message: messages.message.minLengthError,
            })
            .max(1000, {
                message: messages.message.maxLengthError,
            }),
    })

export type ReportLocationSchemaType = z.infer<
    ReturnType<typeof reportLocationSchema>
>

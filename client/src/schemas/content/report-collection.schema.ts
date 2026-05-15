import { z } from 'zod'

interface ValidationMessages {
    message: {
        required: string
        minLengthError: string
        maxLengthError: string
    }
}

export type ReportCollectionSchemaType = z.infer<
    ReturnType<typeof reportCollectionSchema>
>

export const reportCollectionSchema = (messages: ValidationMessages) =>
    z.object({
        message: z
            .string()
            .min(10, { message: messages.message.minLengthError })
            .max(500, { message: messages.message.maxLengthError })
            .trim()
            .nonempty({ message: messages.message.required }),
    })

import * as z from 'zod'

interface ReportCommentSchemaParams {
    message: {
        required?: string
        minLengthError: string
        maxLengthError: string
    }
}

export const reportCommentSchema = (params: ReportCommentSchemaParams) => {
    return z.object({
        message: z
            .string()
            .min(10, params.message.minLengthError)
            .max(500, params.message.maxLengthError),
    })
}

export type ReportCommentSchemaType = z.infer<
    ReturnType<typeof reportCommentSchema>
>

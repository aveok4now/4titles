import { z } from 'zod'

export interface EditLocationSchemaMesages {
    address: {
        minLengthError: string
        maxLengthError: string
    }
    description: {
        minLengthError: string
        maxLengthError: string
    }
    reason: {
        minLengthError: string
        maxLengthError: string
    }
    atLeastOneThingShouldBeChanged: {
        error: string
    }
}

export const editLocationSchema = (messages: EditLocationSchemaMesages) =>
    z
        .object({
            address: z
                .string()
                .min(3, { message: messages.address.minLengthError })
                .max(200, { message: messages.address.maxLengthError }),
            description: z
                .string()
                .min(10, {
                    message: messages.description.minLengthError,
                })
                .max(1000, {
                    message: messages.description.maxLengthError,
                }),
            reason: z
                .string()
                .min(10, {
                    message: messages.reason.minLengthError,
                })
                .max(500, {
                    message: messages.reason.maxLengthError,
                }),
            originalAddress: z.string(),
            originalDescription: z.string(),
        })
        .refine(
            data =>
                data.address !== data.originalAddress ||
                data.description !== data.originalDescription,
            {
                message: messages.atLeastOneThingShouldBeChanged.error,
                path: ['_errors'],
            },
        )

export type EditLocationSchemaType = z.infer<
    ReturnType<typeof editLocationSchema>
>

import { z } from 'zod'

export interface FilmingLocationProposalSchemaMessages {
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
        requiredError: string
    }
}

export const filmingLocationProposalSchema = (
    messages: FilmingLocationProposalSchemaMessages,
) =>
    z.object({
        address: z
            .string()
            .min(5, { message: messages.address.minLengthError })
            .max(255, { message: messages.address.maxLengthError }),
        coordinates: z
            .object({
                x: z.number(),
                y: z.number(),
            })
            .optional(),
        description: z
            .string()
            .min(10, { message: messages.description.minLengthError })
            .max(1000, { message: messages.description.maxLengthError }),
        reason: z
            .string()
            .min(10, { message: messages.reason.minLengthError })
            .max(500, { message: messages.reason.maxLengthError })
            .optional(),
    })

export type FilmingLocationProposalSchemaType = z.infer<
    ReturnType<typeof filmingLocationProposalSchema>
>

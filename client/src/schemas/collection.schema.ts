import { CollectionType } from '@/graphql/generated/output'
import { z } from 'zod'
import { uploadFileSchema } from './upload-file.schema'

export interface CollectionSchemaMessages {
    title: {
        minLengthError: string
        maxLengthError: string
    }
    description: {
        maxLengthError: string
    }
}

export const collectionSchema = (messages: CollectionSchemaMessages) =>
    z.object({
        id: z.string().optional(),
        title: z
            .string()
            .min(5, { message: messages.title.minLengthError })
            .max(255, { message: messages.title.maxLengthError }),
        description: z
            .string()
            .max(500, { message: messages.description.maxLengthError })
            .optional()
            .or(z.literal('')),
        isPrivate: z.boolean().default(false),
        type: z.nativeEnum(CollectionType),
        coverImage: uploadFileSchema.shape.file,
        titleItems: z.array(z.string()).optional(),
        locationItems: z.array(z.string()).optional(),
    })

export type CollectionFormValues = z.infer<ReturnType<typeof collectionSchema>>

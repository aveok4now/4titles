import { CollectionSortType, CollectionType } from '@/graphql/generated/output'
import { z } from 'zod'

export const baseFilterSchema = z.object({
    mine: z.boolean().default(false),
    take: z.number().default(12),
    skip: z.number().default(0),
    sort: z
        .nativeEnum(CollectionSortType)
        .default(CollectionSortType.RecentlyAdded),
})

export const optionalFilterSchema = z.object({
    type: z.nativeEnum(CollectionType).optional(),
    search: z.string().optional(),
})

export const collectionFilterSchema =
    baseFilterSchema.merge(optionalFilterSchema)

export type CollectionFilterSchemaType = z.infer<typeof collectionFilterSchema>

export const defaultFilterValues: CollectionFilterSchemaType = {
    mine: false,
    take: 12,
    skip: 0,
    sort: CollectionSortType.RecentlyAdded,
}

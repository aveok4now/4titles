import {
    TitleCategory,
    TitleSortOption,
    TitleStatus,
    TitleType,
} from '@/graphql/generated/output'
import { z } from 'zod'

export const dateRangeSchema = z.object({
    from: z.string().optional(),
    to: z.string().optional(),
})

export const numberRangeSchema = z.object({
    from: z.number().optional(),
    to: z.number().optional(),
})

const baseFilterSchema = z.object({
    withFilmingLocations: z.boolean().default(false),
    take: z.number().default(12),
    skip: z.number().default(0),
    sortBy: z
        .nativeEnum(TitleSortOption)
        .default(TitleSortOption.PopularityDesc),
})

const optionalFilterSchema = z.object({
    type: z.nativeEnum(TitleType).optional(),
    category: z.nativeEnum(TitleCategory).optional(),
    searchTerm: z.string().optional(),
    name: z.string().optional(),
    releaseDateRange: dateRangeSchema.optional(),
    genreIds: z.array(z.string()).optional(),
    countryIsos: z.array(z.string()).optional(),
    runtimeRange: numberRangeSchema.optional(),
    originalLanguageIsos: z.array(z.string()).optional(),
    voteAverageRange: numberRangeSchema.optional(),
    statuses: z.array(z.nativeEnum(TitleStatus)).optional(),
    imdbId: z.string().optional(),
})

export const titleFilterSchema = baseFilterSchema.merge(optionalFilterSchema)

export type TitleFilterSchemaType = z.infer<typeof titleFilterSchema>

export const defaultFilterValues: TitleFilterSchemaType = {
    take: 24,
    skip: 0,
    withFilmingLocations: false,
    sortBy: TitleSortOption.PopularityDesc,
}

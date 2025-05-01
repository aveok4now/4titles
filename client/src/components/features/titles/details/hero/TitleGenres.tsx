import { Badge } from '@/components/ui/common/badge'
import { TitleGenre } from '@/graphql/generated/output'

interface TitleGenresProps {
    genres: TitleGenre[]
    locale: string
}

export function TitleGenres({ genres, locale }: TitleGenresProps) {
    return (
        <div className='flex flex-wrap gap-2'>
            {genres.map(genreObj => (
                <Badge
                    key={genreObj.genre?.id}
                    variant='outline'
                    className='text-xs text-foreground'
                >
                    {locale === 'en'
                        ? genreObj.genre?.englishName
                        : genreObj.genre?.name}
                </Badge>
            ))}
        </div>
    )
}

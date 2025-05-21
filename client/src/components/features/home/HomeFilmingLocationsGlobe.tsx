import { Globe } from '@/components/ui/custom/content/globe'
import { FilmingLocation } from '@/graphql/generated/output'
import type { Marker } from 'cobe'

interface HomeFilmingLocationsGlobeProps {
    locations: FilmingLocation[]
}

export function HomeFilmingLocationsGlobe({
    locations,
}: HomeFilmingLocationsGlobeProps) {
    const markers: Marker[] = locations.map(location => ({
        location: [location.coordinates?.x!, location.coordinates?.y!] as [
            number,
            number,
        ],
        size: 0.03,
    }))

    return (
        <div className='flex size-full max-w-full items-center justify-center overflow-hidden rounded-lg px-40 pt-4'>
            <Globe />
            <div className='pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]' />
            <div className='pointer-events-none absolute inset-0 h-full sm:bg-gradient-to-tr sm:from-background/35 sm:via-background/20 sm:to-transparent dark:sm:from-background/45 dark:sm:via-background/30 md:from-background/25 md:via-background/15 lg:from-background/15 lg:via-transparent' />
        </div>
    )
}

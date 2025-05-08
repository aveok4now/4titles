import Image from 'next/image'

interface TitleBackdropProps {
    backdropUrl: string
    name: string
}

export function TitleBackdrop({ backdropUrl, name }: TitleBackdropProps) {
    return (
        <div className='absolute inset-0 z-0'>
            <Image
                src={backdropUrl}
                alt={name}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw'
                className='pointer-events-none select-none object-cover object-top'
                priority
            />
            <div className='absolute inset-0 bg-gradient-to-b from-background/80 via-background/80 to-card/80' />
            <div className='absolute inset-0 bg-gradient-radial from-transparent to-background/60' />
        </div>
    )
}

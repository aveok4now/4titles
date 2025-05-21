'use client'

interface HomeCollectionCardProps {
    title: string
    color: string
    description: string
    emoji: string
}

export function HomeCollectionCard({
    title,
    color,
    description,
    emoji,
}: HomeCollectionCardProps) {
    return (
        <div
            className='mx-2 my-2 flex h-36 w-56 flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md'
            style={{
                background: `linear-gradient(135deg, ${color}20, ${color}40)`,
                borderColor: `${color}66`,
            }}
        >
            <div className='flex flex-col p-3'>
                <div className='flex items-center gap-2'>
                    <div
                        className='flex h-10 w-10 items-center justify-center rounded-xl shadow-sm'
                        style={{
                            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                        }}
                    >
                        <span className='text-lg'>{emoji}</span>
                    </div>
                    <h4 className='text-sm font-medium'>{title}</h4>
                </div>
                <p className='mt-2 line-clamp-3 text-xs text-muted-foreground'>
                    {description}
                </p>
            </div>
        </div>
    )
}

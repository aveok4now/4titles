import { cn } from '@/utils/tw-merge'
import { cva, VariantProps } from 'class-variance-authority'
import { Avatar, AvatarFallback, AvatarImage } from '../common/avatar'

const avatarSizes = cva('', {
    variants: {
        size: {
            sm: 'size-7',
            default: 'size-10',
            lg: 'size-14',
            xl: 'size-32',
        },
    },
    defaultVariants: {
        size: 'default',
    },
})

interface TitleAvatarProps extends VariantProps<typeof avatarSizes> {
    posterPath: string | null
    name: string
    className?: string
}

export function TitleAvatar({
    size,
    posterPath,
    name,
    className,
}: TitleAvatarProps) {
    return (
        <div className={cn('relative', className)}>
            <Avatar className={avatarSizes({ size })}>
                <AvatarImage
                    className='object-cover'
                    src={
                        posterPath
                            ? `https://image.tmdb.org/t/p/w92${posterPath}`
                            : ''
                    }
                />
                <AvatarFallback>{name[0]?.toUpperCase() || 'T'}</AvatarFallback>
            </Avatar>
        </div>
    )
}

import { cn } from '@/utils/tw-merge'
import { cva, VariantProps } from 'class-variance-authority'
import { Avatar, AvatarFallback, AvatarImage } from '../common/avatar'
import { BorderBeam } from '../custom/content/border-beam'

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
    imagePath: string
    name: string
    className?: string
}

export function TitleAvatar({
    size,
    imagePath,
    name,
    className,
}: TitleAvatarProps) {
    return (
        <div className={cn('relative', className)}>
            <Avatar className={avatarSizes({ size })}>
                <AvatarImage className='object-center' src={imagePath} />
                <AvatarFallback>{name[0]?.toUpperCase() || 'T'}</AvatarFallback>
                <BorderBeam
                    size={30}
                    className='from-transparent via-primary/40 to-transparent'
                />
            </Avatar>
        </div>
    )
}

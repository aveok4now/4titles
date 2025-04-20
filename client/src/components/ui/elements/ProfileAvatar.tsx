import type { FindProfileQuery } from '@/graphql/generated/output'
import { cn } from '@/utils/tw-merge'
import { cva, VariantProps } from 'class-variance-authority'
import { getMediaSource } from '../../../utils/get-media-source'
import { Avatar, AvatarFallback, AvatarImage } from '../common/avatar'
import { BorderBeam } from '../custom/content/border-beam'

const avatarSizes = cva('', {
    variants: {
        size: {
            sm: 'size-7',
            default: 'size-9',
            lg: 'size-14',
            xl: 'size-32',
        },
    },
    defaultVariants: {
        size: 'default',
    },
})

interface ProfileAvatarProps extends VariantProps<typeof avatarSizes> {
    profile: Pick<FindProfileQuery['me'], 'username' | 'avatar'>
}

export function ProfileAvatar({ size, profile }: ProfileAvatarProps) {
    return (
        <div className='relative'>
            <Avatar className={avatarSizes({ size })}>
                <AvatarImage
                    className='object-cover'
                    src={
                        profile.avatar
                            ? profile.avatar.startsWith('blob:')
                                ? profile.avatar
                                : getMediaSource(profile.avatar)
                            : undefined
                    }
                />
                <AvatarFallback
                    className={cn(
                        size === 'xl' && 'text-4xl',
                        size === 'lg' && 'text-2xl',
                    )}
                >
                    {profile?.username?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>

                <BorderBeam
                    size={50}
                    className='from-transparent via-primary to-transparent'
                />
            </Avatar>
        </div>
    )
}

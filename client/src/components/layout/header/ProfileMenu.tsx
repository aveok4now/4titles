'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/common/dropdown-menu'
import ShinyText from '@/components/ui/custom/text/shiny-text'
import { ProfileAvatar } from '@/components/ui/elements/ProfileAvatar'
import { Spinner } from '@/components/ui/elements/Spinner'
import { useLogoutMutation } from '@/graphql/generated/output'
import { useAuth } from '@/hooks/useAuth'
import { useCurrent } from '@/hooks/useCurrent'
import { AUTH_ROUTES } from '@/libs/constants/auth.constants'
import { LayoutDashboard, LogOut, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Notifications } from './notifications/Notifications'

export function ProfileMenu() {
    const t = useTranslations('layout.header.menu.profile')
    const router = useRouter()

    const { unauthorize } = useAuth()
    const { profile, isLoadingProfile } = useCurrent()

    const [logout] = useLogoutMutation({
        onCompleted() {
            unauthorize()
            toast.success(t('successMessage'), { position: 'bottom-right' })
            router.push(AUTH_ROUTES.LOGIN)
        },
        onError() {
            toast.error(t('errorMessage'))
        },
    })

    return isLoadingProfile || !profile ? (
        <Spinner size='lg' />
    ) : (
        <>
            <Notifications />
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <ProfileAvatar profile={profile} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-60'>
                    <div className='flex items-center gap-x-3 p-2'>
                        <ProfileAvatar profile={profile} />
                        <ShinyText
                            className='text-md truncate font-medium text-foreground/90'
                            text={profile.username}
                        />
                    </div>
                    <DropdownMenuSeparator />
                    <Link href={`/profile/${profile.username}`}>
                        <DropdownMenuItem>
                            <User className='mr-2 size-2' /> {t('me')}
                        </DropdownMenuItem>
                    </Link>
                    <Link href={`/dashboard/settings`}>
                        <DropdownMenuItem>
                            <LayoutDashboard className='mr-2 size-2' />
                            {t('dashboard')}
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => logout()}>
                        <LogOut className='mr-2 size-2' />
                        {t('logout')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

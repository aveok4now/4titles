'use client'

import { Button } from '@/components/ui/common/button'
import { useAuth } from '@/hooks/useAuth'
import { AUTH_ROUTES } from '@/libs/constants/auth.constants'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ProfileMenu } from './ProfileMenu'

export function HeaderMenu() {
    const t = useTranslations('layout.header.menu')
    const { isAuthenticated } = useAuth()

    return (
        <div className='flex items-center gap-x-4'>
            {isAuthenticated ? (
                <ProfileMenu />
            ) : (
                <>
                    <Link href={AUTH_ROUTES.LOGIN}>
                        <Button variant='secondary'>{t('login')}</Button>
                    </Link>
                    <Link href={AUTH_ROUTES.REGISTER}>
                        <Button>{t('register')}</Button>
                    </Link>
                </>
            )}
        </div>
    )
}

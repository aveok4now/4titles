'use client'

import { Spinner } from '@/components/ui/custom/spinner'
import { useVerifyAccountMutation } from '@/graphql/generated/output'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { AuthWrapper } from '../AuthWrapper'

export function VerfiyAccountForm() {
    const t = useTranslations('auth.verify')
    const REDIRECT_ON_ERROR_TIMEOUT_IN_MS = 1500

    const router = useRouter()
    const searchParams = useSearchParams()

    const token = searchParams.get('token') ?? ''

    const [verify] = useVerifyAccountMutation({
        onCompleted() {
            toast.success(t('successMessage'))
            router.push('/dashboard/settings')
        },
        onError() {
            toast.error(t('errorMessage'), {
                description: t('errorMessageDescription'),
                duration: REDIRECT_ON_ERROR_TIMEOUT_IN_MS,
            })
            setTimeout(
                () => router.push('/account/login'),
                REDIRECT_ON_ERROR_TIMEOUT_IN_MS,
            )
        },
    })

    useEffect(() => {
        verify({
            variables: {
                data: { token },
            },
        })
    }, [token])

    return (
        <AuthWrapper heading={t('heading')}>
            <div className='flex items-center justify-center'>
                <Spinner size='xl' color='border-primary' />
            </div>
        </AuthWrapper>
    )
}

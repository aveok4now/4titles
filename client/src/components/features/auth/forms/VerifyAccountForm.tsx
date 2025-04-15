'use client'

import { useVerifyAccountMutation } from '@/graphql/generated/output'
import { LoaderPinwheel } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { AuthWrapper } from '../AuthWrapper'

export function VerfiyAccountForm() {
    const t = useTranslations('auth.verify')

    const router = useRouter()
    const searchParams = useSearchParams()

    const token = searchParams.get('token') ?? ''

    const [verify] = useVerifyAccountMutation({
        onCompleted() {
            toast.success(t('successMessage'), {
                position: 'top-center',
            })
            router.push('/homepage')
        },
        onError() {
            toast.error(t('errorMessage'), {
                position: 'top-center',
                duration: 1500,
            })
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
                {/* <LoaderPinwheel className='text-primary-background size-12 animate-spin' /> */}
                <div className='size-8 animate-spin rounded-full border-b-2 border-t-2 border-primary'></div>
            </div>
        </AuthWrapper>
    )
}

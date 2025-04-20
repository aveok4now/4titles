'use client'

import { Button } from '@/components/ui/common/button'
import { Input } from '@/components/ui/common/input'
import { Hint } from '@/components/ui/elements/Hint'
import { useTrackTitleSearchMutation } from '@/graphql/generated/output'
import { SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { FormEvent, useCallback, useEffect, useState } from 'react'

export function Search() {
    const t = useTranslations('layout.header.search')
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()
    const [trackTitleSearch] = useTrackTitleSearchMutation()

    useEffect(() => {
        const trackCurrentTitle = async () => {
            const pathname = window.location.pathname
            if (pathname.startsWith('/titles/')) {
                const titleSlug = pathname.split('/').pop()
                if (titleSlug) {
                    await trackTitleSearch({
                        variables: { slug: titleSlug },
                    })
                }
            }
        }

        trackCurrentTitle()
    }, [trackTitleSearch])

    const onSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()

            if (searchTerm.trim()) {
                router.push(`/titles?search=${searchTerm}`)
            } else {
                router.push('/titles')
            }
        },
        [searchTerm, router],
    )

    return (
        <div className='ml-auto hidden lg:block'>
            <form className='relative flex items-center' onSubmit={onSubmit}>
                <Input
                    placeholder={t('placeholder')}
                    type='text'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className='w-full rounded-md pl-4 pr-10 lg:w-[25rem]'
                />

                <Button
                    className='absolute right-0.5 h-9 w-9 rounded-md'
                    type='submit'
                >
                    <SearchIcon className='absolute size-5' />
                </Button>
            </form>
        </div>
    )
}

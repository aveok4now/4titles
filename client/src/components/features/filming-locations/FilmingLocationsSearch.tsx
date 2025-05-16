'use client'

import { Button } from '@/components/ui/common/button'
import { Input } from '@/components/ui/common/input'
import { Spinner } from '@/components/ui/elements/Spinner'
import { useDebounce } from '@/hooks/useDebounce'
import { Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useRef, useState } from 'react'

interface FilmingLocationsSearchProps {
    onSearch: (query: string) => void
    isLoading?: boolean
    minSearchLength?: number
}

export function FilmingLocationsSearch({
    onSearch,
    isLoading = false,
    minSearchLength = 3,
}: FilmingLocationsSearchProps) {
    const t = useTranslations('titleDetails.filmingLocations.search')
    const [searchValue, setSearchValue] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const debouncedSearch = useDebounce((value: string) => {
        if (value === '' || value.length >= minSearchLength) {
            onSearch(value)
        }
    }, 400)

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            setSearchValue(value)
            debouncedSearch(value)
        },
        [debouncedSearch],
    )

    const handleClearSearch = useCallback(() => {
        setSearchValue('')
        onSearch('')
        if (inputRef.current) inputRef.current.focus()
    }, [onSearch])

    return (
        <div className='relative mb-4'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <Search className='size-4 text-muted-foreground' />
            </div>
            <Input
                ref={inputRef}
                type='text'
                placeholder={t('placeholder')}
                className='pl-10 pr-10'
                value={searchValue}
                onChange={handleSearchChange}
            />
            {isLoading ? (
                <div className='absolute inset-y-0 right-0 flex items-center pr-2'>
                    <Spinner size='sm' color='text-muted-foreground' />
                </div>
            ) : searchValue ? (
                <div className='absolute inset-y-0 right-0 flex items-center pr-2'>
                    <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='size-6'
                        onClick={handleClearSearch}
                    >
                        <X className='size-4' />
                    </Button>
                </div>
            ) : null}
        </div>
    )
}

'use client'

import { Button } from '@/components/ui/common/button'
import { Calendar } from '@/components/ui/common/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/common/popover'
import { getDateFnsLocale } from '@/utils/date/date-localization'
import { cn } from '@/utils/tw-merge'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import * as React from 'react'
import { type DateRange } from 'react-day-picker'

export interface DateRangePickerProps {
    value: DateRange
    onChange: (value: DateRange) => void
    placeholder?: string
    className?: string
}

export function DateRangePicker({
    value,
    onChange,
    placeholder,
    className,
}: DateRangePickerProps) {
    const t = useTranslations('components.dateRangePicker')
    const locale = useLocale()
    const dateFnsLocale = getDateFnsLocale(locale)
    const [isOpen, setIsOpen] = React.useState(false)

    const formatDate = React.useCallback(
        (date?: Date) => {
            if (!date) return ''
            return format(date, 'dd.MM.yyyy', {
                locale: dateFnsLocale,
            })
        },
        [dateFnsLocale],
    )

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    className={cn(
                        'h-10 w-full justify-start text-left font-normal',
                        !value.from && 'text-muted-foreground',
                        className,
                    )}
                >
                    <CalendarIcon className='mr-2 size-4' />
                    {value.from ? (
                        value.to ? (
                            <>
                                {formatDate(value.from)} -{' '}
                                {formatDate(value.to)}
                            </>
                        ) : (
                            formatDate(value.from)
                        )
                    ) : (
                        <span>{placeholder || t('placeholder')}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                    autoFocus
                    mode='range'
                    defaultMonth={value.from}
                    selected={{ from: value.from, to: value.to }}
                    onSelect={selectedRange => {
                        onChange({
                            from: selectedRange?.from,
                            to: selectedRange?.to,
                        })
                    }}
                    numberOfMonths={1}
                    locale={dateFnsLocale}
                />
                <div className='flex items-center justify-between border-t p-2'>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                            onChange({ from: undefined, to: undefined })
                        }}
                        className='text-xs'
                    >
                        {t('clear')}
                    </Button>
                    <Button
                        size='sm'
                        className='text-xs'
                        onClick={() => setIsOpen(false)}
                    >
                        {t('done')}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

'use client'

import { Button } from '@/components/ui/common/button'
import { Calendar } from '@/components/ui/common/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/common/popover'
import { cn } from '@/utils/tw-merge'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'

export type DateRange = {
    from?: Date
    to?: Date
}

interface DateRangePickerProps {
    value: DateRange
    onChange: (value: DateRange) => void
    placeholder?: string
    className?: string
}

export function DateRangePicker({
    value,
    onChange,
    placeholder = 'Выберите даты',
    className,
}: DateRangePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    className={cn(
                        'h-10 w-full justify-start text-left font-normal',
                        className,
                    )}
                >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {value.from ? (
                        value.to ? (
                            <>
                                {format(value.from, 'dd.MM.yyyy', {
                                    locale: ru,
                                })}{' '}
                                -{' '}
                                {format(value.to, 'dd.MM.yyyy', { locale: ru })}
                            </>
                        ) : (
                            format(value.from, 'dd.MM.yyyy', { locale: ru })
                        )
                    ) : (
                        <span className='text-muted-foreground'>
                            {placeholder}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                    initialFocus
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
                    locale={ru}
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
                        Очистить
                    </Button>
                    <Button
                        size='sm'
                        className='text-xs'
                        onClick={() => setIsOpen(false)}
                    >
                        Готово
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

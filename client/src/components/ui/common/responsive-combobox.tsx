'use client'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/tw-merge'
import { Check, ChevronsUpDown, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Badge } from './badge'
import { Button } from './button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from './command'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from './drawer'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export type ComboboxOption = {
    value: string
    label: string
    icon?: React.ReactNode
}

type ResponsiveComboboxProps = {
    options: ComboboxOption[]
    value: string[]
    onChange: (value: string[]) => void
    onSearch?: (searchTerm: string) => void
    placeholder?: string
    emptyPlaceholder?: string
    multiple?: boolean
    searchPlaceholder?: string
    maxValues?: number
    displayBadges?: boolean
    displayValues?: boolean
    title?: string
    description?: string
    variant?: 'default' | 'outline' | 'secondary'
}

export function ResponsiveCombobox({
    options,
    value,
    onChange,
    onSearch,
    placeholder = 'Выберите значения',
    emptyPlaceholder = 'Нет доступных значений',
    multiple = true,
    searchPlaceholder = 'Поиск...',
    maxValues = 2,
    displayBadges = true,
    displayValues = true,
    title,
    description,
    variant = 'outline',
}: ResponsiveComboboxProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const isDesktop = useMediaQuery('(min-width: 768px)')

    const filteredOptions = useMemo(() => {
        if (!search) return options
        const lowerSearch = search.toLowerCase()
        return options.filter(option =>
            option.label.toLowerCase().includes(lowerSearch),
        )
    }, [options, search])

    const handleSelect = (currentValue: string) => {
        if (multiple) {
            if (value.includes(currentValue)) {
                onChange(value.filter(v => v !== currentValue))
            } else {
                onChange([...value, currentValue])
            }
        } else {
            onChange([currentValue])
            setOpen(false)
        }
    }

    const selectedLabels = useMemo(() => {
        return value
            .map(v => options.find(option => option.value === v)?.label)
            .filter((label): label is string => Boolean(label))
    }, [value, options])

    const displayLabels = useMemo(() => {
        if (!displayValues) return []
        if (selectedLabels.length <= maxValues) return selectedLabels
        return [
            ...selectedLabels.slice(0, maxValues),
            `+${selectedLabels.length - maxValues}`,
        ]
    }, [selectedLabels, maxValues, displayValues])

    const clearAll = () => {
        onChange([])
        setOpen(false)
    }

    useEffect(() => {
        if (onSearch && search.trim().length > 0) {
            const delayDebounce = setTimeout(() => {
                onSearch(search.trim())
            }, 500)

            return () => clearTimeout(delayDebounce)
        }
    }, [search, onSearch])

    useEffect(() => {
        if (!open) {
            setSearch('')
        }
    }, [open])

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={variant}
                        size='default'
                        role='combobox'
                        aria-expanded={open}
                        className='h-10 w-full justify-between'
                    >
                        <div className='flex items-center truncate'>
                            {value.length > 0 && displayValues ? (
                                displayLabels.map((label, i) => (
                                    <span key={i} className='truncate text-sm'>
                                        {i > 0 ? `, ${label}` : label}
                                    </span>
                                ))
                            ) : (
                                <span className='text-muted-foreground'>
                                    {placeholder}
                                </span>
                            )}
                        </div>

                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0' align='start'>
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            value={search}
                            onValueChange={setSearch}
                        />
                        <CommandList>
                            <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
                            <CommandGroup>
                                {filteredOptions.map(option => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() =>
                                            handleSelect(option.value)
                                        }
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value.includes(option.value)
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                        <div className='flex items-center gap-2'>
                                            {option.icon}
                                            <span>{option.label}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        {multiple && value.length > 0 && (
                            <div className='border-t p-2'>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={clearAll}
                                    className='text-xs'
                                >
                                    Очистить
                                </Button>
                            </div>
                        )}
                    </Command>
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <div className='w-full'>
            <Button
                variant={variant}
                className='w-full justify-between'
                onClick={() => setOpen(true)}
            >
                <div className='flex flex-wrap items-center gap-1 truncate'>
                    {value.length > 0 && displayBadges ? (
                        displayLabels.map((label, i) => (
                            <Badge variant='secondary' key={i}>
                                {label}
                            </Badge>
                        ))
                    ) : (
                        <span className='text-muted-foreground'>
                            {placeholder}
                        </span>
                    )}
                </div>
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>

            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{title || placeholder}</DrawerTitle>
                        {description && (
                            <DrawerDescription>{description}</DrawerDescription>
                        )}
                    </DrawerHeader>
                    <Command shouldFilter={false} className='px-4'>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            value={search}
                            onValueChange={setSearch}
                        />
                        <CommandList className='max-h-[300px]'>
                            <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
                            <CommandGroup>
                                {filteredOptions.map(option => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() =>
                                            handleSelect(option.value)
                                        }
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value.includes(option.value)
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                        <div className='flex items-center gap-2'>
                                            {option.icon}
                                            <span>{option.label}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                    <DrawerFooter>
                        <div className='flex gap-2'>
                            <Button
                                variant='outline'
                                onClick={() => setOpen(false)}
                                className='flex-1'
                            >
                                Готово
                            </Button>
                            {multiple && value.length > 0 && (
                                <Button
                                    variant='destructive'
                                    onClick={clearAll}
                                    size='icon'
                                >
                                    <X className='h-4 w-4' />
                                </Button>
                            )}
                        </div>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

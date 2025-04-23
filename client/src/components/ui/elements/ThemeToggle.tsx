'use client'

import { ThemeType } from '@/schemas/user/change-theme.schema'
import { cn } from '@/utils/tw-merge'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '../common/select'

export interface ThemeToggleProps {
    lightLabel?: string
    darkLabel?: string
    systemLabel?: string
    toggleLabel?: string
    showLabel?: boolean
    contentAlign?: LineAlignSetting
    className?: string
}

export function ThemeToggle({
    lightLabel = 'Light',
    darkLabel = 'Dark',
    systemLabel = 'System',
    toggleLabel = 'Toggle theme',
    showLabel = false,
    className = '',
    contentAlign = 'end',
}: ThemeToggleProps) {
    const { setTheme, theme } = useTheme()

    const currentTheme = theme || 'system'

    const getThemeIcon = () => {
        switch (currentTheme) {
            case 'dark':
                return <Moon className='size-5' />
            case 'light':
                return <Sun className='size-5' />
            default:
                return <Monitor className='size-5' />
        }
    }

    const getThemeLabel = () => {
        switch (currentTheme) {
            case 'dark':
                return darkLabel
            case 'light':
                return lightLabel
            default:
                return systemLabel
        }
    }

    return (
        <Select
            value={currentTheme}
            onValueChange={value => setTheme(value as ThemeType)}
        >
            <SelectTrigger
                className={cn('w-40', className)}
                aria-label={toggleLabel}
            >
                <div className='flex items-center gap-x-2'>
                    {getThemeIcon()}
                    {showLabel && (
                        <span className='mtruncate'>{getThemeLabel()}</span>
                    )}
                </div>
            </SelectTrigger>
            <SelectContent align={contentAlign} side='bottom'>
                <SelectItem value='light'>
                    <div className='flex items-center gap-2'>
                        <Sun className='size-4' />
                        <span>{lightLabel}</span>
                    </div>
                </SelectItem>
                <SelectItem value='dark'>
                    <div className='flex items-center gap-2'>
                        <Moon className='size-4' />
                        <span>{darkLabel}</span>
                    </div>
                </SelectItem>
                <SelectItem value='system'>
                    <div className='flex items-center gap-2'>
                        <Monitor className='size-4' />
                        <span>{systemLabel}</span>
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    )
}

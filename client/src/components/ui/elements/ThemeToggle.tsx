'use client'

import { Button } from '@/components/ui/common/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/common/dropdown-menu'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/tw-merge'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    className={cn('w-36', className)}
                    size={showLabel ? 'default' : 'icon'}
                >
                    {getThemeIcon()}
                    {showLabel && (
                        <span className='truncate'>{getThemeLabel()}</span>
                    )}
                    <span className='sr-only'>{toggleLabel}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={contentAlign}>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                    <Sun className='mr-2 h-4 w-4' />
                    <span>{lightLabel}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <Moon className='mr-2 h-4 w-4' />
                    <span>{darkLabel}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                    <Monitor className='mr-2 h-4 w-4' />
                    <span>{systemLabel}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

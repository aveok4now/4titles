'use client'

import { Button } from '@/components/ui/common/button'
import { Hint } from '@/components/ui/elements/Hint'
import { cn } from '@/utils/tw-merge'
import { MapPin, Route } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { memo } from 'react'

interface MapRoutingToggleButtonProps {
    isRouteEnabled: boolean
    onToggle: () => void
    className?: string
    buttonSize?: 'default' | 'sm' | 'lg' | 'icon'
    title?: string
    hintText?: string
}

function MapRoutingToggleButtonComponent({
    isRouteEnabled,
    onToggle,
    className,
    buttonSize = 'icon',
    title,
    hintText,
}: MapRoutingToggleButtonProps) {
    const t = useTranslations('components.map.routingButton')
    const buttonTitle = title || t('title')

    return (
        <Hint label={hintText || buttonTitle} side='right'>
            <Button
                variant={isRouteEnabled ? 'default' : 'outline'}
                size={buttonSize}
                className={cn(
                    className,
                    isRouteEnabled &&
                        'bg-primary text-primary-foreground hover:bg-primary/90',
                )}
                onClick={onToggle}
                title={buttonTitle}
            >
                {isRouteEnabled ? (
                    <MapPin className='size-5' />
                ) : (
                    <Route className='size-5' />
                )}
                {buttonSize !== 'icon' && (
                    <span className='ml-2'>{buttonTitle}</span>
                )}
            </Button>
        </Hint>
    )
}

export const MapRoutingToggleButton = memo(MapRoutingToggleButtonComponent)

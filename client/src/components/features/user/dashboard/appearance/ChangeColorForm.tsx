'use client'

import { CardContainer } from '@/components/ui/elements/CardContainer'
import { useConfig } from '@/hooks/useConfig'
import { BASE_COLORS } from '@/libs/constants/colors.constants'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CSSProperties } from 'react'

export function ChangeColorForm() {
    const t = useTranslations('dashboard.settings.appearance.color')
    const config = useConfig()

    return (
        <CardContainer
            heading={t('heading')}
            description={t('description')}
            rightContent={
                <div className='ml-1 grid grid-cols-6 gap-1 md:grid-cols-8 md:gap-2'>
                    {BASE_COLORS.map((theme, index) => {
                        const isActive = config.theme == theme.name
                        return (
                            <button
                                key={index}
                                onClick={() => config.setTheme(theme.name)}
                                // className='flex items-center justify-center'
                                style={
                                    {
                                        '--theme-primary': `hsl(${theme.color})`,
                                    } as CSSProperties
                                }
                            >
                                <span className='flex size-9 shrink-0 -translate-x-1 items-center justify-center rounded-md bg-[--theme-primary] hover:border-2 hover:border-foreground md:size-9 md:rounded-lg'>
                                    {isActive && (
                                        <Check className='size-4 text-white md:size-5' />
                                    )}
                                </span>
                            </button>
                        )
                    })}
                </div>
            }
        />
    )
}

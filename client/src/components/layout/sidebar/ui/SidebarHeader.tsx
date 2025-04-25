'use client'

import { Button } from '@/components/ui/common/button'
import ShinyText from '@/components/ui/custom/text/shiny-text'
import { Hint } from '@/components/ui/elements/Hint'
import { useSidebar } from '@/hooks/useSidebar'
import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function SidebarHeader() {
    const t = useTranslations('layout.sidebar.header')

    const { isCollapsed, open, close } = useSidebar()

    const label = isCollapsed ? t('expand') : t('collapse')

    return isCollapsed ? (
        <div className='mb-4 hidden w-full items-center justify-center pt-4 lg:flex'>
            <Hint label={label} side='right' asChild>
                <Button onClick={() => open()} variant='ghost' size='icon'>
                    <ArrowRightFromLine className='size-4' />
                </Button>
            </Hint>
        </div>
    ) : (
        <div className='mb-2 flex w-full items-center justify-between p-3 pl-4'>
            <ShinyText
                className='text-lg font-semibold text-foreground/90'
                text={t('navigation')}
            />
            <Hint label={label} side='right' align='end' asChild>
                <Button onClick={() => close()} variant='ghost' size='icon'>
                    <ArrowLeftFromLine className='size-4' />
                </Button>
            </Hint>
        </div>
    )
}

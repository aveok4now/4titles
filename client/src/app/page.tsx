import { Button } from '@/components/ui/common/button'
import { useTranslations } from 'next-intl'

export default function Home() {
    const t = useTranslations('home')

    return (
        <div className='flex w-1/4 flex-col gap-2 p-4'>
            <div className='text-4xl font-bold'>{t('title')}</div>
            <Button variant='outline'>Button</Button>
            <Button variant='secondary'>Button</Button>
            <Button variant='default'>Button</Button>
            <Button variant='destructive'>Button</Button>
            <Button variant='ghost'>Button</Button>
            <Button variant='link'>Button</Button>
        </div>
    )
}

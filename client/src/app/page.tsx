import { useTranslations } from 'next-intl'

export default function Home() {
    const t = useTranslations('home')

    //TODO
    return <div className='p-2 text-4xl font-bold'>{t('title')}</div>
}

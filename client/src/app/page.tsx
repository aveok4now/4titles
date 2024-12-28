import { useTranslations } from 'next-intl'

export default function Home() {
    const t = useTranslations('home')

    return <div className='text-white'>{t('title')}</div>
}

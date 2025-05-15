import { formatDistanceToNow } from 'date-fns'
import { getDateFnsLocale } from './date-localization'

export function formatTimeAgo(date: Date | string, locale: string = 'en') {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return formatDistanceToNow(dateObj, {
        addSuffix: true,
        locale: getDateFnsLocale(locale),
    })
}

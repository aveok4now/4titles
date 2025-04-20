import { Bell, Fingerprint, Info, Move3dIcon, User } from 'lucide-react'

import { NotificationType } from '@/graphql/generated/output'

export function getNotificationIcon(type: NotificationType) {
    switch (type) {
        case NotificationType.NewFollower:
            return User
        case NotificationType.EnableTwoFactor:
            return Fingerprint
        case NotificationType.Info:
            return Info
        case NotificationType.NewFavoriteTitleLocation:
            return Move3dIcon
        default:
            return Bell
    }
}

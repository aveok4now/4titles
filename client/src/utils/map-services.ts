import type { Point } from '@/graphql/generated/output'
import type { LucideIcon } from 'lucide-react'
import type { IconType } from 'react-icons'

export interface MapService {
    id: string
    icon: IconType | LucideIcon
    getUrl: () => string
    translationKey: string
}

export interface MapUrls {
    google: string
    yandex: string
    apple: string
    gis2: string
    bing: string
    vk: string
}

export const createMapUrls = (
    coordinates: Point | null | undefined,
    zoom: number = 16,
): MapUrls | null => {
    if (!coordinates?.x || !coordinates?.y) return null

    const { x: lng, y: lat } = coordinates

    return {
        google: `https://www.google.com/maps/@${lat},${lng},${zoom}z`,
        yandex: `https://yandex.ru/maps/?pt=${lng},${lat}&z=${zoom}&l=map`,
        apple: `http://maps.apple.com/?ll=${lat},${lng}`,
        gis2: `https://2gis.ru/?m=${lng},${lat}%2F${zoom}`,
        bing: `https://www.bing.com/maps?cp=${lat}~${lng}&lvl=${zoom}`,
        vk: `https://maps.vk.com/ru/?lng=${lng}&lat=${lat}&zoom=${zoom}`,
    }
}

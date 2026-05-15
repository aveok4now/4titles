'use client'

import type { Title } from '@/graphql/generated/output'
import type { ComponentType } from 'react'

import { Button } from '@/components/ui/common/button'
import { Hint } from '@/components/ui/elements/Hint'
import Link from 'next/link'
import { FaImdb, FaInstagram, FaTwitter, FaWikipediaW } from 'react-icons/fa'

interface TitleSocialLinksProps {
    externalIds?: Title['externalIds']
}

interface SocialLink {
    id: string
    icon: ComponentType
    label: string
    url: string
}

export function TitleSocialLinks({ externalIds }: TitleSocialLinksProps) {
    const socialLinks: SocialLink[] = [
        {
            id: externalIds?.imdb_id || '',
            icon: FaImdb,
            label: 'IMDb',
            url: `https://www.imdb.com/title/${externalIds?.imdb_id}`,
        },
        {
            id: externalIds?.wikidata_id || '',
            icon: FaWikipediaW,
            label: 'Wikipedia',
            url: `https://www.wikidata.org/wiki/${externalIds?.wikidata_id}`,
        },
        {
            id: externalIds?.twitter_id || '',
            icon: FaTwitter,
            label: 'Twitter',
            url: `https://twitter.com/${externalIds?.twitter_id}`,
        },
        {
            id: externalIds?.instagram_id || '',
            icon: FaInstagram,
            label: 'Instagram',
            url: `https://instagram.com/${externalIds?.instagram_id}`,
        },
    ].filter(link => link.id)

    return (
        <div className='flex flex-wrap gap-2'>
            {socialLinks.map(({ id, icon: Icon, label, url }) => (
                <Hint key={id} label={label} side='bottom'>
                    <Button variant='outline' size='icon' asChild>
                        <Link
                            href={url}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <Icon />
                        </Link>
                    </Button>
                </Hint>
            ))}
        </div>
    )
}

'use client'

import { CommentableType, type Title } from '@/graphql/generated/output'

import { CommentsSection } from '@/components/features/comments/CommentsSection'
import { DEFAULT_LANGUAGE } from '@/libs/i18n/config'
import { getLocalizedTitleName } from '@/utils/title/title-localization'
import { useTranslations } from 'next-intl'
import { TitleSectionContainer } from '../TitleSectionContainer'

interface TitleCommentsSectionProps {
    title: Title
    locale?: string
}

export function TitleCommentsSection({
    title,
    locale = DEFAULT_LANGUAGE,
}: TitleCommentsSectionProps) {
    const t = useTranslations('titleDetails.comments')

    return (
        <TitleSectionContainer
            delay={300}
            title={t('heading')}
            description={t('description', {
                type: title.type,
                title: getLocalizedTitleName(title, locale),
            })}
        >
            <CommentsSection
                commentableId={title.id}
                commentableType={CommentableType.Title}
                locale={locale}
            />
        </TitleSectionContainer>
    )
}

import type { FindTitlesQuery, TitleType } from '@/graphql/generated/output'

export interface TabState {
    titles: FindTitlesQuery['findTitles']
    hasMore: boolean
    loadedCount: number
    isInitialDataLoaded: boolean
}

export type TabType = 'all' | 'movies' | 'series'

export interface TabConfig {
    type?: TitleType
    stateKey: TabType
    fetchMore: any
}

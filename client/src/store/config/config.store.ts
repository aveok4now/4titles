import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { BaseColorType } from '@/libs/constants/colors.constants'

import type { ConfigStore } from './config.types'

export const configStore = create(
    persist<ConfigStore>(
        set => ({
            theme: 'lavender',
            setTheme: (theme: BaseColorType) => set({ theme }),
        }),
        {
            name: 'config',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)

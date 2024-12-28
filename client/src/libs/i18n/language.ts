'use server'

import { DEFAULT_LANGUAGE, type Language, LANGUAGE_COOKIE_NAME } from './config'
import { cookies } from 'next/headers'

export async function getCurrentLanguage() {
    const cookiesStore = await cookies()

    const language =
        cookiesStore.get(LANGUAGE_COOKIE_NAME)?.value ?? DEFAULT_LANGUAGE

    return language
}

export async function setCurrentLanguage(language: Language) {
    const cookiesStore = await cookies()
    return cookiesStore.set(LANGUAGE_COOKIE_NAME, language)
}

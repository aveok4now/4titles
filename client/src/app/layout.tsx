import '../styles/globals.css'
import '../styles/themes.css'

import { Background } from '@/components/ui/elements/Background'
import { ColorSwitcher } from '@/components/ui/elements/ColorSwitcher'
import { BackgroundProvider } from '@/contexts/background-context'
import { ApolloClientProvider } from '@/providers/ApolloClientProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import { createMetadata } from '@/utils/create-metadata'
import { GeistSans } from 'geist/font/sans'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { viewport } from '../utils/create-metadata'

export const metadata = createMetadata()
export { viewport }

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const locale = await getLocale()
    const messages = await getMessages()

    return (
        <html lang={locale} suppressHydrationWarning>
            <meta name='color-scheme' content='light dark'></meta>
            <body className={GeistSans.variable}>
                <BackgroundProvider>
                    <Background />
                    <ColorSwitcher />
                    <ApolloClientProvider>
                        <NextIntlClientProvider messages={messages}>
                            <ThemeProvider
                                attribute='class'
                                defaultTheme='system'
                                enableSystem
                                disableTransitionOnChange
                            >
                                <ToastProvider />
                                {children}
                            </ThemeProvider>
                        </NextIntlClientProvider>
                    </ApolloClientProvider>
                </BackgroundProvider>
            </body>
        </html>
    )
}

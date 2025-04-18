import '../styles/globals.css'

import { Background } from '@/components/features/background/Background'
import { createMetadata, viewport } from '@/config'
import { BackgroundProvider } from '@/contexts/background-context'
import { ApolloClientProvider } from '@/providers/ApolloClientProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import { GeistSans } from 'geist/font/sans'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

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

import '../styles/globals.css'
import { ApolloClientProvider } from '@/providers/ApolloClientProvider'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { createMetadata, viewport } from '@/config'

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
                <ApolloClientProvider>
                    <NextIntlClientProvider messages={messages}>
                        <ThemeProvider
                            attribute='class'
                            defaultTheme='system'
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                        </ThemeProvider>
                    </NextIntlClientProvider>
                </ApolloClientProvider>
            </body>
        </html>
    )
}

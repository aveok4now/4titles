import '../styles/globals.css'
import { ApolloClientProvider } from '@/providers/ApolloClientProvider'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { GeistSans } from 'geist/font/sans'

export const metadata: Metadata = {
    title: '4Titles',
    description: 'Movie filming locations and more.',
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const locale = await getLocale()
    const messages = await getMessages()

    return (
        <html lang={locale}>
            <body className={GeistSans.variable}>
                <ApolloClientProvider>
                    <NextIntlClientProvider messages={messages}>
                        {children}
                    </NextIntlClientProvider>
                </ApolloClientProvider>
            </body>
        </html>
    )
}

import type { Metadata } from 'next'
import type { Viewport } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
    title: 'AI Maltose',
    description: 'AI Maltose',
    appleWebApp: true,
}

export const viewport: Viewport = {
    themeColor: 'light',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    userScalable: false,
}

export const runtime = 'edge'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`body overflow-hidden`}>{children}</body>
            </html>
        </ClerkProvider>
    )
}

import type { Metadata } from 'next'
import '../styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ThemeProvider from '@/components/ThemeProvider'
import ChatBot from '@/components/ChatBot'

export const metadata: Metadata = {
  title: 'Meauxbility | Transform Your Pain into Purpose',
  description: 'Providing mobility grants and accessibility services to spinal cord injury survivors across Louisiana\'s Acadiana region.',
  keywords: ['meauxbility', 'nonprofit', 'mobility', 'accessibility', 'spinal cord injury', 'Acadiana', 'Louisiana'],
  authors: [{ name: 'Meauxbility Team' }],
  openGraph: {
    title: 'Meauxbility | Transform Your Pain into Purpose',
    description: 'Providing mobility grants and accessibility services to spinal cord injury survivors across Louisiana\'s Acadiana region.',
    url: 'https://www.meauxbility.org',
    siteName: 'Meauxbility',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="image"
          href="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/meauxbility_logo_540.webp?v=1760648661"
          type="image/webp"
        />
      </head>
      <body data-theme="light">
        <ThemeProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <ChatBot />
        </ThemeProvider>
      </body>
    </html>
  )
}

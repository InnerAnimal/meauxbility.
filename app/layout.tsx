import type { Metadata } from 'next'
import '../styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'
import { AuthProvider } from '@/contexts/AuthContext'

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
})

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
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

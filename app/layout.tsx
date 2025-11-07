import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meauxbility | Transform Your Pain into Purpose',
  description:
    'More Options. More Access. More Life. Meauxbility is a 501(c)(3) nonprofit providing mobility grants and accessibility services to spinal cord injury survivors across Louisiana.',
  keywords: [
    'meauxbility',
    'nonprofit',
    'accessibility',
    'mobility grants',
    'spinal cord injury',
    'adaptive athletes',
    'Louisiana',
  ],
  authors: [{ name: 'Meauxbility Team' }],
  openGraph: {
    title: 'Meauxbility | Transform Your Pain into Purpose',
    description:
      'More Options. More Access. More Life. Join us as we transform obstacles into pathways for adaptive athletes and spinal cord injury survivors.',
    url: 'https://meauxbility.org',
    siteName: 'Meauxbility',
    images: [
      {
        url: 'https://cdn.shopify.com/s/files/1/0685/1654/4672/files/meauxbility_logo_540.webp?v=1760648661',
        width: 540,
        height: 540,
        alt: 'Meauxbility Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meauxbility | Transform Your Pain into Purpose',
    description:
      'More Options. More Access. More Life. Join us as we transform obstacles into pathways for adaptive athletes and spinal cord injury survivors.',
    images: [
      'https://cdn.shopify.com/s/files/1/0685/1654/4672/files/meauxbility_logo_540.webp?v=1760648661',
    ],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <body className={inter.className}>
        <main style={{ flex: 1, minHeight: '70vh' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

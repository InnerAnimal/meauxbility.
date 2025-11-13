'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const darkPages = ['about', 'community', 'resources']

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Determine theme based on current path
    let theme = 'light'
    darkPages.forEach(page => {
      if (pathname.includes(page)) {
        theme = 'dark'
      }
    })

    // Set theme on both html and body
    document.documentElement.setAttribute('data-theme', theme)
    document.body.setAttribute('data-theme', theme)
  }, [pathname])

  return <>{children}</>
}

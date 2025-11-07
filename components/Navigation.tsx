'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/programs', label: 'Programs' },
    { href: '/community', label: 'Community' },
    { href: '/resources', label: 'Resources' },
    { href: '/connect', label: 'Connect' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
  }, [mobileMenuOpen])

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <header className={`nav ${scrolled ? 'scrolled' : ''}`} id="nav" role="banner">
        <div className="nav-container">
          <Link href="/" className="nav-logo" aria-label="Meauxbility Home">
            <picture>
              <source
                srcSet="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/meauxbility_logo_540.webp?v=1760648661"
                type="image/webp"
              />
              <img
                src="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/meauxbility_logo_540.png?v=1760648662"
                alt="Meauxbility"
                width="180"
                height="180"
                loading="eager"
              />
            </picture>
          </Link>

          <nav aria-label="Main navigation">
            <ul className="nav-menu">
              {navLinks.map((link) => (
                <li key={link.href} className="nav-item">
                  <Link
                    href={link.href}
                    className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="nav-item">
                <Link href="/donate" className="nav-donate">
                  Impact
                </Link>
              </li>
            </ul>
          </nav>

          <button
            className={`burger ${mobileMenuOpen ? 'open' : ''}`}
            id="burger"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <nav
        className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}
        id="mobileMenu"
        aria-label="Mobile navigation"
      >
        <ul className="mobile-nav">
          {navLinks.map((link) => (
            <li key={link.href} className="mobile-item">
              <Link
                href={link.href}
                className={`mobile-link ${isActive(link.href) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/donate"
          className="mobile-donate"
          onClick={() => setMobileMenuOpen(false)}
        >
          Impact
        </Link>
      </nav>
    </>
  )
}

'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false)
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open')
    }
  }, [pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('modal-open', !isMenuOpen)
    }
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open')
    }
  }

  // Check if link is active
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <a href="#main" className={styles.skipLink}>Skip to main content</a>

      <header className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`} id="nav" role="banner">
        <div className={styles.navContainer}>
          <Link href="/" className={styles.navLogo} aria-label="Meauxbility Home">
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
            <ul className={styles.navMenu}>
              <li className={styles.navItem}>
                <Link
                  href="/"
                  className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
                  aria-current={isActive('/') ? 'page' : undefined}
                >
                  Home
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  href="/about"
                  className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
                  aria-current={isActive('/about') ? 'page' : undefined}
                >
                  About
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  href="/programs"
                  className={`${styles.navLink} ${isActive('/programs') ? styles.active : ''}`}
                  aria-current={isActive('/programs') ? 'page' : undefined}
                >
                  Programs
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  href="/community"
                  className={`${styles.navLink} ${isActive('/community') ? styles.active : ''}`}
                  aria-current={isActive('/community') ? 'page' : undefined}
                >
                  Community
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  href="/resources"
                  className={`${styles.navLink} ${isActive('/resources') ? styles.active : ''}`}
                  aria-current={isActive('/resources') ? 'page' : undefined}
                >
                  Resources
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  href="/connect"
                  className={`${styles.navLink} ${isActive('/connect') ? styles.active : ''}`}
                  aria-current={isActive('/connect') ? 'page' : undefined}
                >
                  Connect
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/impact" className={styles.navDonate}>
                  Impact
                </Link>
              </li>
            </ul>
          </nav>

          <button
            className={`${styles.burger} ${isMenuOpen ? styles.open : ''}`}
            id="burger"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <nav
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}
        id="mobileMenu"
        aria-label="Mobile navigation"
      >
        <ul className={styles.mobileNav}>
          <li className={styles.mobileItem}>
            <Link
              href="/"
              className={`${styles.mobileLink} ${isActive('/') ? styles.active : ''}`}
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>
          <li className={styles.mobileItem}>
            <Link
              href="/about"
              className={`${styles.mobileLink} ${isActive('/about') ? styles.active : ''}`}
              onClick={closeMenu}
            >
              About
            </Link>
          </li>
          <li className={styles.mobileItem}>
            <Link
              href="/programs"
              className={`${styles.mobileLink} ${isActive('/programs') ? styles.active : ''}`}
              onClick={closeMenu}
            >
              Programs
            </Link>
          </li>
          <li className={styles.mobileItem}>
            <Link
              href="/community"
              className={`${styles.mobileLink} ${isActive('/community') ? styles.active : ''}`}
              onClick={closeMenu}
            >
              Community
            </Link>
          </li>
          <li className={styles.mobileItem}>
            <Link
              href="/resources"
              className={`${styles.mobileLink} ${isActive('/resources') ? styles.active : ''}`}
              onClick={closeMenu}
            >
              Resources
            </Link>
          </li>
          <li className={styles.mobileItem}>
            <Link
              href="/connect"
              className={`${styles.mobileLink} ${isActive('/connect') ? styles.active : ''}`}
              onClick={closeMenu}
            >
              Connect
            </Link>
          </li>
        </ul>
        <Link href="/impact" className={styles.mobileDonate} onClick={closeMenu}>
          Impact
        </Link>
      </nav>
    </>
  )
}

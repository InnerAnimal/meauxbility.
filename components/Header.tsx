'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from './Header.module.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className={styles.navGlass}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          MEAUXBILITY
        </Link>
        <ul className={`${styles.navMenu} ${isMenuOpen ? styles.navMenuOpen : ''}`}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/programs">Programs</Link></li>
          <li><Link href="/community">Community</Link></li>
          <li><Link href="/resources">Resources</Link></li>
          <li><Link href="/connect">Connect</Link></li>
          <li><Link href="/impact" className={styles.impactBtn}>Impact</Link></li>
        </ul>
        <button
          className={styles.mobileToggle}
          aria-label="Toggle menu"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}

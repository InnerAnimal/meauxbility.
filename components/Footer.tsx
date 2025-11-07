'use client'

import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footerGlass}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>Meauxbility</h4>
            <p>
              501(c)(3) Nonprofit
              <br />
              EIN: 33-4214907
            </p>
            <p className={styles.tagline}>
              Transform Your Pain into Purpose
            </p>
          </div>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/programs">Programs</Link></li>
              <li><Link href="/community">Community</Link></li>
              <li><Link href="/resources">Resources</Link></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Get Involved</h4>
            <ul>
              <li><Link href="/impact">Donate</Link></li>
              <li><Link href="/connect">Contact Us</Link></li>
              <li><Link href="/programs">Apply for Grant</Link></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Contact</h4>
            <p>
              Lafayette, Louisiana
              <br />
              Acadiana Region
            </p>
            <p className={styles.email}>
              <a href="mailto:info@meauxbility.org">info@meauxbility.org</a>
            </p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {currentYear} Meauxbility. All rights reserved.</p>
          <p className={styles.footerLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            {' • '}
            <Link href="/terms">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

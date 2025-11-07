'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './Footer.module.css'
import ModelViewer from './ModelViewer'
import DonationModal from './DonationModal'

export default function Footer() {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false)
  const currentYear = new Date().getFullYear()

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = new FormData(form).get('email') as string

    // TODO: Integrate with Resend API once DNS is verified
    alert(`Thank you for subscribing with ${email}!`)
    form.reset()
  }

  return (
    <>
      <footer className={styles.footer} id="mbx-footer" role="contentinfo">
        <ModelViewer />

        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            {/* Brand Column */}
            <div className={styles.footerBrand}>
              <Link href="/" className={styles.footerLogo} aria-label="Meauxbility Home">
                <picture>
                  <source
                    srcSet="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/meauxbility_logo_540.webp?v=1760648661"
                    type="image/webp"
                  />
                  <img
                    src="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/meauxbility_logo_540.png?v=1760648662"
                    alt="Meauxbility - Empowering mobility and independence"
                    width="220"
                    height="220"
                    loading="lazy"
                  />
                </picture>
              </Link>

              <div className={styles.footerSocial} role="list">
                <a
                  className={styles.socialLink}
                  aria-label="Facebook"
                  href="https://www.facebook.com/p/Meauxbility-61577795721851/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  className={styles.socialLink}
                  aria-label="Instagram"
                  href="https://www.instagram.com/meauxbility/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 15.838a3.838 3.838 0 110-7.676 3.838 3.838 0 010 7.676zM18.406 5.594a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                  </svg>
                </a>
              </div>

              <p>
                More Options. More Access. More Life. Join us as we transform obstacles into pathways for
                adaptive athletes and spinal cord injury survivors.
              </p>

              <div className={styles.footerCta}>
                <Link href="https://meauxbility.org/pages/donmichael-our-first-campaign" className={styles.btnPrimary}>
                  DonMichael's Campaign
                </Link>
                <button className={styles.btnOutline} onClick={() => setIsDonateModalOpen(true)}>
                  Donate Now
                </button>
              </div>

              <div className={styles.newsletter}>
                <h4>Stay Connected</h4>
                <p className={styles.newsletterDesc}>Get updates on our impact and ways to help</p>
                <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
                  <input
                    type="email"
                    name="email"
                    className={styles.newsletterInput}
                    placeholder="Enter your email"
                    required
                    aria-label="Email address"
                  />
                  <button type="submit" className={styles.newsletterBtn}>
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Resources Column */}
            <div className={styles.footerColumn}>
              <h4>Resources</h4>
              <ul className={styles.footerLinks} role="list">
                <li>
                  <Link href="https://meauxbility.org/pages/meauxbility-branding">Brand Guide</Link>
                </li>
                <li>
                  <Link href="https://meauxbility.org/pages/community">Community</Link>
                </li>
                <li>
                  <Link href="https://meauxbility.org/pages/news-media-features">Latest News</Link>
                </li>
                <li>
                  <Link href="https://meauxbility.org/pages/non-profit-information">501(c)(3) Info</Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className={styles.footerColumn}>
              <h4>Company</h4>
              <ul className={styles.footerLinks} role="list">
                <li>
                  <Link href="https://meauxbility.org/pages/sam-primeaux">About Sam</Link>
                </li>
                <li>
                  <Link href="https://meauxbility.org/pages/team-meauxbility">Our Team</Link>
                </li>
                <li>
                  <Link href="https://meauxbility.org/pages/about-us">Our Mission</Link>
                </li>
                <li>
                  <Link href="https://meauxbility.org/pages/accessibility-partners">Partners</Link>
                </li>
                <li>
                  <Link href="https://meauxbility.org/pages/contact">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div className={styles.footerColumn}>
              <h4>Support</h4>
              <ul className={styles.footerLinks} role="list">
                <li>
                  <Link href="https://meauxbility.org/pages/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="https://meauxbility.org/pages/donate">Ways to Give</Link>
                </li>
                <li>
                  <Link href="https://meauxbility.org/pages/get-involved">Get Involved</Link>
                </li>
                <li>
                  <Link href="https://meauxbility.org/pages/apply-for-funding">Apply for Grant</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className={styles.footerBottom}>
            <div className={styles.footerLegal}>
              <Link href="https://meauxbility.org/pages/data-sharing-opt-out">Privacy Policy</Link>
              <span aria-hidden="true" className={styles.separator}>
                •
              </span>
              <Link href="https://meauxbility.org/pages/policies">Terms of Service</Link>
              <span aria-hidden="true" className={styles.separator}>
                •
              </span>
              <Link href="https://meauxbility.org/pages/accessibility">Accessibility</Link>
            </div>

            <div className={styles.footerCopyright}>
              © {currentYear} Meauxbility. 501(c)(3) EIN: 33-4214907. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <DonationModal isOpen={isDonateModalOpen} onClose={() => setIsDonateModalOpen(false)} />
    </>
  )
}

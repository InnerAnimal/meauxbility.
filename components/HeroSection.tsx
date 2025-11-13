'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './HeroSection.module.css'

export default function HeroSection() {
  const [imageScale, setImageScale] = useState(1.1)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = 600
      const progress = Math.min(scrollY / maxScroll, 1)
      const newScale = 1.1 - (progress * 0.1) // Goes from 1.1 to 1.0
      setImageScale(newScale)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.heroImage} style={{ transform: `scale(${imageScale})` }}>
        <img
          src="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/sam-hero-image.jpg?v=1760648661"
          alt="Sam - Meauxbility Founder"
          loading="eager"
        />
      </div>
      <div className={styles.heroOverlay}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Empowering Mobility.
              <br />
              Restoring Independence.
            </h1>
            <p className={styles.heroSubtitle}>
              Supporting spinal cord injury survivors across Acadiana with grants for adaptive equipment and accessibility services.
            </p>
            <div className={styles.heroCta}>
              <Link href="/programs" className="btn btn-primary">
                Apply for Grant
              </Link>
              <Link href="/impact" className="btn btn-secondary">
                Support Our Mission
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

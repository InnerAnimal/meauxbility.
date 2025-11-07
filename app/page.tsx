import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.heroGlass}>
        <div className="container">
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
      </section>

      {/* TRUTEC Stack Section */}
      <section className={styles.stackSection}>
        <div className={styles.stackWrap}>
          <header className={styles.stackHead}>
            <h2 className={styles.stackH1}>Our Meauxbility TRUTEC Stack</h2>
            <p className={styles.stackH2}>Our Application, simplified.</p>
          </header>

          <div className={styles.stackGrid}>
            <div className={styles.stackLeft}>
              <div className={styles.stackCard}>
                <svg className={styles.stackIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a4 4 0 0 1-4 4H8l-5 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
                  <path d="M8 9h8M8 13h6"/>
                </svg>
                <span>Messages</span>
              </div>

              <div className={styles.stackCard}>
                <svg className={styles.stackIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
                </svg>
                <span>API</span>
              </div>

              <div className={styles.stackCard}>
                <svg className={styles.stackIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21a8 8 0 1 0-16 0"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Customers</span>
              </div>

              <div className={styles.stackCard}>
                <svg className={styles.stackIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="3"/>
                  <path d="M2 10h20"/>
                </svg>
                <span>Brands</span>
              </div>

              <div className={styles.stackCard}>
                <svg className={styles.stackIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
                <span>Assets</span>
              </div>
            </div>

            <div className={styles.stackRight}>
              <div className={styles.stackApp}>
                <div className={styles.stackLogo}>
                  MEA<span className={styles.logoX}>UX</span>BILITY
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsGlass}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>50+</h3>
              <p>Grants Awarded</p>
            </div>
            <div className={styles.statCard}>
              <h3>$250K+</h3>
              <p>Funds Distributed</p>
            </div>
            <div className={styles.statCard}>
              <h3>100%</h3>
              <p>Acadiana Coverage</p>
            </div>
            <div className={styles.statCard}>
              <h3>24/7</h3>
              <p>Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.missionSection}>
        <div className="container">
          <h2>Our Mission</h2>
          <p className={styles.missionText}>
            Meauxbility is dedicated to empowering spinal cord injury survivors across Louisiana's Acadiana region.
            We provide grants for adaptive equipment, home modifications, and accessibility services that restore
            independence and improve quality of life.
          </p>
          <div className={styles.missionCta}>
            <Link href="/about" className="btn btn-outline">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

import Link from 'next/link'
import styles from './page.module.css'

export const metadata = {
  title: 'Programs | Meauxbility',
  description: 'Apply for mobility grants and learn about our programs for spinal cord injury survivors.',
}

export default function Programs() {
  return (
    <>
      <section className={styles.programsHero}>
        <div className="container">
          <h1 className={styles.title}>Our Programs</h1>
          <p className={styles.subtitle}>
            Comprehensive support for spinal cord injury survivors across Acadiana.
          </p>
        </div>
      </section>

      <section className={styles.programsSection}>
        <div className="container">
          <div className={styles.programsGrid}>
            <div className={styles.programCard}>
              <div className={styles.programIcon}>🦽</div>
              <h3>Adaptive Equipment Grants</h3>
              <p>
                Financial assistance for wheelchairs, mobility devices, and adaptive equipment
                to restore independence and improve quality of life.
              </p>
              <ul className={styles.programList}>
                <li>Power wheelchairs</li>
                <li>Manual wheelchairs</li>
                <li>Adaptive driving equipment</li>
                <li>Transfer equipment</li>
              </ul>
            </div>

            <div className={styles.programCard}>
              <div className={styles.programIcon}>🏠</div>
              <h3>Home Modification Grants</h3>
              <p>
                Support for essential home modifications to create accessible living spaces
                that promote safety and independence.
              </p>
              <ul className={styles.programList}>
                <li>Ramps and accessible entrances</li>
                <li>Bathroom modifications</li>
                <li>Doorway widening</li>
                <li>Kitchen adaptations</li>
              </ul>
            </div>

            <div className={styles.programCard}>
              <div className={styles.programIcon}>🤝</div>
              <h3>Support Services</h3>
              <p>
                Ongoing support and resources to help survivors navigate life after injury
                and connect with their community.
              </p>
              <ul className={styles.programList}>
                <li>Peer mentorship</li>
                <li>Resource navigation</li>
                <li>Community events</li>
                <li>Educational workshops</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.eligibilitySection}>
        <div className="container">
          <h2>Eligibility Requirements</h2>
          <div className={styles.eligibilityGrid}>
            <div className={styles.eligibilityCard}>
              <h4>✓ Louisiana Resident</h4>
              <p>Must reside in Louisiana's Acadiana region</p>
            </div>
            <div className={styles.eligibilityCard}>
              <h4>✓ Spinal Cord Injury</h4>
              <p>Documented spinal cord injury diagnosis</p>
            </div>
            <div className={styles.eligibilityCard}>
              <h4>✓ Demonstrated Need</h4>
              <p>Clear need for equipment or modifications</p>
            </div>
            <div className={styles.eligibilityCard}>
              <h4>✓ Financial Assessment</h4>
              <p>Income verification and funding gap</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.applySection}>
        <div className="container">
          <h2>Ready to Apply?</h2>
          <p className={styles.applyText}>
            Our application process is straightforward and designed to be accessible. We'll work with you
            every step of the way to ensure you have the support you need.
          </p>
          <div className={styles.applyButtons}>
            <Link href="/connect" className="btn btn-primary">
              Start Your Application
            </Link>
            <Link href="/resources" className="btn btn-outline">
              View Resources
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

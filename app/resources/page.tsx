import Link from 'next/link'
import styles from './page.module.css'

export const metadata = {
  title: 'Resources | Meauxbility',
  description: 'Helpful resources, guides, and information for spinal cord injury survivors and caregivers.',
}

export default function Resources() {
  return (
    <div className="theme-dark">
      <section className={styles.resourcesHero}>
        <div className="container">
          <h1 className={styles.title}>Resources</h1>
          <p className={styles.subtitle}>
            Helpful information, guides, and links to support your journey.
          </p>
        </div>
      </section>

      <section className={styles.categoriesSection}>
        <div className="container">
          <div className={styles.categoriesGrid}>
            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>📚</div>
              <h3>Educational Materials</h3>
              <ul className={styles.resourceList}>
                <li><a href="#">Understanding Spinal Cord Injuries</a></li>
                <li><a href="#">Adaptive Equipment Guide</a></li>
                <li><a href="#">Home Modification Planning</a></li>
                <li><a href="#">Caregiver Resources</a></li>
              </ul>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>🏥</div>
              <h3>Medical Resources</h3>
              <ul className={styles.resourceList}>
                <li><a href="#">Acadiana Medical Centers</a></li>
                <li><a href="#">Rehabilitation Facilities</a></li>
                <li><a href="#">Specialized Care Providers</a></li>
                <li><a href="#">Insurance Navigation</a></li>
              </ul>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>🛠️</div>
              <h3>Equipment & Vendors</h3>
              <ul className={styles.resourceList}>
                <li><a href="#">Trusted Equipment Suppliers</a></li>
                <li><a href="#">Home Modification Contractors</a></li>
                <li><a href="#">Adaptive Technology</a></li>
                <li><a href="#">Maintenance & Repair</a></li>
              </ul>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>💼</div>
              <h3>Financial Assistance</h3>
              <ul className={styles.resourceList}>
                <li><a href="#">Additional Grant Programs</a></li>
                <li><a href="#">Insurance Information</a></li>
                <li><a href="#">Government Benefits</a></li>
                <li><a href="#">Fundraising Resources</a></li>
              </ul>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>⚖️</div>
              <h3>Legal & Advocacy</h3>
              <ul className={styles.resourceList}>
                <li><a href="#">ADA Rights & Resources</a></li>
                <li><a href="#">Legal Aid Services</a></li>
                <li><a href="#">Disability Advocacy</a></li>
                <li><a href="#">Employment Rights</a></li>
              </ul>
            </div>

            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>🌐</div>
              <h3>Online Communities</h3>
              <ul className={styles.resourceList}>
                <li><a href="#">National SCI Organizations</a></li>
                <li><a href="#">Support Forums</a></li>
                <li><a href="#">Social Media Groups</a></li>
                <li><a href="#">Peer Networks</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.emergencySection}>
        <div className="container">
          <div className={styles.emergencyBox}>
            <h2>🚨 Emergency Resources</h2>
            <p>
              If you're experiencing a medical emergency, call 911 immediately.
              For urgent equipment needs or accessibility crises, contact us directly.
            </p>
            <div className={styles.emergencyButtons}>
              <Link href="/connect" className="btn btn-primary">
                Contact Us
              </Link>
              <a href="tel:911" className="btn btn-secondary">
                Emergency: 911
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.downloadSection}>
        <div className="container">
          <h2>Download Our Guides</h2>
          <p className={styles.downloadText}>
            Access our comprehensive guides and checklists to help you navigate life after spinal cord injury.
          </p>
          <div className={styles.downloadGrid}>
            <div className={styles.downloadCard}>
              <div className={styles.downloadIcon}>📄</div>
              <h4>Grant Application Guide</h4>
              <button className="btn btn-outline">Download PDF</button>
            </div>
            <div className={styles.downloadCard}>
              <div className={styles.downloadIcon}>📋</div>
              <h4>Home Modification Checklist</h4>
              <button className="btn btn-outline">Download PDF</button>
            </div>
            <div className={styles.downloadCard}>
              <div className={styles.downloadIcon}>📖</div>
              <h4>Caregiver Handbook</h4>
              <button className="btn btn-outline">Download PDF</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

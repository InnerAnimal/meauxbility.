import Link from 'next/link'
import styles from './page.module.css'

export const metadata = {
  title: 'About Us | Meauxbility',
  description: 'Learn about Meauxbility\'s mission to empower spinal cord injury survivors across Louisiana\'s Acadiana region.',
}

export default function About() {
  return (
    <div className="theme-dark">
      <section className={styles.aboutHero}>
        <div className="container">
          <h1 className={styles.title}>About Meauxbility</h1>
          <p className={styles.subtitle}>
            Transforming pain into purpose, one life at a time.
          </p>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyContent}>
              <h2>Our Story</h2>
              <p>
                Meauxbility was founded with a simple yet powerful mission: to restore independence and mobility
                to spinal cord injury survivors across Louisiana's Acadiana region.
              </p>
              <p>
                We understand that accessibility isn't just about ramps and rails—it's about dignity, freedom,
                and the ability to live life on your own terms. Every grant we award, every life we touch, is a
                step toward a more inclusive and accessible community.
              </p>
              <p>
                Our team works tirelessly to connect survivors with the adaptive equipment, home modifications,
                and support services they need to thrive—not just survive.
              </p>
            </div>
            <div className={styles.storyImage}>
              <div className={styles.imagePlaceholder}>
                <p>Our Community</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <div className="container">
          <h2>Our Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🤝</div>
              <h3>Compassion</h3>
              <p>We lead with empathy and understanding for every person we serve.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🎯</div>
              <h3>Action</h3>
              <p>We turn intentions into real, measurable impact in our community.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🌟</div>
              <h3>Empowerment</h3>
              <p>We believe in restoring independence and dignity to those we serve.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🔗</div>
              <h3>Community</h3>
              <p>We build lasting connections that support healing and growth.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.impactSection}>
        <div className="container">
          <h2>Our Impact</h2>
          <p className={styles.impactText}>
            Since our founding, we've awarded over 50 grants totaling more than $250,000 in support for
            spinal cord injury survivors. But the real impact isn't measured in dollars—it's measured in
            restored independence, renewed hope, and transformed lives.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/programs" className="btn btn-primary">
              Apply for a Grant
            </Link>
            <Link href="/impact" className="btn btn-secondary">
              Support Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

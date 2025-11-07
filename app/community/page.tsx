import Link from 'next/link'
import styles from './page.module.css'

export const metadata = {
  title: 'Community | Meauxbility',
  description: 'Join our community of spinal cord injury survivors, caregivers, and supporters across Acadiana.',
}

export default function Community() {
  return (
    <div className="theme-dark">
      <section className={styles.communityHero}>
        <div className="container">
          <h1 className={styles.title}>Our Community</h1>
          <p className={styles.subtitle}>
            You're not alone. Join a supportive network of survivors, caregivers, and advocates.
          </p>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👥</div>
              <h3>Peer Support Groups</h3>
              <p>
                Connect with others who understand your journey. Our peer support groups meet
                monthly and provide a safe space to share experiences and encouragement.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📅</div>
              <h3>Community Events</h3>
              <p>
                From adaptive sports to social gatherings, we host events throughout the year
                that bring our community together and celebrate resilience.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎓</div>
              <h3>Workshops & Training</h3>
              <p>
                Educational workshops on topics ranging from adaptive technology to caregiver
                support, helping our community thrive.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💬</div>
              <h3>Online Forums</h3>
              <p>
                Stay connected 24/7 through our online community forums where members share
                resources, advice, and support.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.storiesSection}>
        <div className="container">
          <h2>Community Stories</h2>
          <p className={styles.storiesIntro}>
            Hear from members of our community about their journeys, challenges, and triumphs.
          </p>
          <div className={styles.storiesGrid}>
            <div className={styles.storyCard}>
              <div className={styles.storyQuote}>"</div>
              <p>
                Meauxbility didn't just help me get a wheelchair—they helped me get my life back.
                The community support has been incredible.
              </p>
              <div className={styles.storyAuthor}>— Grant Recipient, 2023</div>
            </div>

            <div className={styles.storyCard}>
              <div className={styles.storyQuote}>"</div>
              <p>
                Finding this community changed everything. I'm no longer isolated, and I have
                people who truly understand what I'm going through.
              </p>
              <div className={styles.storyAuthor}>— Community Member</div>
            </div>

            <div className={styles.storyCard}>
              <div className={styles.storyQuote}>"</div>
              <p>
                The peer mentorship program connected me with someone who's been where I am.
                It's made all the difference in my recovery.
              </p>
              <div className={styles.storyAuthor}>— Grant Recipient, 2024</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.joinSection}>
        <div className="container">
          <h2>Join Our Community</h2>
          <p className={styles.joinText}>
            Whether you're a survivor, caregiver, family member, or supporter, you're welcome here.
            Together, we're stronger.
          </p>
          <div className={styles.joinButtons}>
            <Link href="/connect" className="btn btn-primary">
              Get Connected
            </Link>
            <Link href="/programs" className="btn btn-secondary">
              View Programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

'use client'

import Link from 'next/link'
import styles from './GapSection.module.css'

interface Barrier {
  icon: string
  title: string
  description: string
  stat: string
}

const barriers: Barrier[] = [
  {
    icon: '💰',
    title: 'Financial Barriers',
    description: 'Adaptive equipment and home modifications can cost thousands of dollars, far beyond what insurance covers.',
    stat: '$15K-$50K average cost',
  },
  {
    icon: '🚧',
    title: 'Physical Barriers',
    description: 'Inaccessible homes, businesses, and public spaces prevent full community participation.',
    stat: '70% homes not accessible',
  },
  {
    icon: '❤️',
    title: 'Social Barriers',
    description: 'Isolation and lack of community support create invisible but powerful obstacles to independence.',
    stat: '60% report isolation',
  },
]

export default function GapSection() {
  return (
    <section className={styles.gap}>
      <div className="container">
        <div className={styles.gapHeader}>
          <h2 className={styles.gapTitle}>The Accessibility Gap</h2>
          <p className={styles.gapSubtitle}>
            Understanding the barriers spinal cord injury survivors face
          </p>
        </div>

        <div className={styles.gapGrid}>
          {barriers.map((barrier, index) => (
            <div key={index} className={styles.barrierCard}>
              <div className={styles.barrierIcon}>{barrier.icon}</div>
              <h3 className={styles.barrierTitle}>{barrier.title}</h3>
              <p className={styles.barrierDescription}>{barrier.description}</p>
              <div className={styles.barrierStat}>{barrier.stat}</div>
            </div>
          ))}
        </div>

        <div className={styles.gapCta}>
          <p className={styles.gapCtaText}>
            We're here to bridge these gaps and restore independence
          </p>
          <Link href="/programs" className="btn btn-primary">
            Learn About Our Programs
          </Link>
        </div>
      </div>
    </section>
  )
}

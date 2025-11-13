'use client'

import styles from './AnnouncementBanner.module.css'

export default function AnnouncementBanner() {
  const text = 'MORE OPTIONS • MORE ACCESS • MORE LIFE'

  return (
    <div className={styles.banner}>
      <div className={styles.scrollWrapper}>
        <div className={styles.scrollContent}>
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className={styles.scrollItem}>
              {text}
            </span>
          ))}
        </div>
        <div className={styles.scrollContent} aria-hidden="true">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className={styles.scrollItem}>
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

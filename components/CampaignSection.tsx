'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './CampaignSection.module.css'

export default function CampaignSection() {
  const goalAmount = 50000
  const currentAmount = 18750 // This would come from your database
  const percentage = Math.min((currentAmount / goalAmount) * 100, 100)

  const [animatedPercentage, setAnimatedPercentage] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage)
    }, 300)
    return () => clearTimeout(timer)
  }, [percentage])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <section className={styles.campaign}>
      <div className="container">
        <div className={styles.campaignCard}>
          <div className={styles.campaignContent}>
            <div className={styles.campaignBadge}>Active Campaign</div>
            <h2 className={styles.campaignTitle}>Help DonMichael Regain Independence</h2>
            <p className={styles.campaignDescription}>
              DonMichael suffered a spinal cord injury and needs your support for a wheelchair-accessible vehicle
              and home modifications that will restore his independence and quality of life.
            </p>

            <div className={styles.progressWrapper}>
              <div className={styles.progressStats}>
                <div className={styles.progressAmount}>
                  <span className={styles.amountLabel}>Raised</span>
                  <span className={styles.amountValue}>{formatCurrency(currentAmount)}</span>
                </div>
                <div className={styles.progressGoal}>
                  <span className={styles.goalLabel}>Goal</span>
                  <span className={styles.goalValue}>{formatCurrency(goalAmount)}</span>
                </div>
              </div>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${animatedPercentage}%` }}
                >
                  <span className={styles.progressLabel}>{Math.round(percentage)}%</span>
                </div>
              </div>
            </div>

            <div className={styles.campaignActions}>
              <Link href="/campaign/donmichael" className="btn btn-primary">
                Learn More About DonMichael
              </Link>
              <Link href="/impact" className="btn btn-secondary">
                Donate Now
              </Link>
            </div>
          </div>

          <div className={styles.campaignImage}>
            <img
              src="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/donmichael-campaign.jpg?v=1760648661"
              alt="DonMichael"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

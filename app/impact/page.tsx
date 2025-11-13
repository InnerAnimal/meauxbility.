'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

export default function Impact() {
  const [donationAmount, setDonationAmount] = useState<number | ''>('')
  const [customAmount, setCustomAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const presetAmounts = [25, 50, 100, 250, 500, 1000]

  const handleDonate = async () => {
    const amount = customAmount ? parseFloat(customAmount) : donationAmount
    if (!amount || amount < 5) {
      alert('Please enter a donation amount of at least $5')
      return
    }

    setIsProcessing(true)

    try {
      // This will be wired to Stripe in the API
      alert('Donation functionality will be integrated with Stripe. Amount: $' + amount)
      // TODO: Integrate with /api/donations endpoint
    } catch (error) {
      console.error('Donation error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <section className={styles.impactHero}>
        <div className="container">
          <h1 className={styles.title}>Make an Impact</h1>
          <p className={styles.subtitle}>
            Your donation directly supports spinal cord injury survivors in our community.
          </p>
        </div>
      </section>

      <section className={styles.donateSection}>
        <div className="container">
          <div className={styles.donateGrid}>
            <div className={styles.donateInfo}>
              <h2>Why Your Support Matters</h2>
              <p>
                Every dollar you contribute goes directly toward providing mobility grants, adaptive equipment,
                and accessibility services to spinal cord injury survivors across Acadiana.
              </p>

              <div className={styles.impactList}>
                <div className={styles.impactItem}>
                  <div className={styles.impactIcon}>💙</div>
                  <div>
                    <h4>$25</h4>
                    <p>Provides essential supplies for a grant recipient</p>
                  </div>
                </div>

                <div className={styles.impactItem}>
                  <div className={styles.impactIcon}>🦽</div>
                  <div>
                    <h4>$250</h4>
                    <p>Funds wheelchair accessories or small modifications</p>
                  </div>
                </div>

                <div className={styles.impactItem}>
                  <div className={styles.impactIcon}>🏠</div>
                  <div>
                    <h4>$1,000</h4>
                    <p>Covers a home accessibility modification</p>
                  </div>
                </div>

                <div className={styles.impactItem}>
                  <div className={styles.impactIcon}>✨</div>
                  <div>
                    <h4>$5,000+</h4>
                    <p>Provides a complete mobility solution</p>
                  </div>
                </div>
              </div>

              <div className={styles.taxInfo}>
                <p>
                  <strong>Tax-deductible donation:</strong> Meauxbility is a registered 501(c)(3) nonprofit
                  organization. EIN: 33-4214907
                </p>
              </div>
            </div>

            <div className={styles.donateForm}>
              <h3>Select Donation Amount</h3>

              <div className={styles.amountGrid}>
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    className={`${styles.amountBtn} ${donationAmount === amount ? styles.amountBtnActive : ''}`}
                    onClick={() => {
                      setDonationAmount(amount)
                      setCustomAmount('')
                    }}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className={styles.customAmount}>
                <label htmlFor="customAmount">Or enter custom amount</label>
                <div className={styles.inputGroup}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    type="number"
                    id="customAmount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setDonationAmount('')
                    }}
                    placeholder="Enter amount"
                    min="5"
                    className={styles.customInput}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 'var(--mbx-space-md)' }}
                onClick={handleDonate}
                disabled={isProcessing || (!donationAmount && !customAmount)}
              >
                {isProcessing ? 'Processing...' : 'Donate Now'}
              </button>

              <p className={styles.secureNote}>
                🔒 Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.waysToGive}>
        <div className="container">
          <h2>Other Ways to Give</h2>
          <div className={styles.waysGrid}>
            <div className={styles.wayCard}>
              <div className={styles.wayIcon}>📅</div>
              <h4>Monthly Giving</h4>
              <p>Become a sustaining supporter with recurring monthly donations.</p>
            </div>

            <div className={styles.wayCard}>
              <div className={styles.wayIcon}>🎁</div>
              <h4>Memorial Gifts</h4>
              <p>Honor a loved one with a meaningful donation in their memory.</p>
            </div>

            <div className={styles.wayCard}>
              <div className={styles.wayIcon}>🏢</div>
              <h4>Corporate Matching</h4>
              <p>Double your impact through your employer's matching gift program.</p>
            </div>

            <div className={styles.wayCard}>
              <div className={styles.wayIcon}>📜</div>
              <h4>Legacy Giving</h4>
              <p>Include Meauxbility in your estate planning.</p>
            </div>
          </div>

          <div className={styles.contactCta}>
            <p>Interested in these giving options?</p>
            <Link href="/connect" className="btn btn-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.impactStats}>
        <div className="container">
          <h2>Your Impact in Action</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>50+</div>
              <div className={styles.statLabel}>Lives Changed</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>$250K+</div>
              <div className={styles.statLabel}>Grants Awarded</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>Acadiana Coverage</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

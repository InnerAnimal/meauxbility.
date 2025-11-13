'use client'

import { useState } from 'react'
import styles from './ValuesSection.module.css'

interface Value {
  icon: string
  title: string
  description: string
  color: string
}

const values: Value[] = [
  {
    icon: '🤝',
    title: 'Compassion',
    description: 'We lead with empathy and understanding for every person we serve.',
    color: 'teal',
  },
  {
    icon: '🎯',
    title: 'Action',
    description: 'We turn intentions into real, measurable impact in our community.',
    color: 'orange',
  },
  {
    icon: '🌟',
    title: 'Empowerment',
    description: 'We believe in restoring independence and dignity to those we serve.',
    color: 'purple',
  },
  {
    icon: '🔗',
    title: 'Community',
    description: 'We build lasting connections that support healing and growth.',
    color: 'mint',
  },
]

export default function ValuesSection() {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())

  const toggleCard = (index: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <section className={styles.values}>
      <div className="container">
        <div className={styles.valuesHeader}>
          <h2 className={styles.valuesTitle}>Our Core Values</h2>
          <p className={styles.valuesSubtitle}>
            The principles that guide everything we do
          </p>
        </div>

        <div className={styles.valuesGrid}>
          {values.map((value, index) => (
            <div
              key={index}
              className={`${styles.valueCard} ${flippedCards.has(index) ? styles.flipped : ''} ${styles[`card${value.color}`]}`}
              onClick={() => toggleCard(index)}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>
                  <div className={styles.valueIcon}>{value.icon}</div>
                  <h3 className={styles.valueTitle}>{value.title}</h3>
                </div>
                <div className={styles.cardBack}>
                  <h3 className={styles.valueTitle}>{value.title}</h3>
                  <p className={styles.valueDescription}>{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

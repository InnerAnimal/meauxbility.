'use client'

import { useState, useEffect, FormEvent } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import styles from './DonationModal.module.css'

const stripePromise = loadStripe('pk_live_51S4R0SRW56Pm3uYI8EKbysm1ok4peVXSD6G17HtFy8BDuG9Carn8Ry7iPVzulMBtdEFcz5pFvXpE04CIgn8PY6WS00aXOqMYEI')

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
}

function DonationForm({ onClose }: { onClose: () => void }) {
  const stripe = useStripe()
  const elements = useElements()

  const [amount, setAmount] = useState(250)
  const [frequency, setFrequency] = useState<'one_time' | 'monthly'>('one_time')
  const [designation, setDesignation] = useState('general')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const amounts = [25, 50, 100, 250, 500, 1000]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!firstName.trim()) newErrors.firstName = 'Required'
    if (!lastName.trim()) newErrors.lastName = 'Required'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Valid email required'
    }
    if (amount < 1) newErrors.amount = 'Amount must be at least $1'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !stripe || !elements) return

    setIsProcessing(true)

    try {
      // Create payment intent
      const response = await fetch('https://shhh-ox7c.onrender.com/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `don_${Date.now()}_${Math.random()}`,
        },
        body: JSON.stringify({
          fund: designation,
          frequency,
          amount,
          currency: 'usd',
          metadata: {
            firstName,
            lastName,
            email,
          },
        }),
      })

      const { clientSecret } = await response.json()

      // Confirm card payment
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error('Card element not found')

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${firstName} ${lastName}`,
            email,
          },
        },
      })

      if (error) throw new Error(error.message)

      if (paymentIntent?.status === 'succeeded') {
        setShowSuccess(true)
        setTimeout(() => {
          onClose()
          // Reset form
          setShowSuccess(false)
          setFirstName('')
          setLastName('')
          setEmail('')
          setAmount(250)
          setFrequency('one_time')
          setDesignation('general')
          if (cardElement) cardElement.clear()
        }, 3000)
      }
    } catch (error: any) {
      alert(`Payment failed: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className={styles.modalBody}>
      {showSuccess && (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✅</div>
          <div className={styles.successTitle}>Thank You!</div>
          <div className={styles.successDesc}>Your donation has been processed successfully.</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.donateGrid}>
          {/* Amount Selection */}
          <div className={styles.donateOptions}>
            <h3 className={styles.optionTitle}>Choose Your Gift</h3>

            {/* Frequency Toggle */}
            <div className={styles.frequencyToggle}>
              <button
                type="button"
                className={`${styles.frequencyBtn} ${frequency === 'one_time' ? styles.active : ''}`}
                onClick={() => setFrequency('one_time')}
              >
                One Time
              </button>
              <button
                type="button"
                className={`${styles.frequencyBtn} ${frequency === 'monthly' ? styles.active : ''}`}
                onClick={() => setFrequency('monthly')}
              >
                Monthly
              </button>
            </div>

            {/* Amount Buttons */}
            <div className={styles.amountGrid}>
              {amounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className={`${styles.amountBtn} ${amount === amt ? styles.selected : ''}`}
                  onClick={() => setAmount(amt)}
                >
                  ${amt >= 1000 ? `${amt / 1000}k` : amt}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <input
              type="number"
              className={styles.customAmount}
              placeholder="Custom amount"
              min="1"
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            />

            {/* Designation */}
            <div className={styles.designation}>
              <select
                id="designation"
                className={styles.selectInput}
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              >
                <option value="general">Where Most Needed</option>
                <option value="donmichael">DonMichael's Wheelchair</option>
                <option value="recovery">Recovery Grant Program</option>
                <option value="adaptive">Adaptive Athletes</option>
                <option value="equipment">Equipment Fund</option>
              </select>
            </div>
          </div>

          {/* Donor Information */}
          <div className={styles.donorInfo}>
            <h3 className={styles.optionTitle}>Your Information</h3>

            <div className={styles.nameGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  className={styles.formInput}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                {errors.firstName && <div className={styles.error}>{errors.firstName}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className={styles.formInput}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                {errors.lastName && <div className={styles.error}>{errors.lastName}</div>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className={styles.formInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <div className={styles.error}>{errors.email}</div>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="card">Card Information</label>
              <div className={styles.cardElement}>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '14px',
                        color: '#fff',
                        fontFamily: 'Inter, sans-serif',
                        '::placeholder': {
                          color: 'rgba(255,255,255,0.5)',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isProcessing || !stripe}>
              {isProcessing ? (
                <span className={styles.loading}>
                  <span className={styles.spinner} />
                  Processing...
                </span>
              ) : (
                'Complete Donation'
              )}
            </button>

            <div className={styles.secureInfo}>🔒 Secure & tax-deductible • EIN: 33-4214907</div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className={`${styles.modalBackdrop} ${isOpen ? styles.active : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      aria-hidden={!isOpen}
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle} id="modal-title">
              Support Meauxbility
            </h3>
            <p className={styles.modalSubtitle}>Every dollar transforms lives</p>
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close donation modal">
            &times;
          </button>
        </div>

        <Elements stripe={stripePromise}>
          <DonationForm onClose={onClose} />
        </Elements>
      </div>
    </div>
  )
}

'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(250);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<'one_time' | 'monthly'>('one_time');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [stripe, setStripe] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);

  // Initialize Stripe
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Stripe) {
      const stripeInstance = (window as any).Stripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_live_51S4R0SRW56Pm3uYI8EKbysm1ok4peVXSD6G17HtFy8BDuG9Carn8Ry7iPVzulMBtdEFcz5pFvXpE04CIgn8PY6WS00aXOqMYEI'
      );
      setStripe(stripeInstance);

      const elements = stripeInstance.elements();
      const card = elements.create('card', {
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
      });

      setCardElement(card);
    }
  }, []);

  // Mount card element when modal opens
  useEffect(() => {
    if (isModalOpen && cardElement) {
      const cardContainer = document.getElementById('mbx-card-element');
      if (cardContainer && !cardContainer.hasChildNodes()) {
        cardElement.mount('#mbx-card-element');
        cardElement.on('change', (event: any) => {
          if (event.error) {
            setErrors((prev) => ({ ...prev, card: true }));
          } else {
            setErrors((prev) => ({ ...prev, card: false }));
          }
        });
      }
    }
  }, [isModalOpen, cardElement]);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
    resetForm();
  };

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '' });
    setErrors({});
    setShowSuccess(false);
    setCustomAmount('');
    if (cardElement) cardElement.clear();
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    if (value && parseFloat(value) > 0) {
      setSelectedAmount(parseFloat(value));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};

    if (!formData.firstName.trim()) newErrors.firstName = true;
    if (!formData.lastName.trim()) newErrors.lastName = true;
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processDonation = async () => {
    if (!validateForm() || !stripe || !cardElement) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fund: (document.getElementById('mbxDesignation') as HTMLSelectElement)?.value || 'general',
          frequency,
          amount: selectedAmount,
          currency: 'usd',
          metadata: formData,
        }),
      });

      const { clientSecret } = await response.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
          },
        },
      });

      if (error) throw new Error(error.message);

      if (paymentIntent.status === 'succeeded') {
        setShowSuccess(true);
        setTimeout(() => closeModal(), 3000);
      }
    } catch (error: any) {
      alert(`Payment failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    // TODO: Implement newsletter signup with Resend
    alert(`Thank you for subscribing with ${email}!`);
    e.currentTarget.reset();
  };

  return (
    <>
      <Script src="https://js.stripe.com/v3/" strategy="lazyOnload" />
      <Script
        type="module"
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        strategy="lazyOnload"
      />

      <footer className="mbx-footer" id="mbx-footer" role="contentinfo">
        {/* 3D GLB Accent */}
        <div className="mbx-3d-accent" aria-hidden="true">
          <model-viewer
            src="https://cdn.shopify.com/3d/models/4b0a47ca8a38b77c/Kinetic_Symmetry_0831084700_generate.glb"
            alt="Decorative 3D element"
            auto-rotate="true"
            rotation-per-second="18deg"
            camera-controls="false"
            disable-zoom="true"
            disable-pan="true"
            disable-tap="true"
            interaction-prompt="none"
            shadow-intensity="0"
            exposure="1.2"
            loading="lazy"
            reveal="auto"
          />
        </div>

        <div className="mbx-footer-container">
          <div className="mbx-footer-grid">
            {/* Brand Column */}
            <div className="mbx-footer-brand">
              <a href="/" className="mbx-footer-logo" aria-label="Meauxbility Home">
                <picture>
                  <source
                    srcSet="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/meauxbility_logo_540.webp?v=1760648661"
                    type="image/webp"
                  />
                  <img
                    src="https://cdn.shopify.com/s/files/1/0685/1654/4672/files/meauxbility_logo_540.png?v=1760648662"
                    alt="Meauxbility - Empowering mobility and independence"
                    width="220"
                    height="220"
                    loading="lazy"
                  />
                </picture>
              </a>

              <div className="mbx-footer-social" role="list">
                <a
                  className="mbx-social-link"
                  aria-label="Facebook"
                  href="https://www.facebook.com/p/Meauxbility-61577795721851/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  className="mbx-social-link"
                  aria-label="Instagram"
                  href="https://www.instagram.com/meauxbility/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 15.838a3.838 3.838 0 110-7.676 3.838 3.838 0 010 7.676zM18.406 5.594a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                  </svg>
                </a>
              </div>

              <p>
                More Options. More Access. More Life. Join us as we transform obstacles into pathways for
                adaptive athletes and spinal cord injury survivors.
              </p>

              <div className="mbx-footer-cta">
                <a className="mbx-btn mbx-btn-primary" href="/donmichael-campaign">
                  DonMichael's Campaign
                </a>
                <button className="mbx-btn mbx-btn-outline" onClick={openModal}>
                  Donate Now
                </button>
              </div>

              <div className="mbx-newsletter">
                <h4>Stay Connected</h4>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginBottom: '8px' }}>
                  Get updates on our impact and ways to help
                </p>
                <form className="mbx-newsletter-form" onSubmit={handleNewsletterSubmit}>
                  <input
                    type="email"
                    name="email"
                    className="mbx-newsletter-input"
                    placeholder="Enter your email"
                    required
                    aria-label="Email address"
                  />
                  <button type="submit" className="mbx-newsletter-btn">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Resources Column */}
            <div className="mbx-footer-column">
              <h4>Resources</h4>
              <ul className="mbx-footer-links" role="list">
                <li>
                  <a href="/brand-guide">Brand Guide</a>
                </li>
                <li>
                  <a href="/community">Community</a>
                </li>
                <li>
                  <a href="/news">Latest News</a>
                </li>
                <li>
                  <a href="/nonprofit-info">501(c)(3) Info</a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="mbx-footer-column">
              <h4>Company</h4>
              <ul className="mbx-footer-links" role="list">
                <li>
                  <a href="/about-sam">About Sam</a>
                </li>
                <li>
                  <a href="/team">Our Team</a>
                </li>
                <li>
                  <a href="/mission">Our Mission</a>
                </li>
                <li>
                  <a href="/partners">Partners</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="mbx-footer-column">
              <h4>Support</h4>
              <ul className="mbx-footer-links" role="list">
                <li>
                  <a href="/faq">FAQ</a>
                </li>
                <li>
                  <a href="/donate">Ways to Give</a>
                </li>
                <li>
                  <a href="/get-involved">Get Involved</a>
                </li>
                <li>
                  <a href="/apply">Apply for Grant</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mbx-footer-bottom">
            <div className="mbx-footer-legal">
              <a href="/privacy">Privacy Policy</a>
              <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.3)' }}>
                •
              </span>
              <a href="/terms">Terms of Service</a>
              <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.3)' }}>
                •
              </span>
              <a href="/accessibility">Accessibility</a>
            </div>

            <div className="mbx-footer-copyright">
              © {new Date().getFullYear()} Meauxbility. 501(c)(3) EIN: 33-4214907. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Donation Modal */}
      {isModalOpen && (
        <div
          className={`mbx-modal-backdrop ${isModalOpen ? 'active' : ''}`}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          aria-hidden={!isModalOpen}
          role="dialog"
          aria-labelledby="mbx-modal-title"
        >
          <div className="mbx-modal">
            <div className="mbx-modal-header">
              <div>
                <h3 className="mbx-modal-title" id="mbx-modal-title">
                  Support Meauxbility
                </h3>
                <p className="mbx-modal-subtitle">Every dollar transforms lives</p>
              </div>
              <button className="mbx-modal-close" onClick={closeModal} aria-label="Close donation modal">
                &times;
              </button>
            </div>
            <div className="mbx-modal-body">
              {showSuccess && (
                <div className={`mbx-success-message ${showSuccess ? 'show' : ''}`}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                  <div style={{ fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>Thank You!</div>
                  <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>
                    Your donation has been processed successfully.
                  </div>
                </div>
              )}
              <div className="mbx-donate-grid">
                <div className="mbx-donate-options">
                  <h3 className="mbx-option-title">Choose Your Gift</h3>
                  <div className="mbx-frequency-toggle">
                    <button
                      className={`mbx-frequency-btn ${frequency === 'one_time' ? 'active' : ''}`}
                      onClick={() => setFrequency('one_time')}
                    >
                      One Time
                    </button>
                    <button
                      className={`mbx-frequency-btn ${frequency === 'monthly' ? 'active' : ''}`}
                      onClick={() => setFrequency('monthly')}
                    >
                      Monthly
                    </button>
                  </div>
                  <div className="mbx-amount-grid">
                    {[25, 50, 100, 250, 500, 1000].map((amount) => (
                      <button
                        key={amount}
                        className={`mbx-amount-btn ${selectedAmount === amount && !customAmount ? 'selected' : ''}`}
                        onClick={() => handleAmountSelect(amount)}
                      >
                        ${amount === 1000 ? '1k' : amount}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    className="mbx-custom-amount"
                    placeholder="Custom amount"
                    min="1"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                  />
                  <div className="mbx-designation" style={{ marginTop: '1rem' }}>
                    <select
                      id="mbxDesignation"
                      style={{
                        width: '100%',
                        padding: '0.75rem 2rem 0.75rem 0.75rem',
                        background: 'rgba(26,74,82,0.3)',
                        border: '1.5px solid rgba(74,171,184,0.3)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundImage:
                          "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 12 12%27%3E%3Cpath fill=%27%23fff%27 d=%27M6 8L2 4h8z%27/%3E%3C/svg%3E')",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      <option value="general">Where Most Needed</option>
                      <option value="donmichael">DonMichael's Wheelchair</option>
                      <option value="recovery">Recovery Grant Program</option>
                      <option value="adaptive">Adaptive Athletes</option>
                      <option value="equipment">Equipment Fund</option>
                    </select>
                  </div>
                </div>
                <div className="mbx-donor-info">
                  <h3 className="mbx-option-title">Your Information</h3>
                  <div
                    className="mbx-name-grid"
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}
                  >
                    <div className="mbx-form-group">
                      <label
                        style={{
                          display: 'block',
                          color: 'rgba(255,255,255,0.9)',
                          marginBottom: '0.375rem',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                        }}
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        className="mbx-form-input"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                      {errors.firstName && (
                        <div className="mbx-error show" style={{ display: 'block' }}>
                          Required
                        </div>
                      )}
                    </div>
                    <div className="mbx-form-group">
                      <label
                        style={{
                          display: 'block',
                          color: 'rgba(255,255,255,0.9)',
                          marginBottom: '0.375rem',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                        }}
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="mbx-form-input"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                      {errors.lastName && (
                        <div className="mbx-error show" style={{ display: 'block' }}>
                          Required
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mbx-form-group" style={{ marginBottom: '1rem' }}>
                    <label
                      style={{
                        display: 'block',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '0.375rem',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                      }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="mbx-form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    {errors.email && (
                      <div className="mbx-error show" style={{ display: 'block' }}>
                        Valid email required
                      </div>
                    )}
                  </div>
                  <div className="mbx-form-group">
                    <label
                      style={{
                        display: 'block',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '0.375rem',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                      }}
                    >
                      Card Information
                    </label>
                    <div
                      id="mbx-card-element"
                      style={{
                        padding: '0.75rem',
                        background: 'rgba(26,74,82,0.3)',
                        border: '1.5px solid rgba(74,171,184,0.3)',
                        borderRadius: '10px',
                      }}
                    ></div>
                    {errors.card && (
                      <div className="mbx-error show" style={{ display: 'block' }}>
                        Card information required
                      </div>
                    )}
                  </div>
                  <button className="mbx-donate-submit" onClick={processDonation} disabled={isLoading}>
                    {!isLoading ? (
                      <span className="mbx-submit-text">Complete Donation</span>
                    ) : (
                      <div className="mbx-loading active" style={{ display: 'flex' }}>
                        <div className="mbx-spinner"></div>
                        <span>Processing...</span>
                      </div>
                    )}
                  </button>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginTop: '1.25rem',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.75rem',
                    }}
                  >
                    🔒 Secure & tax-deductible • EIN: 33-4214907
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

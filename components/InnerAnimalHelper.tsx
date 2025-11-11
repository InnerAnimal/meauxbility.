'use client'

import React from 'react'
import styles from './InnerAnimalHelper.module.css'

interface Integration {
  id: string
  name: string
  icon: string
  status: 'online' | 'warning' | 'offline'
  desc: string
  actions: string[]
  url: string
}

interface App {
  name: string
  url: string
  status: 'online' | 'warning' | 'offline'
}

const integrations: Integration[] = [
  {
    id: 'vercel',
    name: 'Vercel',
    icon: '🚀',
    status: 'online',
    desc: 'Deployments & Projects',
    actions: ['Deploy', 'View Projects', 'Check Logs'],
    url: 'https://vercel.com/dashboard'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: '💳',
    status: 'online',
    desc: 'Payments & Subscriptions',
    actions: ['View Balance', 'Customers', 'Transactions'],
    url: 'https://dashboard.stripe.com'
  },
  {
    id: 'resend',
    name: 'Resend',
    icon: '📧',
    status: 'online',
    desc: 'Email Sending',
    actions: ['Send Email', 'View Logs', 'Domains'],
    url: 'https://resend.com/emails'
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    icon: '☁️',
    status: 'online',
    desc: 'DNS, KV & Workers',
    actions: ['DNS Records', 'KV Store', 'Workers'],
    url: 'https://dash.cloudflare.com'
  },
  {
    id: 'supabase',
    name: 'Supabase',
    icon: '🗄️',
    status: 'online',
    desc: 'Database & Vault',
    actions: ['Vault', 'Database', 'Analytics'],
    url: 'https://supabase.com/dashboard'
  },
  {
    id: 'google',
    name: 'Google Services',
    icon: '🔥',
    status: 'online',
    desc: 'Gmail, Calendar, Drive, Meet',
    actions: ['Gmail', 'Calendar', 'Drive', 'Meet'],
    url: 'https://workspace.google.com'
  }
]

const apps: App[] = [
  { name: 'Meauxbility.org', url: 'https://meauxbility.org', status: 'online' },
  { name: 'InnerAnimalMedia.com', url: 'https://inneranimalmedia.com', status: 'online' },
  { name: 'InnerAnimal.app', url: 'https://inneranimal.app', status: 'online' },
  { name: 'iAutodidact.app', url: 'https://iautodidact.app', status: 'online' },
  { name: 'Meauxxx.com', url: 'https://meauxxx.com', status: 'online' },
  { name: 'Leadership Legacy', url: 'https://leadershiplegacy.vercel.app', status: 'online' },
  { name: 'Universal Helper', url: 'https://universal-helper.vercel.app', status: 'online' }
]

interface InnerAnimalHelperProps {
  isOpen: boolean
  onClose: () => void
}

export default function InnerAnimalHelper({ isOpen, onClose }: InnerAnimalHelperProps) {
  if (!isOpen) return null

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.title}>
              <span className={styles.titleIcon}>🦁</span>
              <div>
                <div className={styles.titleText}>InnerAnimal Helper</div>
                <div className={styles.subtitle}>Your team&apos;s central hub for all integrations & apps</div>
              </div>
            </div>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Content */}
        <div className={styles.content}>

          {/* Claude Workflow Guide */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>🧠 Claude Workflow</div>
            <div className={styles.guide}>
              <div className={styles.guideTitle}>How to Work with Claude + This Dashboard</div>
              <div className={styles.guideSteps}>
                <div className={styles.step}>
                  <div className={styles.stepNum}>1</div>
                  <div>Ask Claude: &quot;How do I [deploy/send email/check DB]?&quot;</div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNum}>2</div>
                  <div>Claude guides you to the right integration below</div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNum}>3</div>
                  <div>Claude writes code using Claude Code</div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNum}>4</div>
                  <div>You edit files using Cursor</div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNum}>5</div>
                  <div>Deploy via integration → Monitor here</div>
                </div>
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>⚡ Integrations</div>
            <div className={styles.grid}>
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className={styles.card}
                  onClick={() => window.open(integration.url, '_blank')}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardIcon}>{integration.icon}</div>
                      <div>
                        <div className={styles.cardName}>{integration.name}</div>
                        <div className={styles.cardDesc}>{integration.desc}</div>
                      </div>
                    </div>
                    <div className={`${styles.status} ${styles[integration.status]}`} />
                  </div>
                  <div className={styles.actions}>
                    {integration.actions.map((action) => (
                      <button key={action} className={styles.btn}>{action}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Production Apps */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>🚀 Production Apps</div>
            <div className={styles.grid}>
              {apps.map((app) => (
                <a
                  key={app.name}
                  className={styles.appCard}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className={styles.appHeader}>
                    <div className={styles.appName}>{app.name}</div>
                    <div className={`${styles.status} ${styles[app.status]}`} />
                  </div>
                  <div className={styles.appUrl}>
                    <span>↗</span>
                    <span>{app.url}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

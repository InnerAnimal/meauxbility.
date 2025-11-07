'use client'

import { useChat } from 'ai/react'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import InnerAnimalHelper from './InnerAnimalHelper'
import styles from './ChatWidget.module.css'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHelperOpen, setIsHelperOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const { isAdmin, login, logout, username: adminUsername } = useAuth()
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: {
      isAdmin
    }
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const success = login(username, password)
    if (success) {
      setShowLogin(false)
      setLoginError('')
      setUsername('')
      setPassword('')
    } else {
      setLoginError('Invalid credentials')
    }
  }

  // Detect if user is asking to see integrations
  const lastUserMessage = messages[messages.length - 1]?.content.toLowerCase() || ''
  const shouldOpenHelper = isAdmin && lastUserMessage.includes('integration')

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={styles.chatButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Admin Helper Button (only show when admin) */}
      {isAdmin && (
        <button
          className={styles.helperButton}
          onClick={() => setIsHelperOpen(true)}
          aria-label="Open admin helper"
          title="InnerAnimal Helper"
        >
          🦁
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className={styles.chatModal}>
          <div className={styles.chatHeader}>
            <div>
              <h3>Meauxbility Assistant {isAdmin && <span className={styles.adminBadge}>Admin</span>}</h3>
              <p>{isAdmin ? `Welcome back, ${adminUsername}!` : 'Ask me about grants, programs, or how to help'}</p>
            </div>
            <div className={styles.headerActions}>
              {!isAdmin && (
                <button
                  onClick={() => setShowLogin(!showLogin)}
                  className={styles.loginButton}
                  aria-label="Admin login"
                  title="Admin login"
                >
                  🔐
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => {
                    logout()
                    setShowLogin(false)
                  }}
                  className={styles.logoutButton}
                  aria-label="Logout"
                  title="Logout"
                >
                  Logout
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className={styles.closeButton}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </div>

          {/* Admin Login Form */}
          {showLogin && !isAdmin && (
            <div className={styles.loginForm}>
              <form onSubmit={handleLogin}>
                <h4>Admin Login</h4>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {loginError && <p className={styles.error}>{loginError}</p>}
                <div className={styles.loginActions}>
                  <button type="submit">Login</button>
                  <button type="button" onClick={() => setShowLogin(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className={styles.chatMessages}>
            {messages.length === 0 && (
              <div className={styles.welcomeMessage}>
                <p>👋 Hi! I'm here to help you {isAdmin ? 'with everything:' : 'learn about:'}</p>
                <ul>
                  <li>Grant programs & eligibility</li>
                  <li>Application process</li>
                  <li>Community resources</li>
                  <li>Ways to donate & support</li>
                  {isAdmin && (
                    <>
                      <li>🔧 View integrations (Vercel, Stripe, etc.)</li>
                      <li>🚀 Deployment guidance</li>
                      <li>📊 Database queries</li>
                    </>
                  )}
                </ul>
                <p>What can I help you with today?</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === 'user'
                    ? styles.userMessage
                    : styles.assistantMessage
                }
              >
                <div className={styles.messageContent}>
                  {message.content}

                  {/* Show helper button if AI suggests viewing integrations */}
                  {message.role === 'assistant' && isAdmin && message.content.toLowerCase().includes('integration') && (
                    <button
                      className={styles.helperLink}
                      onClick={() => setIsHelperOpen(true)}
                    >
                      🦁 Open Integration Hub
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={styles.assistantMessage}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className={styles.chatInput}>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={isAdmin ? "Ask anything (grants, integrations, deployments)..." : "Ask a question..."}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* InnerAnimal Helper Modal */}
      {isAdmin && (
        <InnerAnimalHelper
          isOpen={isHelperOpen}
          onClose={() => setIsHelperOpen(false)}
        />
      )}
    </>
  )
}

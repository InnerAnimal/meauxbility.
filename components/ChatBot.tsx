'use client'

import { useState } from 'react'
import styles from './ChatBot.module.css'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm the Meauxbility assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInputValue('')

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes('grant') || lowerInput.includes('apply')) {
      return "To apply for a grant, visit our Programs page where you'll find our application form and eligibility requirements. We're here to help!"
    } else if (lowerInput.includes('donate') || lowerInput.includes('support')) {
      return "Thank you for your interest in supporting our mission! You can make a donation on our Impact page. Every contribution helps restore independence."
    } else if (lowerInput.includes('contact') || lowerInput.includes('email')) {
      return "You can reach us at info@meauxbility.org or visit our Connect page to send us a message directly."
    } else if (lowerInput.includes('hours') || lowerInput.includes('available')) {
      return "Our team is available Monday-Friday, 9am-5pm CST. You can reach us anytime via email at info@meauxbility.org."
    } else {
      return "I'm here to help! You can ask me about our grant programs, how to donate, or how to get in touch with our team."
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        className={`${styles.chatButton} ${isOpen ? styles.chatButtonOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderContent}>
              <div className={styles.chatAvatar}>💬</div>
              <div>
                <h3 className={styles.chatTitle}>Meauxbility Assistant</h3>
                <p className={styles.chatStatus}>Online</p>
              </div>
            </div>
          </div>

          <div className={styles.chatMessages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${
                  message.sender === 'user' ? styles.messageUser : styles.messageBot
                }`}
              >
                <div className={styles.messageContent}>
                  <p>{message.text}</p>
                  <span className={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.chatInput}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className={styles.input}
            />
            <button
              onClick={handleSend}
              className={styles.sendButton}
              disabled={!inputValue.trim()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

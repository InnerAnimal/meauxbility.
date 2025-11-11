'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isAdmin: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  username: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('mbx_admin_session')
    if (stored) {
      try {
        const session = JSON.parse(stored)
        if (session.username === 'Sam' && session.isAdmin) {
          setIsAdmin(true)
          setUsername(session.username)
        }
      } catch (e) {
        localStorage.removeItem('mbx_admin_session')
      }
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    // Hardcoded credentials: Sam / CEO
    if (username === 'Sam' && password === 'CEO') {
      setIsAdmin(true)
      setUsername(username)
      localStorage.setItem('mbx_admin_session', JSON.stringify({ username, isAdmin: true }))
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    setUsername(null)
    localStorage.removeItem('mbx_admin_session')
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, username }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { User, AuthState, LoginCredentials, SignupData } from '@/domain/types'
import { authService } from '@/services'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      setState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      })
    })
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await authService.login(credentials)
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signup = async (data: SignupData) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await authService.signup(data)
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = async () => {
    await authService.logout()
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!state.user) throw new Error('Non connecté')
    const updated = await authService.updateProfile(state.user.id, data)
    setState((prev) => ({ ...prev, user: updated }))
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

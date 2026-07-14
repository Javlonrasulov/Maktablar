import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearSession,
  getSession,
  loginWithCredentials,
  updateAccountCredentials,
} from '@/services/schoolStore'
import type { AuthUser } from '@/services/types'

interface UpdateCredentialsInput {
  login: string
  currentPassword: string
  newPassword?: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  isSchool: boolean
  login: (login: string, password: string) => Promise<AuthUser>
  logout: () => void
  updateCredentials: (input: UpdateCredentialsInput) => Promise<AuthUser>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getSession())

  const login = useCallback(async (loginName: string, password: string) => {
    const next = await loginWithCredentials(loginName, password)
    setUser(next)
    return next
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const updateCredentials = useCallback(async (input: UpdateCredentialsInput) => {
    const session = getSession()
    if (!session) throw new Error('NOT_FOUND')
    const next = updateAccountCredentials(session.id, input)
    setUser(next)
    return next
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      isSchool: user?.role === 'school',
      login,
      logout,
      updateCredentials,
    }),
    [user, login, logout, updateCredentials],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

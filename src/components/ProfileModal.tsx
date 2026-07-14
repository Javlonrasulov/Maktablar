import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogOut, User } from 'lucide-react'
import { GlassButton, GlassInput, GlassModal } from '@/design-system'
import { useAuth } from '@/hooks/useAuth'

interface ProfileModalProps {
  open: boolean
  onClose: () => void
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout, updateCredentials } = useAuth()
  const [login, setLogin] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open || !user) return
    setLogin(user.login)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess('')
  }, [open, user])

  if (!user) return null

  const onLogout = () => {
    logout()
    onClose()
    navigate('/login', { replace: true })
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentPassword.trim()) {
      setError(t('profile.currentPasswordRequired'))
      return
    }
    if (newPassword && newPassword !== confirmPassword) {
      setError(t('profile.passwordMismatch'))
      return
    }
    if (newPassword && newPassword.trim().length < 4) {
      setError(t('profile.weakPassword'))
      return
    }

    setSaving(true)
    try {
      await updateCredentials({
        login,
        currentPassword,
        newPassword: newPassword.trim() ? newPassword : undefined,
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccess(t('profile.saved'))
    } catch (err) {
      const message = err instanceof Error ? err.message : ''
      if (message === 'INVALID_PASSWORD') setError(t('profile.wrongPassword'))
      else if (message === 'LOGIN_EXISTS') setError(t('profile.loginExists'))
      else if (message === 'WEAK_PASSWORD') setError(t('profile.weakPassword'))
      else setError(t('profile.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title={t('profile.title')}
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <GlassButton
            type="button"
            variant="danger"
            size="sm"
            className="w-full sm:w-auto"
            icon={<LogOut size={16} />}
            onClick={onLogout}
          >
            {t('auth.logout')}
          </GlassButton>
          <div className="flex w-full gap-2 sm:w-auto">
            <GlassButton type="button" variant="ghost" size="sm" className="flex-1 sm:flex-none" onClick={onClose}>
              {t('common.cancel')}
            </GlassButton>
            <GlassButton
              type="submit"
              form="profile-credentials-form"
              variant="primary"
              size="sm"
              className="flex-1 sm:flex-none"
              disabled={saving}
            >
              {saving ? t('common.loading') : t('common.save')}
            </GlassButton>
          </div>
        </div>
      }
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 ring-1 ring-accent/30">
          <User size={22} className="text-accent" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold text-text-primary">
            {user.displayName}
          </p>
          <p className="truncate text-xs text-text-muted">
            {user.role === 'admin' ? t('profile.roleAdmin') : t('profile.roleSchool')}
          </p>
        </div>
      </div>

      <form id="profile-credentials-form" className="space-y-3 pb-2" onSubmit={onSubmit}>
        <GlassInput
          label={t('auth.login')}
          value={login}
          autoComplete="username"
          onChange={(e) => setLogin(e.target.value)}
        />
        <GlassInput
          label={t('profile.currentPassword')}
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <GlassInput
          label={t('profile.newPassword')}
          type="password"
          autoComplete="new-password"
          placeholder={t('profile.newPasswordHint')}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <GlassInput
          label={t('profile.confirmPassword')}
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {success ? <p className="text-sm text-success">{success}</p> : null}
      </form>
    </GlassModal>
  )
}

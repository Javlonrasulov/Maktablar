import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { LogIn } from 'lucide-react'
import { GlassButton, GlassCard, GlassInput } from '@/design-system'
import { useAuth } from '@/hooks/useAuth'

const schema = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { login: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setError('')
    try {
      const user = await login(values.login.trim(), values.password.trim())
      if (user.role === 'school') navigate('/my-school', { replace: true })
      else navigate('/', { replace: true })
    } catch {
      setError(t('auth.invalid'))
    }
  })

  return (
    <div className="app-atmosphere flex min-h-svh items-center justify-center px-4 py-8">
      <GlassCard className="w-full max-w-md" hover={false}>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 font-display text-lg font-bold text-accent ring-1 ring-accent/30">
            NE
          </div>
          <h1 className="font-display text-2xl font-semibold">{t('auth.title')}</h1>
          <p className="mt-2 text-sm text-text-secondary">{t('auth.subtitle')}</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <GlassInput
            label={t('auth.login')}
            autoComplete="username"
            placeholder="admin / maktab1"
            {...register('login')}
          />
          <GlassInput
            label={t('auth.password')}
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <GlassButton
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting}
            icon={<LogIn size={18} />}
          >
            {t('auth.submit')}
          </GlassButton>
        </form>
      </GlassCard>
    </div>
  )
}

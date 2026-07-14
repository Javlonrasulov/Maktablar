import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { GlassButton, GlassInput, GlassModal } from '@/design-system'
import { createSchoolAccount } from '@/services/schoolStore'

const schema = z.object({
  name: z.string().min(2),
  login: z.string().min(3),
  password: z.string().min(4),
})

type FormValues = z.infer<typeof schema>

interface AddSchoolModalProps {
  open: boolean
  onClose: () => void
}

export function AddSchoolModal({ open, onClose }: AddSchoolModalProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', login: '', password: '' },
  })

  const onSubmit = handleSubmit((values) => {
    setError('')
    setSuccess('')
    try {
      const created = createSchoolAccount(values)
      void queryClient.invalidateQueries({ queryKey: ['schools'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setSuccess(
        t('schools.addSuccess', {
          name: created.name,
          login: created.login,
        }),
      )
      reset()
    } catch (e) {
      setError(e instanceof Error && e.message === 'LOGIN_EXISTS' ? t('schools.loginExists') : t('auth.invalid'))
    }
  })

  return (
    <GlassModal
      open={open}
      onClose={() => {
        setError('')
        setSuccess('')
        onClose()
      }}
      title={t('schools.addTitle')}
    >
      <p className="mb-4 text-sm text-text-secondary">{t('schools.addHint')}</p>
      <form className="space-y-3" onSubmit={onSubmit}>
        <GlassInput label={t('schools.schoolName')} {...register('name')} />
        <GlassInput label={t('auth.login')} {...register('login')} />
        <GlassInput label={t('auth.password')} type="password" {...register('password')} />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {success ? <p className="text-sm text-success">{success}</p> : null}
        <GlassButton type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          {t('schools.addSubmit')}
        </GlassButton>
      </form>
    </GlassModal>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Pencil, Trash2 } from 'lucide-react'
import { GlassButton, GlassCard, GlassInput, GlassSelect } from '@/design-system'
import { cn } from '@/lib/utils'
import {
  createSystemUser,
  deleteSystemUser,
  listSystemUsers,
  updateSystemUser,
  type SystemUserRecord,
} from '@/services/schoolStore'

const DEFAULT_ROLES = ['admin', 'director', 'operator'] as const

const PERMISSION_KEYS = [
  'dashboard',
  'schools',
  'teachers',
  'subjects',
  'workload',
  'map',
  'systemUsers',
] as const

type PermissionKey = (typeof PERMISSION_KEYS)[number]

const schema = z.object({
  fullName: z.string().min(2),
  login: z.string().min(3),
  password: z.string(),
  role: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

export function SystemUsersPage() {
  const { t } = useTranslation()
  const [users, setUsers] = useState<SystemUserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [customRoles, setCustomRoles] = useState<string[]>([])
  const [newRoleName, setNewRoleName] = useState('')
  const [permissions, setPermissions] = useState<PermissionKey[]>(['dashboard'])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      login: '',
      password: '',
      role: 'operator',
    },
  })

  const role = watch('role')

  const roleOptions = useMemo(
    () => [
      ...DEFAULT_ROLES.map((key) => ({
        value: key,
        label: t(`systemUsers.roles.${key}`),
      })),
      ...customRoles.map((name) => ({ value: name, label: name })),
    ],
    [customRoles, t],
  )

  const roleLabel = (value: string) => {
    if ((DEFAULT_ROLES as readonly string[]).includes(value)) {
      return t(`systemUsers.roles.${value}`)
    }
    return value
  }

  const refresh = async () => {
    setLoading(true)
    try {
      setUsers(await listSystemUsers())
      setFormError('')
    } catch {
      setFormError(t('systemUsers.serverUnavailable'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const togglePermission = (key: PermissionKey) => {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    )
  }

  const addCustomRole = () => {
    const name = newRoleName.trim()
    if (!name) return
    const exists =
      customRoles.some((r) => r.toLowerCase() === name.toLowerCase()) ||
      DEFAULT_ROLES.some((r) => t(`systemUsers.roles.${r}`).toLowerCase() === name.toLowerCase())
    if (exists) return
    setCustomRoles((prev) => [...prev, name])
    setValue('role', name)
    setNewRoleName('')
  }

  const clearForm = () => {
    reset({ fullName: '', login: '', password: '', role: 'operator' })
    setPermissions(['dashboard'])
    setEditingId(null)
    setFormError('')
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError('')
    setFormSuccess('')
    const password = values.password.trim()
    if (!editingId && password.length < 4) {
      setFormError(t('validation.required'))
      return
    }
    if (editingId && password && password.length < 4) {
      setFormError(t('validation.required'))
      return
    }
    try {
      if (editingId) {
        await updateSystemUser(editingId, {
          fullName: values.fullName,
          login: values.login,
          password: password || undefined,
          jobRole: values.role,
          permissions: [...permissions],
        })
        setFormSuccess(t('systemUsers.updated'))
      } else {
        await createSystemUser({
          fullName: values.fullName,
          login: values.login,
          password,
          jobRole: values.role,
          permissions: [...permissions],
        })
        setFormSuccess(t('systemUsers.created'))
      }
      await refresh()
      clearForm()
    } catch (err) {
      const code = err instanceof Error ? err.message : ''
      if (code === 'LOGIN_EXISTS') setFormError(t('systemUsers.loginExists'))
      else if (code === 'PROTECTED') setFormError(t('systemUsers.protectedUser'))
      else setFormError(t('systemUsers.serverUnavailable'))
    }
  })

  const startEdit = (user: SystemUserRecord) => {
    setEditingId(user.id)
    setFormError('')
    setFormSuccess('')
    setValue('fullName', user.fullName)
    setValue('login', user.login)
    setValue('password', '')
    setValue('role', user.jobRole)
    setPermissions(
      user.permissions.filter((p): p is PermissionKey =>
        (PERMISSION_KEYS as readonly string[]).includes(p),
      ),
    )
    if (
      !(DEFAULT_ROLES as readonly string[]).includes(user.jobRole) &&
      !customRoles.includes(user.jobRole)
    ) {
      setCustomRoles((prev) => [...prev, user.jobRole])
    }
  }

  const removeUser = async (id: string) => {
    setFormError('')
    try {
      await deleteSystemUser(id)
      await refresh()
      if (editingId === id) clearForm()
    } catch (err) {
      const code = err instanceof Error ? err.message : ''
      if (code === 'PROTECTED') setFormError(t('systemUsers.protectedUser'))
      else setFormError(t('systemUsers.serverUnavailable'))
    }
  }

  return (
    <div className="space-y-6 pb-4">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-semibold md:text-3xl">
          {t('systemUsers.title')}
        </h1>
        <p className="text-sm text-text-secondary">{t('systemUsers.subtitle')}</p>
      </header>

      <div className="grid gap-4 xl:grid-cols-2">
        <GlassCard hover={false}>
          <h2 className="mb-4 font-display text-base">
            {editingId ? t('systemUsers.editUser') : t('systemUsers.newUser')}
          </h2>

          <form className="space-y-4" onSubmit={onSubmit}>
            <GlassInput
              label={t('systemUsers.fullName')}
              placeholder={t('systemUsers.fullNamePlaceholder')}
              {...register('fullName')}
            />
            {errors.fullName ? (
              <p className="text-xs text-danger">{t('validation.required')}</p>
            ) : null}

            <GlassInput
              label={t('systemUsers.login')}
              placeholder={t('systemUsers.loginPlaceholder')}
              autoComplete="off"
              {...register('login')}
            />
            {errors.login ? (
              <p className="text-xs text-danger">{t('validation.required')}</p>
            ) : null}

            <GlassInput
              label={t('systemUsers.password')}
              type="password"
              placeholder={
                editingId
                  ? t('systemUsers.passwordKeepPlaceholder')
                  : t('systemUsers.passwordPlaceholder')
              }
              autoComplete="new-password"
              {...register('password')}
            />
            {errors.password ? (
              <p className="text-xs text-danger">{t('validation.required')}</p>
            ) : null}

            <GlassSelect
              label={t('systemUsers.role')}
              value={role}
              options={roleOptions}
              onChange={(value) => setValue('role', value, { shouldValidate: true })}
            />
            <p className="text-xs text-text-muted">{t('systemUsers.defaultRolesHint')}</p>

            <div className="space-y-2">
              <p className="text-sm text-text-secondary">{t('systemUsers.extraRoles')}</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <GlassInput
                  placeholder={t('systemUsers.newRolePlaceholder')}
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
                <GlassButton
                  type="button"
                  variant="primary"
                  className="shrink-0"
                  onClick={addCustomRole}
                >
                  {t('systemUsers.addRole')}
                </GlassButton>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-text-primary">
                {t('systemUsers.permissions')}
              </p>
              <div className="grid max-h-56 gap-2 overflow-y-auto rounded-[18px] border border-line bg-fill/60 p-3 sm:grid-cols-2">
                {PERMISSION_KEYS.map((key) => {
                  const checked = permissions.includes(key)
                  return (
                    <label
                      key={key}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 rounded-[14px] px-2 py-1.5 text-sm transition',
                        checked ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-fill',
                      )}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[var(--color-accent,#38bdf8)]"
                        checked={checked}
                        onChange={() => togglePermission(key)}
                      />
                      <span>{t(`systemUsers.permissionLabels.${key}`)}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {formError ? <p className="text-sm text-danger">{formError}</p> : null}
            {formSuccess ? <p className="text-sm text-emerald-600">{formSuccess}</p> : null}

            <div className="flex flex-wrap gap-2 pt-1">
              <GlassButton type="submit" variant="primary">
                {editingId ? t('common.save') : t('systemUsers.add')}
              </GlassButton>
              {editingId ? (
                <GlassButton type="button" variant="ghost" onClick={clearForm}>
                  {t('common.cancel')}
                </GlassButton>
              ) : null}
            </div>
          </form>
        </GlassCard>

        <GlassCard hover={false}>
          <h2 className="mb-4 font-display text-base">{t('systemUsers.usersList')}</h2>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-text-muted">{t('common.loading')}</p>
            ) : users.length === 0 ? (
              <p className="text-sm text-text-muted">{t('common.noResults')}</p>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-3 rounded-[18px] border border-line bg-fill/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="truncate font-medium text-text-primary">{user.fullName}</p>
                    <p className="truncate text-sm text-text-secondary">
                      {user.login} · {roleLabel(user.jobRole)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <GlassButton
                      type="button"
                      variant="glass"
                      size="sm"
                      icon={<Pencil size={14} />}
                      onClick={() => startEdit(user)}
                    >
                      {t('systemUsers.edit')}
                    </GlassButton>
                    <GlassButton
                      type="button"
                      variant="danger"
                      size="sm"
                      icon={<Trash2 size={14} />}
                      disabled={user.id === 'user-admin'}
                      onClick={() => void removeUser(user.id)}
                    >
                      {t('systemUsers.delete')}
                    </GlassButton>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

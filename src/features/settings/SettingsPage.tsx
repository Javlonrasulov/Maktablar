import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { GlassButton, GlassCard, GlassInput } from '@/design-system'

const schema = z.object({
  districtName: z.string().min(2),
  region: z.string().min(2),
  academicYear: z.string().min(4),
  accent: z.string().min(4),
})

type FormValues = z.infer<typeof schema>

export function SettingsPage() {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      districtName: t('settings.districtName'),
      region: t('settings.region'),
      academicYear: t('settings.year'),
      accent: '#38bdf8',
    },
  })

  const onSubmit = handleSubmit(() => {
    // mock save
  })

  return (
    <div className="space-y-6 pb-4">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-semibold md:text-3xl">{t('settings.title')}</h1>
        <p className="text-sm text-text-secondary">{t('settings.subtitle')}</p>
      </header>

      <div className="grid gap-4 xl:grid-cols-2">
        <GlassCard>
          <h2 className="mb-4 font-display text-base">{t('settings.district')}</h2>
          <form className="space-y-4" onSubmit={onSubmit}>
            <GlassInput label={t('settings.district')} {...register('districtName')} />
            {errors.districtName ? (
              <p className="text-xs text-danger">{t('validation.required')}</p>
            ) : null}
            <GlassInput label={t('settings.region')} {...register('region')} />
            <GlassInput label={t('settings.academicYear')} {...register('academicYear')} />
            <GlassInput label={t('settings.colors')} type="color" {...register('accent')} />
            <GlassButton type="submit" variant="primary">
              {t('common.save')}
            </GlassButton>
          </form>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-4 font-display text-base">{t('settings.logo')}</h2>
          <div className="flex h-32 items-center justify-center rounded-[18px] border border-dashed border-line bg-fill">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 font-display text-xl text-accent">
              NE
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <Section title={t('settings.subjects')} items={['Matematika', 'Ona tili', 'Ingliz tili', 'Fizika']} />
            <Section title={t('settings.users')} items={['district_admin', 'school_director', 'operator', 'admin']} />
            <Section title={t('settings.roles')} items={['Director', 'Operator', 'Admin']} />
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-sm text-text-muted">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-fill px-3 py-1 text-xs ring-1 ring-line">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

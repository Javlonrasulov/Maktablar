import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Check, CheckCircle2, Plus, Save, Trash2 } from 'lucide-react'
import {
  GlassButton,
  GlassCard,
  GlassInput,
  GlassSelect,
  PageSkeleton,
} from '@/design-system'
import { useAuth } from '@/hooks/useAuth'
import { cn, formatHours } from '@/lib/utils'
import {
  formatAssignmentLine,
  formatVacancyLabel,
  getTeachersForSchool,
  joinSubjectsList,
  parseClassesList,
  parseSubjectsList,
  parseVacancies,
  removeTeacher,
  saveTeacherForSchool,
  serializeClassesList,
  serializeVacancies,
  updateSchoolProfile,
  vacancyHoursTotal,
  VACANCY_OTHER,
  type VacancyItem,
} from '@/services/schoolStore'
import { fetchSchool, fetchSubjects } from '@/services/mockApi'
import { LocationPickerMap } from '@/features/map/LocationPickerMap'
import type { SchoolStatus, TeacherAssignment, TeacherStatus } from '@/services/types'

const profileSchema = z.object({
  director: z.string().min(2),
  phone: z.string().min(7),
  address: z.string().min(3),
  teachersCount: z.number().min(0),
  studentsCount: z.number().min(0),
  subjectsCount: z.number().min(0),
  weeklyHours: z.number().min(0),
  vacantHours: z.number().min(0),
  status: z.enum(['normal', 'shortage', 'overload', 'problem']),
  lat: z.number(),
  lng: z.number(),
  subjectsList: z.string().min(2),
  classesList: z.string().min(2),
  vacancies: z.string(),
  workloadsNote: z.string().optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

const teacherSchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().min(7),
  specialty: z.string().min(2),
  experienceYears: z.number().min(0),
  status: z.enum(['active', 'vacation', 'inactive']),
  assignments: z
    .array(
      z.object({
        id: z.string(),
        className: z.string().min(1),
        subject: z.string().min(1),
        hours: z.number().min(1),
      }),
    )
    .min(1),
})

type TeacherForm = z.infer<typeof teacherSchema>

function SubjectPicker({
  options,
  selected,
  onToggle,
  emptyLabel,
  selectedLabel,
}: {
  options: { id: string; name: string }[]
  selected: string[]
  onToggle: (name: string) => void
  emptyLabel: string
  selectedLabel?: string
}) {
  if (options.length === 0) {
    return <p className="text-sm text-text-muted">{emptyLabel}</p>
  }

  return (
    <div className="space-y-3">
      {selectedLabel ? (
        <p className="text-xs text-text-muted">
          {selectedLabel}: <span className="font-medium text-text-primary">{selected.length}</span>
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {options.map((subject) => {
          const checked = selected.includes(subject.name)
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => onToggle(subject.name)}
              aria-pressed={checked}
              className={cn(
                'inline-flex min-h-10 items-center gap-2 rounded-[14px] px-3.5 py-2 text-sm font-medium transition-all duration-200',
                'ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                checked
                  ? 'bg-accent text-white ring-accent shadow-[0_8px_20px_-12px_var(--theme-accent-glow)]'
                  : 'bg-transparent text-text-secondary ring-line hover:bg-fill hover:text-text-primary hover:ring-accent/30',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-[8px] transition',
                  checked ? 'bg-white/20' : 'bg-fill ring-1 ring-line',
                )}
              >
                {checked ? <Check size={13} strokeWidth={2.5} /> : null}
              </span>
              {subject.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function SchoolWorkspacePage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const schoolId = user?.schoolId ?? ''
  const queryClient = useQueryClient()
  const [savedMsg, setSavedMsg] = useState('')
  const [teachers, setTeachers] = useState(() => getTeachersForSchool(schoolId))
  const [vacSubject, setVacSubject] = useState('')
  const [vacNote, setVacNote] = useState('')
  const [vacHours, setVacHours] = useState(0)
  const [vacError, setVacError] = useState('')
  const [classDraft, setClassDraft] = useState('')
  const [classError, setClassError] = useState('')
  const [assignClass, setAssignClass] = useState('')
  const [assignSubject, setAssignSubject] = useState('')
  const [assignHours, setAssignHours] = useState(0)
  const [assignError, setAssignError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['school', schoolId],
    queryFn: () => fetchSchool(schoolId),
    enabled: Boolean(schoolId),
  })

  const { data: adminSubjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
  })

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      status: 'normal',
      weeklyHours: 0,
      workloadsNote: '',
    },
  })

  const teacherForm = useForm<TeacherForm>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      specialty: '',
      experienceYears: 0,
      assignments: [],
      status: 'active',
    },
  })

  const selectedSubjectsList = useWatch({ control: profileForm.control, name: 'subjectsList' }) ?? ''
  const selectedSubjectNames = useMemo(
    () => parseSubjectsList(selectedSubjectsList),
    [selectedSubjectsList],
  )
  const classesRaw = useWatch({ control: profileForm.control, name: 'classesList' }) ?? ''
  const schoolClasses = useMemo(() => parseClassesList(classesRaw), [classesRaw])
  const teacherAssignments =
    useWatch({ control: teacherForm.control, name: 'assignments' }) ?? []
  const vacanciesRaw = useWatch({ control: profileForm.control, name: 'vacancies' }) ?? ''
  const vacancyItems = useMemo(() => parseVacancies(vacanciesRaw), [vacanciesRaw])
  const mapLat = useWatch({ control: profileForm.control, name: 'lat' }) ?? 0
  const mapLng = useWatch({ control: profileForm.control, name: 'lng' }) ?? 0

  const vacancySubjectOptions = useMemo(
    () => [
      ...adminSubjects.map((s) => ({ value: s.name, label: s.name })),
      { value: VACANCY_OTHER, label: t('schoolWorkspace.vacancyOther') },
    ],
    [adminSubjects, t],
  )

  const classOptions = useMemo(
    () => schoolClasses.map((name) => ({ value: name, label: name })),
    [schoolClasses],
  )

  const subjectOptions = useMemo(
    () => adminSubjects.map((s) => ({ value: s.name, label: s.name })),
    [adminSubjects],
  )

  useEffect(() => {
    if (!data) return
    profileForm.reset({
      director: data.director,
      phone: data.phone,
      address: data.address,
      teachersCount: data.teachersCount,
      studentsCount: data.studentsCount,
      subjectsCount: data.subjectsCount,
      weeklyHours: data.weeklyHours,
      vacantHours: data.vacantHours,
      status: data.status || 'normal',
      lat: data.lat,
      lng: data.lng,
      subjectsList: data.subjectsList,
      classesList: data.classesList,
      vacancies: data.vacancies,
      workloadsNote: data.workloadsNote || '',
    })
    setTeachers(getTeachersForSchool(data.id))
  }, [data, profileForm])

  const saveMutation = useMutation({
    mutationFn: async (values: ProfileForm) =>
      updateSchoolProfile(schoolId, {
        ...values,
        status: values.status as SchoolStatus,
        workloadsNote: values.workloadsNote ?? '',
        weeklyHours: values.weeklyHours ?? 0,
        schedule: '',
      }),
    onSuccess: (school) => {
      void queryClient.invalidateQueries({ queryKey: ['school', schoolId] })
      void queryClient.invalidateQueries({ queryKey: ['schools'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setSavedMsg(
        school.profileComplete ? t('schoolWorkspace.complete') : t('schoolWorkspace.savedIncomplete'),
      )
    },
  })

  const missing = useMemo(() => {
    if (!data) return []
    const checks: { key: string; ok: boolean }[] = [
      { key: 'director', ok: Boolean(data.director) },
      { key: 'phone', ok: Boolean(data.phone) },
      { key: 'address', ok: Boolean(data.address) },
      { key: 'teachersCount', ok: data.teachersCount > 0 },
      { key: 'studentsCount', ok: data.studentsCount > 0 },
      { key: 'subjectsCount', ok: data.subjectsCount > 0 },
      { key: 'subjectsList', ok: Boolean(data.subjectsList) },
      { key: 'classesList', ok: Boolean(data.classesList) },
      { key: 'teachers', ok: teachers.length > 0 },
    ]
    return checks.filter((c) => !c.ok).map((c) => c.key)
  }, [data, teachers])

  if (isLoading || subjectsLoading || !data) return <PageSkeleton />

  const toggleSchoolSubject = (name: string) => {
    const next = selectedSubjectNames.includes(name)
      ? selectedSubjectNames.filter((s) => s !== name)
      : [...selectedSubjectNames, name]
    profileForm.setValue('subjectsList', joinSubjectsList(next), { shouldValidate: true })
    profileForm.setValue('subjectsCount', next.length, { shouldValidate: true })
  }

  const setSchoolClasses = (names: string[]) => {
    profileForm.setValue('classesList', serializeClassesList(names), { shouldValidate: true, shouldDirty: true })
  }

  const addSchoolClass = () => {
    setClassError('')
    const name = classDraft.trim()
    if (!name) {
      setClassError(t('schoolWorkspace.classRequired'))
      return
    }
    if (schoolClasses.some((c) => c.toLowerCase() === name.toLowerCase())) {
      setClassError(t('schoolWorkspace.classExists'))
      return
    }
    setSchoolClasses([...schoolClasses, name])
    setClassDraft('')
  }

  const removeSchoolClass = (name: string) => {
    setSchoolClasses(schoolClasses.filter((c) => c !== name))
  }

  const setAssignments = (items: TeacherAssignment[]) => {
    teacherForm.setValue('assignments', items, { shouldValidate: true })
  }

  const addAssignment = () => {
    setAssignError('')
    if (!assignClass) {
      setAssignError(t('schoolWorkspace.assignClassRequired'))
      return
    }
    if (!assignSubject) {
      setAssignError(t('schoolWorkspace.assignSubjectRequired'))
      return
    }
    if (!Number.isFinite(assignHours) || assignHours <= 0) {
      setAssignError(t('schoolWorkspace.assignHoursRequired'))
      return
    }
    const duplicate = teacherAssignments.some(
      (a) => a.className === assignClass && a.subject === assignSubject,
    )
    if (duplicate) {
      setAssignError(t('schoolWorkspace.assignDuplicate'))
      return
    }
    setAssignments([
      ...teacherAssignments,
      {
        id: `asg-${Date.now()}`,
        className: assignClass,
        subject: assignSubject,
        hours: assignHours,
      },
    ])
    setAssignHours(0)
  }

  const removeAssignment = (id: string) => {
    setAssignments(teacherAssignments.filter((a) => a.id !== id))
  }

  const setVacancies = (items: VacancyItem[]) => {
    profileForm.setValue('vacancies', serializeVacancies(items), { shouldDirty: true })
    profileForm.setValue('vacantHours', vacancyHoursTotal(items), { shouldValidate: true })
  }

  const addVacancy = () => {
    setVacError('')
    if (!vacSubject) {
      setVacError(t('schoolWorkspace.vacancySelectSubject'))
      return
    }
    if (vacSubject === VACANCY_OTHER && !vacNote.trim()) {
      setVacError(t('schoolWorkspace.vacancyOtherRequired'))
      return
    }
    if (!Number.isFinite(vacHours) || vacHours <= 0) {
      setVacError(t('schoolWorkspace.vacancyHoursRequired'))
      return
    }
    const next: VacancyItem = {
      id: `vac-${Date.now()}`,
      subject: vacSubject,
      note: vacSubject === VACANCY_OTHER ? vacNote.trim() : '',
      hours: vacHours,
    }
    setVacancies([...vacancyItems, next])
    setVacSubject('')
    setVacNote('')
    setVacHours(0)
  }

  const removeVacancy = (id: string) => {
    setVacancies(vacancyItems.filter((item) => item.id !== id))
  }

  const onSaveProfile = profileForm.handleSubmit((values) => {
    setSavedMsg('')
    const vacancies = parseVacancies(values.vacancies)
    const teacherHours = teachers.reduce((sum, teacher) => sum + teacher.weeklyHours, 0)
    saveMutation.mutate({
      ...values,
      subjectsCount: parseSubjectsList(values.subjectsList).length,
      vacantHours: vacancyHoursTotal(vacancies),
      vacancies: serializeVacancies(vacancies),
      classesList: serializeClassesList(parseClassesList(values.classesList)),
      weeklyHours: teacherHours,
      teachersCount: teachers.length || values.teachersCount,
      workloadsNote: values.workloadsNote ?? '',
    })
  })

  const onAddTeacher = teacherForm.handleSubmit((values) => {
    saveTeacherForSchool({
      fullName: values.fullName,
      phone: values.phone,
      specialty: values.specialty,
      category: '',
      experienceYears: values.experienceYears,
      status: values.status as TeacherStatus,
      assignments: values.assignments,
      subjects: [],
      classes: [],
      weeklyHours: 0,
      schoolId: data.id,
      schoolName: data.name,
      schools: [data.name],
    })
    const next = getTeachersForSchool(data.id)
    setTeachers(next)
    profileForm.setValue('teachersCount', next.length)
    profileForm.setValue(
      'weeklyHours',
      next.reduce((sum, teacher) => sum + teacher.weeklyHours, 0),
    )
    teacherForm.reset({
      fullName: '',
      phone: '',
      specialty: '',
      experienceYears: 0,
      assignments: [],
      status: 'active',
    })
    setAssignClass('')
    setAssignSubject('')
    setAssignHours(0)
    setAssignError('')
    void queryClient.invalidateQueries({ queryKey: ['teachers'] })
    void queryClient.invalidateQueries({ queryKey: ['school-teachers', data.id] })
  })

  return (
    <div className="space-y-6 pb-4">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-semibold md:text-3xl">{t('schoolWorkspace.title')}</h1>
        <p className="text-sm text-text-secondary">{t('schoolWorkspace.subtitle', { school: data.name })}</p>
      </header>

      <GlassCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg font-semibold">{data.name}</p>
            <p className="text-sm text-text-secondary">
              {t('auth.login')}: {data.login}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ring-1 ${
              data.profileComplete
                ? 'bg-success/10 text-success ring-success/20'
                : 'bg-warning/10 text-warning ring-warning/20'
            }`}
          >
            <CheckCircle2 size={14} />
            {data.profileComplete ? t('schoolWorkspace.statusComplete') : t('schoolWorkspace.statusIncomplete')}
          </span>
        </div>
        {missing.length > 0 ? (
          <p className="mt-3 text-sm text-warning">
            {t('schoolWorkspace.missing')}: {missing.map((k) => t(`schoolWorkspace.fields.${k}`)).join(', ')}
          </p>
        ) : null}
      </GlassCard>

      <form className="space-y-4" onSubmit={onSaveProfile}>
        <GlassCard>
          <h2 className="mb-4 font-display text-base">{t('schoolWorkspace.general')}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <GlassInput label={t('common.director')} {...profileForm.register('director')} />
            <GlassInput label={t('common.phone')} {...profileForm.register('phone')} />
            <GlassInput label={t('schoolWorkspace.fields.address')} {...profileForm.register('address')} />
            <Controller
              control={profileForm.control}
              name="status"
              render={({ field }) => (
                <GlassSelect
                  label={t('common.status')}
                  value={field.value}
                  onChange={field.onChange}
                  options={(['normal', 'shortage', 'overload', 'problem'] as const).map((s) => ({
                    value: s,
                    label: t(`status.${s}`),
                  }))}
                />
              )}
            />
            <GlassInput
              label={t('common.teachers')}
              type="number"
              {...profileForm.register('teachersCount', { valueAsNumber: true })}
            />
            <GlassInput
              label={t('common.students')}
              type="number"
              {...profileForm.register('studentsCount', { valueAsNumber: true })}
            />
            <GlassInput
              label={t('common.subjects')}
              type="number"
              readOnly
              value={selectedSubjectNames.length}
            />
            <GlassInput
              label={t('common.vacancy')}
              type="number"
              readOnly
              value={vacancyHoursTotal(vacancyItems)}
            />
          </div>
        </GlassCard>

        <LocationPickerMap
          title={t('schoolWorkspace.location')}
          lat={mapLat}
          lng={mapLng}
          height={480}
          onChange={(nextLat, nextLng) => {
            profileForm.setValue('lat', Number(nextLat.toFixed(6)), {
              shouldValidate: true,
              shouldDirty: true,
            })
            profileForm.setValue('lng', Number(nextLng.toFixed(6)), {
              shouldValidate: true,
              shouldDirty: true,
            })
          }}
        />

        <GlassCard>
          <h2 className="mb-2 font-display text-base">{t('schools.sections.subjects')}</h2>
          <p className="mb-4 text-sm text-text-muted">{t('schoolWorkspace.subjectsFromAdmin')}</p>
          <SubjectPicker
            options={adminSubjects}
            selected={selectedSubjectNames}
            onToggle={toggleSchoolSubject}
            emptyLabel={t('schoolWorkspace.noAdminSubjects')}
            selectedLabel={t('schoolWorkspace.selectedCount')}
          />
          {profileForm.formState.errors.subjectsList ? (
            <p className="mt-2 text-sm text-danger">{t('schoolWorkspace.selectSubjects')}</p>
          ) : null}
        </GlassCard>

        <GlassCard>
          <h2 className="mb-2 font-display text-base">{t('schools.sections.classes')}</h2>
          <p className="mb-4 text-sm text-text-muted">{t('schoolWorkspace.classesHint')}</p>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <GlassInput
                label={t('schoolWorkspace.className')}
                placeholder={t('schoolWorkspace.classPlaceholder')}
                value={classDraft}
                onChange={(e) => setClassDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSchoolClass()
                  }
                }}
              />
            </div>
            <GlassButton
              type="button"
              className="w-full shrink-0 sm:w-auto"
              icon={<Plus size={16} />}
              onClick={addSchoolClass}
            >
              {t('schoolWorkspace.addClass')}
            </GlassButton>
          </div>
          {classError ? <p className="mb-3 text-sm text-danger">{classError}</p> : null}
          {profileForm.formState.errors.classesList ? (
            <p className="mb-3 text-sm text-danger">{t('schoolWorkspace.classListRequired')}</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {schoolClasses.length === 0 ? (
              <p className="text-sm text-text-muted">{t('schoolWorkspace.noClasses')}</p>
            ) : (
              schoolClasses.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-2 rounded-[14px] bg-fill px-3 py-2 text-sm ring-1 ring-line"
                >
                  {name}
                  <button
                    type="button"
                    className="text-text-muted transition hover:text-danger"
                    onClick={() => removeSchoolClass(name)}
                    aria-label={t('common.delete')}
                  >
                    <Trash2 size={14} />
                  </button>
                </span>
              ))
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-2 font-display text-base">{t('schools.sections.vacancies')}</h2>
          <p className="mb-4 text-sm text-text-muted">{t('schoolWorkspace.vacancyHint')}</p>
          <div className="mb-4 grid gap-3 md:grid-cols-2">
            <GlassSelect
              label={t('schoolWorkspace.vacancySubject')}
              value={vacSubject}
              onChange={setVacSubject}
              placeholder={t('schoolWorkspace.vacancySelectSubject')}
              options={vacancySubjectOptions}
            />
            <GlassInput
              label={t('schoolWorkspace.vacancyHours')}
              type="number"
              min={0}
              value={vacHours}
              onChange={(e) => setVacHours(Number(e.target.value))}
            />
            {vacSubject === VACANCY_OTHER ? (
              <div className="md:col-span-2">
                <GlassInput
                  label={t('schoolWorkspace.vacancyNote')}
                  placeholder={t('schoolWorkspace.vacancyNotePlaceholder')}
                  value={vacNote}
                  onChange={(e) => setVacNote(e.target.value)}
                />
              </div>
            ) : null}
            <div className="flex items-end">
              <GlassButton type="button" icon={<Plus size={16} />} onClick={addVacancy}>
                {t('schoolWorkspace.addVacancy')}
              </GlassButton>
            </div>
          </div>
          {vacError ? <p className="mb-3 text-sm text-danger">{vacError}</p> : null}
          <ul className="space-y-2">
            {vacancyItems.length === 0 ? (
              <li className="text-sm text-text-muted">{t('schoolWorkspace.noVacancies')}</li>
            ) : (
              vacancyItems.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-[16px] bg-fill px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {formatVacancyLabel(item, t('schoolWorkspace.vacancyOther'))}
                    </p>
                    <p className="text-xs text-text-muted">
                      {formatHours(item.hours, t('common.hours'))}
                      {item.subject === VACANCY_OTHER
                        ? ` · ${t('schoolWorkspace.vacancyOther')}`
                        : ''}
                    </p>
                  </div>
                  <GlassButton
                    type="button"
                    size="sm"
                    variant="ghost"
                    icon={<Trash2 size={14} />}
                    onClick={() => removeVacancy(item.id)}
                  />
                </li>
              ))
            )}
          </ul>
        </GlassCard>

        <div className="flex flex-wrap items-center gap-3">
          <GlassButton type="submit" variant="primary" icon={<Save size={16} />} disabled={saveMutation.isPending}>
            {t('common.save')}
          </GlassButton>
          {savedMsg ? <p className="text-sm text-accent">{savedMsg}</p> : null}
        </div>
      </form>

      <GlassCard>
        <h2 className="mb-2 font-display text-base">{t('schools.sections.teachers')}</h2>
        <p className="mb-4 text-sm text-text-muted">{t('schoolWorkspace.teacherAssignHint')}</p>
        <form className="mb-4 grid gap-3 md:grid-cols-2" onSubmit={onAddTeacher}>
          <GlassInput label={t('teachers.profile')} {...teacherForm.register('fullName')} />
          <GlassInput label={t('common.phone')} {...teacherForm.register('phone')} />
          <GlassInput label={t('teachers.specialty')} {...teacherForm.register('specialty')} />
          <GlassInput
            label={t('teachers.experience')}
            type="number"
            {...teacherForm.register('experienceYears', { valueAsNumber: true })}
          />
          <Controller
            control={teacherForm.control}
            name="status"
            render={({ field }) => (
              <GlassSelect
                label={t('common.status')}
                value={field.value}
                onChange={field.onChange}
                options={(['active', 'vacation', 'inactive'] as const).map((s) => ({
                  value: s,
                  label: t(`status.${s}`),
                }))}
              />
            )}
          />

          <div className="md:col-span-2 space-y-3 rounded-[18px] border border-line bg-fill/40 p-3">
            <p className="text-sm font-medium text-text-primary">{t('schoolWorkspace.assignments')}</p>
            <div className="grid gap-3 md:grid-cols-3">
              <GlassSelect
                label={t('schoolWorkspace.assignClass')}
                value={assignClass}
                onChange={setAssignClass}
                placeholder={t('schoolWorkspace.assignClassRequired')}
                options={classOptions}
                disabled={classOptions.length === 0}
              />
              <GlassSelect
                label={t('schoolWorkspace.assignSubject')}
                value={assignSubject}
                onChange={setAssignSubject}
                placeholder={t('schoolWorkspace.assignSubjectRequired')}
                options={subjectOptions}
                disabled={subjectOptions.length === 0}
              />
              <GlassInput
                label={t('schoolWorkspace.assignHours')}
                type="number"
                min={0}
                value={assignHours}
                onChange={(e) => setAssignHours(Number(e.target.value))}
              />
            </div>
            <GlassButton type="button" icon={<Plus size={16} />} onClick={addAssignment}>
              {t('schoolWorkspace.addAssignment')}
            </GlassButton>
            {assignError ? <p className="text-sm text-danger">{assignError}</p> : null}
            {teacherForm.formState.errors.assignments ? (
              <p className="text-sm text-danger">{t('schoolWorkspace.assignmentsRequired')}</p>
            ) : null}
            <ul className="space-y-2">
              {teacherAssignments.length === 0 ? (
                <li className="text-sm text-text-muted">{t('schoolWorkspace.noAssignments')}</li>
              ) : (
                teacherAssignments.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] bg-fill px-3 py-2 text-sm"
                  >
                    <span>{formatAssignmentLine(item, t('common.hours'))}</span>
                    <GlassButton
                      type="button"
                      size="sm"
                      variant="ghost"
                      icon={<Trash2 size={14} />}
                      onClick={() => removeAssignment(item.id)}
                    />
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="flex items-end">
            <GlassButton type="submit" icon={<Plus size={16} />}>
              {t('schoolWorkspace.addTeacher')}
            </GlassButton>
          </div>
        </form>

        <ul className="space-y-2">
          {teachers.length === 0 ? (
            <li className="text-sm text-text-muted">{t('schoolWorkspace.noTeachers')}</li>
          ) : (
            teachers.map((teacher) => (
              <li
                key={teacher.id}
                className="rounded-[16px] bg-fill px-3 py-3 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{teacher.fullName}</p>
                    <p className="text-xs text-text-muted">
                      {teacher.specialty} · {formatHours(teacher.weeklyHours, t('common.hours'))}
                    </p>
                  </div>
                  <GlassButton
                    size="sm"
                    variant="ghost"
                    icon={<Trash2 size={14} />}
                    onClick={() => {
                      removeTeacher(teacher.id)
                      const next = getTeachersForSchool(data.id)
                      setTeachers(next)
                      profileForm.setValue('teachersCount', next.length)
                      profileForm.setValue(
                        'weeklyHours',
                        next.reduce((sum, row) => sum + row.weeklyHours, 0),
                      )
                    }}
                  />
                </div>
                {teacher.assignments?.length ? (
                  <ul className="mt-2 space-y-1 border-t border-line pt-2">
                    {teacher.assignments.map((item) => (
                      <li key={item.id} className="text-xs text-text-secondary">
                        {formatAssignmentLine(item, t('common.hours'))}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))
          )}
        </ul>
      </GlassCard>
    </div>
  )
}

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import { GlassButton, GlassCard, PageSkeleton } from '@/design-system'
import { formatHours } from '@/lib/utils'
import { fetchSchools, fetchSubjects, fetchTeachers } from '@/services/mockApi'

export function ReportsPage() {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')

  const schoolsQ = useQuery({ queryKey: ['schools'], queryFn: fetchSchools })
  const teachersQ = useQuery({ queryKey: ['teachers'], queryFn: fetchTeachers })
  const subjectsQ = useQuery({ queryKey: ['subjects'], queryFn: fetchSubjects })

  if (schoolsQ.isLoading || teachersQ.isLoading || subjectsQ.isLoading) return <PageSkeleton />

  const schools = schoolsQ.data ?? []
  const teachers = teachersQ.data ?? []
  const subjects = subjectsQ.data ?? []

  const exportExcel = (type: 'schools' | 'teachers' | 'subjects') => {
    const rows =
      type === 'schools'
        ? schools.map((s) => ({
            Name: s.name,
            Director: s.director,
            Phone: s.phone,
            Teachers: s.teachersCount,
            Students: s.studentsCount,
            Hours: s.weeklyHours,
            Status: s.status,
          }))
        : type === 'teachers'
          ? teachers.map((teacher) => ({
              Name: teacher.fullName,
              Phone: teacher.phone,
              Specialty: teacher.specialty,
              School: teacher.schoolName,
              Hours: teacher.weeklyHours,
              Status: teacher.status,
            }))
          : subjects.map((s) => ({
              Name: s.name,
              Teachers: s.teachersCount,
              Hours: s.totalHours,
              Vacancy: s.vacantHours,
              Overload: s.overloadHours,
            }))

    const sheet = XLSX.utils.json_to_sheet(rows)
    const book = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(book, sheet, type)
    XLSX.writeFile(book, `navbahor-${type}.xlsx`)
    setMessage(t('reports.exported'))
  }

  const exportPdf = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Navbahor Education Report', 14, 20)
    doc.setFontSize(11)
    let y = 32
    schools.slice(0, 20).forEach((s) => {
      doc.text(`${s.name} | ${s.director} | ${formatHours(s.weeklyHours, t('common.hours'))} | ${s.status}`, 14, y)
      y += 8
      if (y > 280) {
        doc.addPage()
        y = 20
      }
    })
    doc.save('navbahor-schools.pdf')
    setMessage(t('reports.exported'))
  }

  const printReport = () => {
    window.print()
  }

  return (
    <div className="space-y-6 pb-4 print:text-black">
      <header className="space-y-2 print:hidden">
        <h1 className="font-display text-2xl font-semibold md:text-3xl">{t('reports.title')}</h1>
        <p className="text-sm text-text-secondary">{t('reports.subtitle')}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3 print:hidden">
        <ReportCard
          title={t('reports.schoolsReport')}
          onExcel={() => exportExcel('schools')}
          onPdf={exportPdf}
          onPrint={printReport}
        />
        <ReportCard
          title={t('reports.teachersReport')}
          onExcel={() => exportExcel('teachers')}
          onPdf={exportPdf}
          onPrint={printReport}
        />
        <ReportCard
          title={t('reports.subjectsReport')}
          onExcel={() => exportExcel('subjects')}
          onPdf={exportPdf}
          onPrint={printReport}
        />
      </div>

      {message ? <p className="text-sm text-accent print:hidden">{message}</p> : null}

      <GlassCard className="print:shadow-none print:border print:border-black">
        <h2 className="mb-3 font-display text-base">{t('reports.schoolsReport')}</h2>
        <div className="space-y-2 text-sm">
          {schools.map((s) => (
            <div key={s.id} className="flex flex-wrap justify-between gap-2 border-b border-line py-2 print:border-black/20">
              <span>{s.name}</span>
              <span>
                {s.teachersCount} / {s.studentsCount} / {formatHours(s.weeklyHours, t('common.hours'))}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

function ReportCard({
  title,
  onExcel,
  onPdf,
  onPrint,
}: {
  title: string
  onExcel: () => void
  onPdf: () => void
  onPrint: () => void
}) {
  const { t } = useTranslation()
  return (
    <GlassCard>
      <h2 className="mb-4 font-display text-base">{title}</h2>
      <div className="flex flex-wrap gap-2">
        <GlassButton size="sm" variant="primary" onClick={onExcel}>
          {t('common.excel')}
        </GlassButton>
        <GlassButton size="sm" onClick={onPdf}>
          {t('common.pdf')}
        </GlassButton>
        <GlassButton size="sm" onClick={onPrint}>
          {t('common.print')}
        </GlassButton>
      </div>
    </GlassCard>
  )
}

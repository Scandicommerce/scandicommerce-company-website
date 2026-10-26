'use client'

import React, { useState, useMemo } from 'react'
import { FiClock, FiCheck, FiLoader } from 'react-icons/fi'
import { ui } from '@/components/integrations/labels'

const L = {
  no: { selectDate: 'Velg dato', days: ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'], times: 'Ledige tider (CET)', loadingTimes: 'Henter ledige tider …', noTimes: 'Ingen ledige tider denne dagen', meetingType: 'Type møte', name: 'Navn', email: 'E-post', firstName: 'Fornavn', lastName: 'Etternavn', company: 'Selskap', interest: 'Hva gjelder det?', select: 'Velg et tema', message: 'Melding', msgPlaceholder: 'Fortell oss kort om butikken og hva du trenger …', sending: 'Sender …', sent: 'Meldingen er sendt. Vi svarer så fort vi kan.', sendFail: 'Kunne ikke sende meldingen. Prøv igjen.', needEmail: 'Skriv inn e-post og melding.', booking: 'Oppretter booking …', booked: 'Booking bekreftet. Kalenderinvitasjon er sendt til e-posten din.', needAll: 'Fyll inn alle feltene.', bookFail: 'Kunne ikke opprette booking', openTab: 'Åpne i ny fane', or: 'Eller', options: [['shopify-development', 'Ny nettbutikk eller utvikling'], ['migration', 'Migrering til Shopify'], ['b2b', 'B2B og ordreportal'], ['shopify-pos', 'Nexus POS / kasse'], ['integrations', 'Integrasjoner'], ['packages', 'Pakker og drift'], ['other', 'Annet']], locale: 'nb-NO' },
  en: { selectDate: 'Select date', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], times: 'Available times (CET)', loadingTimes: 'Loading available times …', noTimes: 'No available times for this date', meetingType: 'Meeting type', name: 'Name', email: 'Email', firstName: 'First name', lastName: 'Last name', company: 'Company', interest: 'What is it about?', select: 'Select a topic', message: 'Message', msgPlaceholder: 'Tell us briefly about your store and what you need …', sending: 'Sending …', sent: 'Message sent. We will get back to you shortly.', sendFail: 'Failed to send the message. Please try again.', needEmail: 'Please enter your email and message.', booking: 'Creating booking …', booked: 'Booking confirmed. A calendar invite has been sent to your email.', needAll: 'Please fill in all required fields.', bookFail: 'Failed to create booking', openTab: 'Open in a new tab', or: 'Or', options: [['shopify-development', 'New store or development'], ['migration', 'Migration to Shopify'], ['b2b', 'B2B and order portal'], ['shopify-pos', 'Nexus POS'], ['integrations', 'Integrations'], ['packages', 'Packages and operations'], ['other', 'Other']], locale: 'en-GB' },
} as const

type Labels = (typeof L)['no'] | (typeof L)['en']

const INPUT = 'w-full rounded-lg border border-sc-ink-200 bg-white px-3.5 py-2.5 text-[15px] text-sc-ink-900 outline-none transition-colors placeholder:text-sc-ink-400 focus:border-sc-cyan-500 focus:ring-2 focus:ring-sc-cyan-500/20'
const LABEL = 'mb-1.5 block text-[13px] font-semibold text-sc-ink-700'

interface MeetingTypeData {
  title?: string
  description?: string
  durationMinutes?: number
}

interface DateSlot {
  date?: string
  times?: string[]
}

interface BookingSectionData {
  enabled?: boolean
  useCalendly?: boolean
  calendlySchedulingUrl?: string | null
  label?: string
  title?: string
  description?: string
  meetingTypes?: MeetingTypeData[]
  availableSlots?: DateSlot[]
  confirmButtonText?: string
}

interface MessageSectionData {
  label?: string
  title?: string
  description?: string
  submitButtonText?: string
}

interface BenefitData {
  icon?: string
  text?: string
}

interface BookingSectionProps {
  /** Page language from the server; drives the labels. */
  lang?: string
  bookingSection?: BookingSectionData
  messageSection?: MessageSectionData
  benefits?: BenefitData[]
}

// Defaults
const defaultMeetingTypes: MeetingTypeData[] = [
  { title: '30-Minute Discovery Call', description: 'Learn about our services' },
  { title: '60-Minute Strategy Session', description: 'Deep dive into your needs' },
]

const defaultBenefits: BenefitData[] = [
  { icon: 'check', text: 'No commitment required' },
  { icon: 'clock', text: 'Instant confirmation' },
]

interface CalendarProps {
  t: Labels
  selectedDate: string | null
  onDateSelect: (date: string) => void
  /** When set, only these dates (YYYY-MM-DD) are selectable. When null/empty, any future date is selectable. */
  allowedDates?: Set<string> | null
}

function Calendar({ t, selectedDate, onDateSelect, allowedDates }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const monthName = currentMonth.toLocaleString(t.locale, { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const days = t.days

  const formatDate = (day: number): string => {
    const y = currentMonth.getFullYear()
    const m = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const isSelected = (day: number): boolean => {
    if (!selectedDate) return false
    return formatDate(day) === selectedDate
  }

  const isPast = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isAllowed = (day: number): boolean => {
    const dateStr = formatDate(day)
    if (!allowedDates || allowedDates.size === 0) return true
    return allowedDates.has(dateStr)
  }

  const handleDateClick = (day: number) => {
    if (isPast(day)) return
    if (!isAllowed(day)) return
    onDateSelect(formatDate(day))
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const renderDays = () => {
    const cells = []

    for (let i = 0; i < adjustedFirstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-10" />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isDaySelected = isSelected(day)
      const isDayPast = isPast(day)
      const dayAllowed = isAllowed(day)
      const isWeekend = (adjustedFirstDay + day - 1) % 7 >= 5
      const disabled = isDayPast || !dayAllowed

      cells.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={disabled}
          className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${isDaySelected ? 'bg-sc-ink-900 text-white' : disabled ? 'cursor-not-allowed text-sc-ink-300' : isWeekend ? 'text-sc-ink-400 hover:bg-sc-ink-50' : 'text-sc-ink-900 hover:bg-sc-ink-50'}`}
        >
          {day}
        </button>
      )
    }

    return cells
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[13px] font-semibold text-sc-ink-700">{t.selectDate}</h4>
        <div className="flex items-center gap-2">
          <button type="button" onClick={goToPreviousMonth} aria-label="Forrige måned" className="flex h-8 w-8 items-center justify-center rounded-full border border-sc-ink-200 text-sc-ink-700 hover:border-sc-ink-900">
            &lsaquo;
          </button>
          <span className="min-w-[120px] text-center font-mono text-[13px] text-sc-ink-700">{monthName}</span>
          <button type="button" onClick={goToNextMonth} aria-label="Neste måned" className="flex h-8 w-8 items-center justify-center rounded-full border border-sc-ink-200 text-sc-ink-700 hover:border-sc-ink-900">
            &rsaquo;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day) => (
          <div key={day} className="flex h-8 items-center justify-center text-xs font-medium text-sc-ink-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  )
}

interface MeetingTypeProps {
  title: string
  description: string
  selected: boolean
  onSelect: () => void
}

function MeetingType({ title, description, selected, onSelect }: MeetingTypeProps) {
  return (
    <button
      onClick={onSelect}
      type="button"
      aria-pressed={selected}
      className={`w-full rounded-lg border p-4 text-left transition-colors ${selected ? 'border-sc-ink-900 bg-sc-ink-900 text-white' : 'border-sc-ink-200 bg-white text-sc-ink-900 hover:border-sc-ink-900'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="m-0 text-[15px] font-semibold">{title}</p>
          <p className={`m-0 mt-0.5 text-[13px] ${selected ? 'text-sc-ink-200' : 'text-sc-ink-500'}`}>{description}</p>
        </div>
        <FiClock className={selected ? 'text-sc-cyan-300' : 'text-sc-ink-400'} size={16} />
      </div>
    </button>
  )
}

interface TimeSlotsProps {
  t: Labels
  slots: string[]
  selectedTime: string | null
  onTimeSelect: (time: string) => void
  loading?: boolean
}

function TimeSlots({ t, slots, selectedTime, onTimeSelect, loading }: TimeSlotsProps) {
  if (loading) {
    return (
      <div>
        <h4 className="mb-3 text-[13px] font-semibold text-sc-ink-700">{t.times}</h4>
        <div className="flex items-center justify-center py-4">
          <FiLoader className="animate-spin text-sc-cyan-500" size={20} />
          <span className="ml-2 text-sm text-sc-ink-500">{t.loadingTimes}</span>
        </div>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div>
        <h4 className="mb-3 text-[13px] font-semibold text-sc-ink-700">{t.times}</h4>
        <p className="m-0 text-[13px] text-sc-ink-500">{t.noTimes}</p>
      </div>
    )
  }

  return (
    <div>
      <h4 className="mb-3 text-[13px] font-semibold text-sc-ink-700">{t.times}</h4>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {slots.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => onTimeSelect(time)}
            aria-pressed={selectedTime === time}
            className={`rounded-lg border px-3 py-2 font-mono text-[13px] transition-colors ${selectedTime === time ? 'border-sc-ink-900 bg-sc-ink-900 text-white' : 'border-sc-ink-200 bg-white text-sc-ink-900 hover:border-sc-ink-900'}`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  )
}

interface ContactFormProps {
  t: Labels
  submitButtonText?: string
}

function ContactForm({ t, submitButtonText }: ContactFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [interest, setInterest] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!email.trim() || !message.trim()) {
      setError(t.needEmail)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          email: email.trim(),
          company: company.trim() || undefined,
          interest: interest || undefined,
          message: message.trim()
        })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || t.sendFail)
        return
      }

      setSuccess(true)
      setFirstName('')
      setLastName('')
      setEmail('')
      setCompany('')
      setInterest('')
      setMessage('')
      setTimeout(() => setSuccess(false), 5000)
    } catch {
      setError(t.sendFail)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form id="melding" className="scroll-mt-28" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL}>{t.firstName}</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>{t.lastName}</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" className={INPUT} />
          </div>
        </div>
        <div>
          <label className={LABEL}>{t.email} *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>{t.company}</label>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>{t.interest}</label>
          <select value={interest} onChange={(e) => setInterest(e.target.value)} className={`${INPUT} ${interest ? '' : 'text-sc-ink-400'}`}>
            <option value="">{t.select}</option>
            {t.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL}>{t.message} *</label>
          <textarea placeholder={t.msgPlaceholder} rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required className={`${INPUT} resize-none`} />
        </div>
        {error && <p className="m-0 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {success && <p className="m-0 rounded-lg border border-sc-cyan-200 bg-sc-cyan-50 p-3 text-sm text-sc-cyan-700">{t.sent}</p>}
        <button type="submit" disabled={loading} className={`${ui.btnPrimary} w-full disabled:cursor-wait disabled:opacity-70`}>
          {loading ? t.sending : submitButtonText || t.message}
        </button>
      </div>
    </form>
  )
}

const getBenefitIcon = (iconName?: string) => {
  switch (iconName) {
    case 'clock':
      return <FiClock className="text-sc-ink-900" size={14} />
    default:
      return <FiCheck className="text-sc-ink-900" size={14} />
  }
}

export default function BookingSection({ lang = 'no', bookingSection, messageSection, benefits }: BookingSectionProps) {
  const t: Labels = lang === 'no' ? L.no : L.en
  const [meetingType, setMeetingType] = useState(0)
  const [date, setDate] = useState<string | null>(null)
  const [slots, setSlots] = useState<string[]>([])
  const [time, setTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const bookingLabel = bookingSection?.label || 'Preferred Method'
  const bookingTitle = bookingSection?.title || 'Book a Free Consultation'
  const bookingDescription = bookingSection?.description || "Choose a time that works for you. We'll discuss your goals and create a custom plan."
  const meetingTypes = bookingSection?.meetingTypes && bookingSection.meetingTypes.length > 0
    ? bookingSection.meetingTypes
    : defaultMeetingTypes
  const confirmButtonText = bookingSection?.confirmButtonText || 'Confirm Booking'

  const messageLabel = messageSection?.label || 'Alternative'
  const messageTitle = messageSection?.title || 'Send Us a Message'
  const messageDescription = messageSection?.description || "Prefer to write? Fill out the form and we'll get back to you within 2 hours."
  const submitButtonText = messageSection?.submitButtonText || 'Send Message'

  const benefitsList = benefits && benefits.length > 0 ? benefits : defaultBenefits

  const availableSlots = bookingSection?.availableSlots && bookingSection.availableSlots.length > 0
    ? bookingSection.availableSlots
    : null

  const allowedDates = useMemo(() => {
    if (!availableSlots?.length) return null
    return new Set(availableSlots.map((s) => s.date).filter(Boolean) as string[])
  }, [availableSlots])

  function loadSlots(selectedDate: string) {
    setDate(selectedDate)
    setSlots([])
    setTime(null)
    setError(null)

    const SLOT_MINUTES = 60
    let slots: string[] = []

    if (availableSlots && availableSlots.length > 0) {
      const slotForDate = availableSlots.find((s) => s.date === selectedDate)
      if (slotForDate?.times && slotForDate.times.length > 0) {
        slots = [...slotForDate.times].sort()
      }
    }

    if (slots.length === 0 && (!availableSlots || availableSlots.length === 0)) {
      const WORK_START = 9
      const WORK_END = 17
      for (let h = WORK_START; h < WORK_END; h++) {
        slots.push(String(h).padStart(2, '0') + ':00')
      }
    }

    // For today, hide slots that have already passed
    const now = new Date()
    const today =
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0')
    if (selectedDate === today) {
      const nowM = now.getHours() * 60 + now.getMinutes()
      slots = slots.filter((s) => {
        const parts = s.split(':').map(Number)
        const h = parts[0] ?? 0
        const m = parts[1] ?? 0
        return h * 60 + m + SLOT_MINUTES > nowM
      })
    }

    setSlots(slots)
  }

  async function book() {
    if (!date || !time || !name || !email) {
      setError(t.needAll)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const selectedMeetingType = meetingTypes[meetingType]
      const duration =
        selectedMeetingType?.durationMinutes ??
        (selectedMeetingType?.title?.includes('60') ? 60 : 30)

      const res = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          date,
          time,
          duration
        })
      })

      const data = await res.json()

      if (!res.ok) {
        const msg = [data.error, data.hint].filter(Boolean).join(' – ') || t.bookFail
        throw new Error(msg)
      }

      setSuccess(true)
      setDate(null)
      setSlots([])
      setTime(null)
      setName('')
      setEmail('')
      
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      console.error('Error booking:', err)
      setError(err instanceof Error ? err.message : t.bookFail)
    } finally {
      setLoading(false)
    }
  }

  const bookingEnabled = bookingSection?.enabled !== false
  const useCalendly = bookingSection?.useCalendly === true && !!bookingSection?.calendlySchedulingUrl
  const calendlyUrl = bookingSection?.calendlySchedulingUrl?.trim() || ''
  const embedDomain = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
  const calendlyEmbedUrl = calendlyUrl
    ? `${calendlyUrl}${calendlyUrl.includes('?') ? '&' : '?'}embed_domain=${encodeURIComponent(embedDomain)}`
    : ''

  const card = 'flex flex-col gap-5 rounded-lg border border-sc-ink-100 bg-white p-6 lg:p-8'

  return (
    <section id="book" className="scroll-mt-24 bg-sc-ink-50 py-16 lg:py-20">
      <div className={`${ui.container} grid grid-cols-1 items-start gap-5 ${bookingEnabled ? 'lg:grid-cols-2' : 'mx-auto max-w-[720px]'}`}>
        {bookingEnabled && (
          <div className={card}>
            <div>
              <span className={ui.tag}>{bookingLabel}</span>
              <h2 className="m-0 mt-3 text-[26px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900 lg:text-[30px]">{bookingTitle}</h2>
              <p className="m-0 mt-2 text-[15px] leading-relaxed text-sc-ink-600">{bookingDescription}</p>
            </div>

            {useCalendly ? (
              <div className="overflow-hidden rounded-lg border border-sc-ink-100">
                <iframe title="Calendly" src={calendlyEmbedUrl} width="100%" height="100%" className="block min-h-[640px] w-full border-0" />
                <p className="m-0 border-t border-sc-ink-100 p-3 text-center text-[13px] text-sc-ink-500">
                  {t.or} <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-sc-ink-900 underline-offset-2 hover:underline">{t.openTab}</a>
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <h4 className="m-0 text-[13px] font-semibold text-sc-ink-700">{t.meetingType}</h4>
                  {meetingTypes.map((mt, index) => (
                    <MeetingType key={index} title={mt.title || ''} description={mt.description || ''} selected={meetingType === index} onSelect={() => setMeetingType(index)} />
                  ))}
                </div>
                <Calendar t={t} selectedDate={date} onDateSelect={loadSlots} allowedDates={allowedDates} />
                {date && <TimeSlots t={t} slots={slots} selectedTime={time} onTimeSelect={setTime} loading={false} />}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={LABEL}>{t.name} *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" className={INPUT} />
                  </div>
                  <div>
                    <label className={LABEL}>{t.email} *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={INPUT} />
                  </div>
                </div>
                {error && <p className="m-0 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                {success && <p className="m-0 rounded-lg border border-sc-cyan-200 bg-sc-cyan-50 p-3 text-sm text-sc-cyan-700">{t.booked}</p>}
                <button type="button" onClick={book} disabled={loading || !date || !time || !name || !email} className={`${ui.btnPrimary} w-full disabled:cursor-not-allowed disabled:opacity-50`}>
                  {loading ? t.booking : confirmButtonText}
                </button>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col gap-5">
          <div className={card}>
            <div>
              <span className={ui.tagOutline}>{messageLabel}</span>
              <h2 className="m-0 mt-3 text-[26px] font-bold leading-tight tracking-[-0.02em] text-sc-ink-900 lg:text-[30px]">{messageTitle}</h2>
              <p className="m-0 mt-2 text-[15px] leading-relaxed text-sc-ink-600">{messageDescription}</p>
            </div>
            <ContactForm t={t} submitButtonText={submitButtonText} />
          </div>
          {benefitsList.length > 0 && (
            <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-sm text-sc-ink-600">
              {benefitsList.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sc-cyan-50">{getBenefitIcon(benefit.icon)}</span>
                  {benefit.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

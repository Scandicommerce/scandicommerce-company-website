'use client'

import React, { useState, useMemo } from 'react'
import { FiClock, FiCheck, FiLoader } from 'react-icons/fi'

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
  selectedDate: string | null
  onDateSelect: (date: string) => void
  /** When set, only these dates (YYYY-MM-DD) are selectable. When null/empty, any future date is selectable. */
  allowedDates?: Set<string> | null
}

function Calendar({ selectedDate, onDateSelect, allowedDates }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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
          className={`h-10 w-10 flex items-center justify-center text-sm font-medium transition-colors mx-auto
            ${isDaySelected ? 'bg-[#03C1CA] text-white' : disabled ? 'text-gray-300 cursor-not-allowed' : isWeekend ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}
          `}
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
        <h4 className="text-sm font-semibold text-gray-900">Select Date</h4>
        <div className="flex items-center gap-2">
          <button onClick={goToPreviousMonth} className="p-1 hover:bg-gray-100">
            <span className="text-gray-500">&lt;</span>
          </button>
          <span className="text-sm font-medium text-gray-700">{monthName}</span>
          <button onClick={goToNextMonth} className="p-1 hover:bg-gray-100">
            <span className="text-gray-500">&gt;</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
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
      className={`w-full text-left p-4 transition-colors ${selected ? 'bg-[#1DEFFA1A]' : 'hover:bg-[#03C1CA08]'
        }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${selected ? 'text-[#03C1CA]' : 'text-gray-900'}`}>
            {title}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        <div className="w-8 h-8  flex items-center justify-center">
          <FiClock className={`${selected ? 'text-[#03C1CA]' : 'text-gray-400'}`} size={16} />
        </div>
      </div>
    </button>
  )
}

interface TimeSlotsProps {
  slots: string[]
  selectedTime: string | null
  onTimeSelect: (time: string) => void
  loading?: boolean
}

function TimeSlots({ slots, selectedTime, onTimeSelect, loading }: TimeSlotsProps) {
  if (loading) {
    return (
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Available Times (CET)</h4>
        <div className="flex items-center justify-center py-4">
          <FiLoader className="animate-spin text-[#03C1CA]" size={20} />
          <span className="ml-2 text-sm text-gray-500">Loading available times...</span>
        </div>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Available Times (CET)</h4>
        <p className="text-xs text-gray-500">No available times for this date</p>
      </div>
    )
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Available Times (CET)</h4>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((time) => (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className={`py-2 px-3 text-sm border transition-colors ${selectedTime === time
              ? 'bg-[#03C1CA] text-white'
              : 'bg-[#F5F5F5] text-gray-700 hover:text-[#03C1CA]'
              }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  )
}

interface ContactFormProps {
  submitButtonText?: string
}

function ContactForm({ submitButtonText }: ContactFormProps) {
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
      setError('Please enter your email and message.')
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
        setError(data.error || 'Failed to send message.')
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
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="bg-white" onSubmit={handleSubmit}>
      <div className="px-9 py-6 flex flex-col justify-between gap-9">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 bg-[#F5F5F5] text-sm text-black outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 bg-[#F5F5F5] text-sm text-black outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            placeholder="john@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-[#F5F5F5] text-sm text-black outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input
            type="text"
            placeholder="Your Company AS"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-3 py-2 bg-[#F5F5F5] text-sm text-black outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">What are you interested in?</label>
          <select
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full px-3 py-2 bg-[#F5F5F5] text-sm text-gray-500 outline-none"
          >
            <option value="">Select a service</option>
            <option value="shopify-development">Shopify Development</option>
            <option value="migration">Migration Services</option>
            <option value="shopify-pos">Shopify POS</option>
            <option value="consulting">Consulting</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
          <textarea
            placeholder="Tell us about your project..."
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full px-3 py-2 bg-[#F5F5F5] text-sm text-black outline-none resize-none"
          />
        </div>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-600">Message sent! We&apos;ll get back to you soon.</p>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#03C1CA] text-white py-3 font-semibold hover:bg-[#02a8b0] transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <FiLoader className="animate-spin mr-2" size={16} />
              Sending...
            </span>
          ) : (
            submitButtonText || 'Send Message'
          )}
        </button>
      </div>
    </form>
  )
}

const getBenefitIcon = (iconName?: string) => {
  switch (iconName) {
    case 'check':
      return <FiCheck className="text-[#03C1CA]" size={16} />
    case 'clock':
      return <FiClock className="text-[#03C1CA]" size={16} />
    default:
      return <FiCheck className="text-[#03C1CA]" size={16} />
  }
}

export default function BookingSection({ bookingSection, messageSection, benefits }: BookingSectionProps) {
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
      setError('Please fill in all required fields')
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
        const msg = [data.error, data.hint].filter(Boolean).join(' — ') || 'Failed to create booking'
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
      setError(err instanceof Error ? err.message : 'Failed to create booking')
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

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="section_container mx-auto page-padding-x">
        <div className={`grid grid-cols-1 gap-8 lg:gap-12 ${bookingEnabled ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
          {bookingEnabled && (
            <div
              className="bg-[#F5F5F5B3] border border-[#5654544D] overflow-hidden"
              style={{
                boxShadow: '0px 15px 22px 0px rgba(84, 114, 115, 0.12), 10px 45px 35px 0px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div className="p-4 xs:p-6 sm:p-[50px_29px_34px_29px]">
                <span className="inline-block text-xs font-semibold text-white bg-[#03C1CA] px-3 py-1 mb-4">
                  {bookingLabel}
                </span>
                <h2 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-gray-900 mb-2">
                  {bookingTitle}
                </h2>
                <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-gray-500 mb-6">
                  {bookingDescription}
                </p>

                {useCalendly ? (
                  <div className="bg-white p-4 min-h-[600px]">
                    <iframe
                      title="Calendly scheduling"
                      src={calendlyEmbedUrl}
                      width="100%"
                      height="100%"
                      className="min-h-[600px] w-full border-0"
                    />
                    <p className="mt-3 text-sm text-gray-500 text-center">
                      Or{' '}
                      <a
                        href={calendlyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#03C1CA] underline"
                      >
                        open in a new tab
                      </a>
                    </p>
                  </div>
                ) : (
                  <div className="bg-white p-4">
                    <div className="space-y-4 mb-6">
                      <h4 className="text-sm font-semibold text-gray-900">Meeting Type</h4>
                      {meetingTypes.map((mt, index) => (
                        <MeetingType
                          key={index}
                          title={mt.title || ''}
                          description={mt.description || ''}
                          selected={meetingType === index}
                          onSelect={() => setMeetingType(index)}
                        />
                      ))}
                    </div>

                    <Calendar
                      selectedDate={date}
                      onDateSelect={loadSlots}
                      allowedDates={allowedDates}
                    />
                    <TimeSlots
                      slots={slots}
                      selectedTime={time}
                      onTimeSelect={setTime}
                      loading={false}
                    />

                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          required
                          className="w-full px-3 py-2 bg-[#F5F5F5] text-sm text-black outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@company.com"
                          required
                          className="w-full px-3 py-2 bg-[#F5F5F5] text-sm text-black outline-none"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    {success && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-600">
                          Booking confirmed! A calendar invite has been sent to your email.
                        </p>
                      </div>
                    )}

                    <button
                      onClick={book}
                      disabled={loading || !date || !time || !name || !email}
                      className={`w-full mt-6 bg-[#03C1CA] text-white py-3 font-semibold hover:bg-[#02a8b0] transition-colors ${
                        loading || !date || !time || !name || !email
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <FiLoader className="animate-spin mr-2" size={16} />
                          Creating booking...
                        </span>
                      ) : (
                        confirmButtonText
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col justify-between">
            <div className="bg-[#F5F5F5B2] shadow-lg border border-[#5654544D] overflow-hidden">
              <div className="p-4 xs:p-6 sm:p-[50px_29px_34px_29px]">
                <span className="inline-block text-xs font-semibold text-white bg-[#03C1CA] px-3 py-1  mb-4">
                  {messageLabel}
                </span>
                <h2 className="text-[4.3vw] xs:text-[2.6vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[18px] xl:text-[24px] font-bold text-gray-900 mb-2">
                  {messageTitle}
                </h2>
                <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-gray-500 mb-6">
                  {messageDescription}
                </p>
                <ContactForm submitButtonText={submitButtonText} />
              </div>
            </div>

            <div className="bg-white shadow-lg border border-[#5654544D] p-6">
              <div className="flex flex-col gap-3">
                {benefitsList.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8  bg-gray-100 flex items-center justify-center">
                      {getBenefitIcon(benefit.icon)}
                    </div>
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import React, { useState } from 'react'
import { FiClock, FiCheck } from 'react-icons/fi'

interface MeetingTypeData {
  title?: string
  description?: string
}

interface BookingSectionData {
  label?: string
  title?: string
  description?: string
  meetingTypes?: MeetingTypeData[]
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

function Calendar() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [currentMonth] = useState(new Date(2025, 11))

  const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(2025, 12, 0).getDate()
  const firstDayOfMonth = new Date(2025, 11, 1).getDay()

  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const renderDays = () => {
    const cells = []

    for (let i = 0; i < adjustedFirstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-10" />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate === day
      const isWeekend = (adjustedFirstDay + day - 1) % 7 >= 5

      cells.push(
        <button
          key={day}
          onClick={() => setSelectedDate(day)}
          className={`h-10 w-10  flex items-center justify-center text-sm font-medium transition-colors mx-auto
            ${isSelected ? 'bg-[#03C1CA] text-white' : isWeekend ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}
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
          <button className="p-1 hover:bg-gray-100">
            <span className="text-gray-500">&lt;</span>
          </button>
          <span className="text-sm font-medium text-gray-700">{monthName}</span>
          <button className="p-1 hover:bg-gray-100">
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

function TimeSlots() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Available Times (CET)</h4>
      <div className="grid grid-cols-3 gap-2">
        {times.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
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
  return (
    <form className="bg-white">
      <div className="px-9 py-6 flex flex-col justify-between gap-9">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              placeholder="John"
              className="w-full px-3 py-2 bg-[#F5F5F5] text-sm text-black outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Doe"
              className="w-full px-3 py-2 bg-[#F5F5F5] text-sm text-black outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="john@company.com"
            className="w-full px-3 py-2 bg-[#F5F5F5] text-sm text-black outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input
            type="text"
            placeholder="Your Company AS"
            className="w-full px-3 py-2 bg-[#F5F5F5] text-sm text-black outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">What are you interested in?</label>
          <select className="w-full px-3 py-2 bg-[#F5F5F5] text-sm text-gray-500 outline-none">
            <option value="">Select a service</option>
            <option value="shopify-development">Shopify Development</option>
            <option value="migration">Migration Services</option>
            <option value="shopify-pos">Shopify POS</option>
            <option value="consulting">Consulting</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            placeholder="Tell us about your project..."
            rows={4}
            className="w-full px-3 py-2 bg-[#F5F5F5] text-sm text-black outline-none resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#03C1CA] text-white py-3  font-semibold hover:bg-[#02a8b0] transition-colors"
        >
          {submitButtonText || 'Send Message'}
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
  const [meetingType, setMeetingType] = useState('discovery')

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

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div
            className="bg-[#F5F5F5B3] border border-[#5654544D] overflow-hidden"
            style={{
              boxShadow: '0px 15px 22px 0px rgba(84, 114, 115, 0.12), 10px 45px 35px 0px rgba(0, 0, 0, 0.03)'
            }}
          >
            <div className="p-[50px_29px_34px_29px]">
              <span className="inline-block text-xs font-semibold text-white bg-[#03C1CA] px-3 py-1 mb-4">
                {bookingLabel}
              </span>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                {bookingTitle}
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                {bookingDescription}
              </p>

              <div className="bg-white p-4">
                <div className="space-y-4 mb-6">
                  <h4 className="text-sm font-semibold text-gray-900">Meeting Type</h4>
                  {meetingTypes.map((mt, index) => (
                    <MeetingType
                      key={index}
                      title={mt.title || ''}
                      description={mt.description || ''}
                      selected={meetingType === `type-${index}`}
                      onSelect={() => setMeetingType(`type-${index}`)}
                    />
                  ))}
                </div>

                <Calendar />
                <TimeSlots />

                <button className="w-full mt-6 bg-[#03C1CA] text-white py-3 font-semibold hover:bg-[#02a8b0] transition-colors">
                  {confirmButtonText}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="bg-[#F5F5F5B2] shadow-lg border border-[#5654544D] overflow-hidden">
              <div className="p-[50px_29px_34px_29px]">
                <span className="inline-block text-xs font-semibold text-white bg-[#03C1CA] px-3 py-1  mb-4">
                  {messageLabel}
                </span>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  {messageTitle}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
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

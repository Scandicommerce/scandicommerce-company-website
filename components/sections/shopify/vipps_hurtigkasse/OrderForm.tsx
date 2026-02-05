'use client'

import React, { useEffect } from 'react'

interface OrderFormData {
  title?: string
  description?: string
}

interface OrderFormProps {
  orderForm?: OrderFormData
}

export default function OrderForm({ orderForm }: OrderFormProps) {
  const title = orderForm?.title || 'Order Vipps Quick Checkout here'
  const description = orderForm?.description || 'Fill out the order form and we will respond via email'

  useEffect(() => {
    // Load HubSpot forms script
    const script = document.createElement('script')
    script.src = 'https://js.hsforms.net/forms/embed/49119369.js'
    script.defer = true
    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://js.hsforms.net/forms/embed/49119369.js"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return (
    <section id="order-form" className="bg-[#03C1CA] py-16 lg:py-24">
      <div className="section_container mx-auto page-padding-x">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[5.3vw] xs:text-[3.5vw] sm:text-[3.2vw] md:text-[3.2vw] lg:text-[28px] xl:text-[34px] font-bold text-white mb-4">
              {title}
            </h2>
            <p className="text-[4vw] xs:text-[2.6vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[16px] xl:text-[18px] text-white/90">
              {description}
            </p>
          </div>

          <div className="bg-white p-8 lg:p-12 shadow-lg">
            {/* HubSpot Form Embed */}
            <div 
              className="hs-form-frame hubspot-form-container" 
              data-region="na1" 
              data-form-id="10642b03-8cb9-4e6b-8fee-b000f8ccd434" 
              data-portal-id="49119369"
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hubspot-form-container .hs-form-field {
          margin-bottom: 1.5rem;
        }
        .hubspot-form-container .hs-form-field label {
          display: block;
          font-size: 1rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.75rem;
        }
        .hubspot-form-container .hs-input {
          width: 100%;
          padding: 1.25rem;
          background-color: #F5F5F5;
          font-size: 1rem;
          color: black;
          outline: none;
          border: none;
          transition: all 0.2s;
        }
        .hubspot-form-container .hs-input:focus {
          ring: 2px;
          ring-color: #03C1CA;
        }
        .hubspot-form-container textarea.hs-input {
          min-height: 150px;
          resize: none;
        }
        .hubspot-form-container .hs-button {
          width: 100%;
          background-color: #03C1CA;
          color: white;
          padding: 1.25rem;
          font-weight: 600;
          font-size: 1.125rem;
          cursor: pointer;
          transition: background-color 0.2s;
          border: none;
        }
        .hubspot-form-container .hs-button:hover {
          background-color: #02a8b0;
        }
        .hubspot-form-container .hs-error-msgs {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
        .hubspot-form-container .submitted-message {
          text-align: center;
          padding: 2rem;
          font-size: 1.125rem;
          color: #03C1CA;
        }
      `}</style>
    </section>
  )
}

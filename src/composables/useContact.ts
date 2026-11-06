import { ref, reactive, computed } from 'vue'

// 1. Define the exact fields matching your frontend form
export interface ContactForm {
  name: string
  phone: string
  email: string
  checkIn: string
  checkOut: string
  inquiry: string
  message: string
  agree: boolean
}

export function useContact() {
  // Connect to Django backend URL defined in your nuxt.config.ts
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBase as string) || 'http://127.0.0.1:8000/api'

  const inquiryTypes = [
    'Room reservation', 
    'Event or wedding', 
    'Group or retreat', 
    'Other question'
  ] as const

  // 2. Reactive form state
  const form = reactive<ContactForm>({
    name: '',
    phone: '',
    email: '',
    checkIn: '',
    checkOut: '',
    inquiry: inquiryTypes[0] ?? 'Room reservation',
    message: '',
    agree: false,
  })

  // 3. UI and Error State
  const errors = reactive<Record<string, string>>({})
  const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

  const isReservation = computed(() => form.inquiry === 'Room reservation')

  // 4. Frontend Validation Logic
  function validate(): boolean {
    errors.name = form.name.trim() ? '' : 'Enter your full name.'
    errors.phone = form.phone.trim() ? '' : 'Enter your phone number.'
    errors.email = /^\S+@\S+\.\S+$/.test(form.email) ? '' : 'Enter a valid email address.'
    errors.agree = form.agree ? '' : 'Please accept the Privacy Policy.'
    
    // Conditionally validate dates only if it's a reservation inquiry
    if (isReservation.value) {
      errors.checkIn = form.checkIn ? '' : 'Select a check-in date.'
      errors.checkOut = form.checkOut ? '' : 'Select a check-out date.'
    } else {
      errors.checkIn = ''
      errors.checkOut = ''
    }

    // Return true if no errors exist
    return !Object.values(errors).some(Boolean)
  }

  // 5. Submit to Django API
  async function submitContact() {
    if (!validate()) return

    status.value = 'sending'
    errors.backend = '' // Clear any previous server errors

    try {
      const parts = form.name.trim().split(/\s+/)
      const firstName = parts[0] || ''
      const lastName = parts.slice(1).join(' ') || firstName

      // POST request to Django
      await $fetch(`${apiBase}/contact/`, {
        method: 'POST',
        body: {
          ...form,
          firstName,
          lastName,
          first_name: firstName,
          last_name: lastName,
          checkIn: form.checkIn || null,
          checkOut: form.checkOut || null,
        }
      })
      
      status.value = 'success'
      
      // Reset form fields on successful submission
      form.name = ''
      form.phone = ''
      form.email = ''
      form.checkIn = ''
      form.checkOut = ''
      form.inquiry = inquiryTypes[0] ?? 'Room reservation'
      form.message = ''
      form.agree = false

      // Reset the success message after 5 seconds so they can send another if needed
      setTimeout(() => { status.value = 'idle' }, 5000)

    } catch (e: any) {
      status.value = 'error'
      
      // Catch and map Django REST Framework validation errors
      const errData = e.data || {}
      if (typeof errData === 'object' && Object.keys(errData).length > 0) {
        for (const [key, val] of Object.entries(errData)) {
          const msg = Array.isArray(val) ? String(val[0]) : String(val)
          // If the error matches a field, bind it to the input, otherwise show globally
          if (key in form) {
            errors[key] = msg
          } else {
            errors.backend = msg
          }
        }
      } else {
        errors.backend = 'Failed to connect to the server. Please try again later.'
      }
    }
  }

  return {
    form,
    errors,
    status,
    inquiryTypes,
    isReservation,
    validate,
    submitContact
  }
}
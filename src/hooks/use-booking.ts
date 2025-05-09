import { useState, useEffect } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { useBooking as useBookingContext } from "@/components/booking-provider"

const baseUrl = import.meta.env.VITE_BASE_URL || "https://api-instant.pesan.io"

// Function to format price in IDR
export const formatIDR = (priceIDR: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceIDR)
}

// Define payment method interface
export interface PaymentMethod {
  id: string
  name: string
  gateway: string
  category: string
  imageUrl: string
  code: string
  priority: number
  minimumTransaction: number
  maximumTransaction: number | null
  isAvailable: boolean
  message: string | null
  label: string | null
}

export interface ValidationErrors {
  name: string
  phone: string
  email: string
  payment: string
}

export interface OrderCalculation {
  subTotal: number
  discount: number
  tax: number
  serviceCharge: number
  totalPrice: number
  discounts?: Array<{
    name: string
    type: string
    code: string
    amount: number
    description: string
  }>
  availablePayments?: PaymentMethod[]
}

export function useBookingForm() {
  const { guestInfo, setGuestInfo, resetBooking } = useBookingContext()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBooked, setIsBooked] = useState(false)
  const [bookingError, setBookingError] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hotelData, setHotelData] = useState<any>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    name: "",
    phone: "",
    email: "",
    payment: "",
  })
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [roomsFromStorage, setRoomsFromStorage] = useState<any[]>([])
  const [datesFromStorage, setDatesFromStorage] = useState<{
    checkin: string
    checkout: string
  } | null>(null)
  const [hotelDataFromStorage, setHotelDataFromStorage] = useState<any>(null)
  const [countryCode, setCountryCode] = useState("+62")
  const [showCountryCodes, setShowCountryCodes] = useState(false)
  const [orderCalculation, setOrderCalculation] = useState<OrderCalculation | null>(null)
  const [availablePayments, setAvailablePayments] = useState<PaymentMethod[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)

  const [promoCode, setPromoCode] = useState("")
  const [appliedPromoCodes, setAppliedPromoCodes] = useState<string[]>([])
  const [promoCodeError, setPromoCodeError] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [showPromoInput, setShowPromoInput] = useState(false)


  const [guestInfoLoaded, setGuestInfoLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && !guestInfoLoaded) {
      try {
        const storedGuestInfo = localStorage.getItem("guest_info")
        if (storedGuestInfo) {
          const parsedGuestInfo = JSON.parse(storedGuestInfo)

          // Update form fields with stored values
          if (parsedGuestInfo.name) {
            guestInfo.name = parsedGuestInfo.name
          }

          if (parsedGuestInfo.email) {
            guestInfo.email = parsedGuestInfo.email
          }

          if (parsedGuestInfo.mobileNumber) {
            // Extract country code and phone number
            const mobileNumber = parsedGuestInfo.mobileNumber
            const countryCodeMatch = mobileNumber.match(/^(\+\d{1,2})/)
            //const countryCodeMatch = mobileNumber.match(/^(\+\d+)/)

            console.log("ABCD",mobileNumber, countryCodeMatch)

            if (countryCodeMatch && countryCodeMatch[1]) {
              setCountryCode(countryCodeMatch[1])

              // Remove country code from phone number
              let phoneNumber = mobileNumber.substring(countryCodeMatch[1].length)

              console.log("BAR",phoneNumber)

              setGuestInfo({
                ...guestInfo,
                phone: phoneNumber,
              })
            }
          }

          setGuestInfoLoaded(true)
        }
      } catch (error) {
        console.error("Error loading guest info from localStorage:", error)
      }
    }
  }, [setCountryCode, guestInfoLoaded])




  // Fetch hotel and room data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // If we have hotel data in localStorage, use that instead of mock data
        if (hotelDataFromStorage) {
          setHotelData(hotelDataFromStorage)
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching booking data:", err)
        setError("Failed to load booking details. Please try again.")
        setLoading(false)
      }
    }

    fetchData()
  }, [hotelDataFromStorage])

  // Load room data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedRooms = localStorage.getItem("cart_order_room")
        console.log("storedRooms", storedRooms)
        if (storedRooms) {
          const parsedRooms = JSON.parse(storedRooms)
          setRoomsFromStorage(Array.isArray(parsedRooms) ? parsedRooms : [parsedRooms])
        }
      } catch (error) {
        console.error("Error loading rooms from localStorage:", error)
      }
    }
  }, [])

  // Load dates from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedDates = localStorage.getItem("selected_date")
        if (storedDates) {
          const parsedDates = JSON.parse(storedDates)
          setDatesFromStorage(parsedDates)
        }
      } catch (error) {
        console.error("Error loading dates from localStorage:", error)
      }
    }
  }, [])

  // Load hotel data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedHotelData = localStorage.getItem("hotel_data")
        if (storedHotelData) {
          const parsedHotelData = JSON.parse(storedHotelData)
          setHotelDataFromStorage(parsedHotelData)
        }
      } catch (error) {
        console.error("Error loading hotel data from localStorage:", error)
      }
    }
  }, [])

  // Detect user's country from IP address
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()

        // Set country code based on detected country
        if (data.country_calling_code) {
          setCountryCode(data.country_calling_code)
        }
      } catch (error) {
        console.error("Error detecting country:", error)
        // Keep default +62 if detection fails
      }
    }

    detectCountry()
  }, [])

  const calculateOrder  = async (promoCodes) => {
    try {
      setIsApplyingPromo(true)
      const response = await fetch(`${baseUrl}/guest/rooms/orders/instant-calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hotelId: hotelData.hotelId,
          checkinDate: datesFromStorage?.checkin,
          checkoutDate: datesFromStorage?.checkout,
          rooms: roomsFromStorage.flatMap((room) => {
            const roomId = room.roomId
            return room.ratePlans
              .filter((ratePlan) => ratePlan?.order > 0)
              .map((ratePlan) => ({
                roomId: roomId,
                qty: ratePlan.order,
                code: ratePlan.code,
              }))
          }),
          phone: guestInfo.phone || "",
          pointToUse: 0,
          promoCode: promoCodes || null,
        }),
      })


      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data?.meta?.message || "Failed to calculate order";
        throw new Error(errorMessage);
      }

      setOrderCalculation(data.data)

      // Store available payment methods if they exist in the response
      if (data.data && data.data.availablePayments) {
        setAvailablePayments(data.data.availablePayments)
      }

      // Update pricing based on API response
      if (data.data) {
        console.log("Order calculation successful:", data.data)
        return data.data
      }
    } catch (err) {
      console.error("Error calculating order:", err.message)
      setPromoCodeError(err.message || "Failed to apply promo code. Please try again.")
    } finally {
      setIsApplyingPromo(false)
    }
  }

  useEffect(() => {
    if (hotelData && roomsFromStorage && datesFromStorage) {
      calculateOrder()
    }
  }, [hotelData, roomsFromStorage, datesFromStorage])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Special handling for phone numbers
    if (name === "phone") {
      // Only allow digits for phone numbers
      if (value && !/^\d*$/.test(value)) {
        return
      }

      setGuestInfo({
        ...guestInfo,
        [name]: value,
      })

      // Clear validation errors when typing
      if (validationErrors[name as keyof ValidationErrors]) {
        setValidationErrors({
          ...validationErrors,
          [name]: "",
        })
      }

      return // Exit early since we've already updated the state
    }

    setGuestInfo({
      ...guestInfo,
      [name]: value,
    })

    // Clear validation errors when typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const errors = {
      name: "",
      phone: "",
      email: "",
      payment: "",
    }
    let isValid = true

    // Validate name
    if (!guestInfo.name || guestInfo.name.length < 3) {
      errors.name = "Nama lengkap harus lebih dari 3 karakter"
      isValid = false
    }

    // Validate phone
    if (!guestInfo.phone) {
      errors.phone = "Nomor telepon tidak boleh kosong"
      isValid = false
    } else if (!/^\d{8,12}$/.test(guestInfo.phone)) {
      errors.phone = "Nomor telepon tidak valid, harus 8-12 digit"
      isValid = false
    }

    // Validate email
    if (!guestInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
      errors.email = "Email tidak valid, contoh: johndoe@gmail.com"
      isValid = false
    }

    // Validate payment method
    if (!selectedPaymentMethod) {
      errors.payment = "Harap isi metode pembayaran"
      isValid = false
    }

    setValidationErrors(errors)
    return isValid
  }

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setBookingError("")
    setShowConfirmation(false)

    try {
      // Process phone number - remove leading 0 for Indonesian numbers
      let processedPhone = guestInfo.phone
      if (countryCode === "+62" && processedPhone.startsWith("0")) {
        processedPhone = processedPhone.substring(1)
      }

      // Prepare rooms data from selected rooms
      const roomsData = roomsFromStorage.flatMap((room) => {
        const roomId = room.roomId
        return room.ratePlans
          .filter((ratePlan) => ratePlan?.order > 0)
          .map((ratePlan) => ({
            roomId: roomId,
            qty: ratePlan.order,
            code: ratePlan.code,
          }))
      })

      // Prepare booking payload
      const bookingPayload = {
        checkinDate: datesFromStorage?.checkin || "",
        checkoutDate: datesFromStorage?.checkout || "",
        email: guestInfo.email,
        estimedArrival: "12:00", // Default arrival time
        guest: {
          name: guestInfo.name,
          email: guestInfo.email,
          mobileNumber: countryCode + processedPhone,
        },
        hotelId: hotelData?.hotelId,
        paymentChannelId: selectedPaymentMethod?.id,
        promoCode: appliedPromoCodes,
        rooms: roomsData,
        spesialReq: guestInfo.specialRequests || "",
      }

      console.log("Booking payload:", bookingPayload)

      // Make booking API call
      const response = await fetch(`${baseUrl}/guest/rooms/orders/instant-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.meta?.message || "Failed to create booking")
      }

      console.log("Booking successful:", data)

      // Check if payment URL exists and redirect
      if (data.data?.payment?.url) {
        window.location.href = data.data.payment.url
        return
      }

      // If no payment URL, show the booking confirmation page
      setIsBooked(true)
    } catch (err: any) {
      console.error("Error creating booking:", err)
      setBookingError(err.message || "Failed to create booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApplyPromoCode = async (promoCodeInput) => {
    // If it's a string and it's empty after trimming, show error
    if (typeof promoCodeInput === "string" && promoCodeInput.trim() === "") {
      setPromoCodeError("Please enter a promo code");
      return;
    }

    console.log([promoCodeInput])

    // Add promo code to applied codes
    setAppliedPromoCodes([promoCodeInput])
    // setAppliedPromoCodes([...appliedPromoCodes, promoCode])

    // Clear input and error
    setPromoCode("")
    setPromoCodeError("")

    // Recalculate order with new promo code
    if (hotelData && roomsFromStorage && datesFromStorage) {
      const response = await calculateOrder(promoCodeInput ? [promoCodeInput] : [])
      return response
    }
  }

  return {
    isSubmitting,
    isBooked,
    bookingError,
    loading,
    error,
    hotelData,
    validationErrors,
    showPaymentOptions,
    roomsFromStorage,
    datesFromStorage,
    countryCode,
    showCountryCodes,
    orderCalculation,
    availablePayments,
    selectedPaymentMethod,
    promoCode,
    appliedPromoCodes,
    promoCodeError,
    isApplyingPromo,
    showPromoInput,
    guestInfo,
    setShowPaymentOptions,
    setShowCountryCodes,
    setCountryCode,
    setSelectedPaymentMethod,
    setPromoCode,
    setShowPromoInput,
    handleInputChange,
    handleSubmit,
    handleApplyPromoCode,
    validateForm,
  }
}

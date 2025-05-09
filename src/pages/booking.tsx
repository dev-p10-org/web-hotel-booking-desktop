"use client"

export const dynamic = "force-dynamic"

import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, ChevronDown, AlertCircle, Loader2, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useBookingForm, formatIDR } from "@/hooks/use-booking"
import { useState } from "react"
import { NavigationMenu } from "@/components/navigation-menu"
import { BookingLoading } from "@/components/skeleton-booking"

export default function BookingPage() {
  const navigate = useNavigate()
  const {
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
  } = useBookingForm()

  const [appliedPromoCodes, setAppliedPromoCodes] = useState<string[]>([])
  const [showOrderSummary, setShowOrderSummary] = useState(false)

  const [showPromoDialog, setShowPromoDialog] = useState(false)
  const [showPromoResultDialog, setShowPromoResultDialog] = useState(false)
  const [promoResult, setPromoResult] = useState<{ success: boolean; message: string }>({ success: false, message: "" })
  const [promoApplied, setPromoApplied] = useState(false)

  const handleGoBack = () => {
    navigate(-1)
  }

  // Format dates
  const formatDate = (date: Date | null) => {
    if (!date) return ""

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const day = days[date.getDay()]

    return `${day}, ${format(date, "dd MMM yyyy")}`
  }

  if (loading) {
    return <BookingLoading />
  }

  if (error || !hotelData) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <NavigationMenu />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-primary-500" />
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-3">Booking Error</h1>

            <p className="text-gray-600 mb-6">
              {error || "We couldn't load your booking details. This might be due to:"}
            </p>

            {!error && (
              <ul className="text-left text-gray-600 mb-6 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-primary-500">•</span>
                  <span>Missing or expired booking information</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary-500">•</span>
                  <span>Network connectivity issues</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary-500">•</span>
                  <span>The selected hotel is no longer available</span>
                </li>
              </ul>
            )}

            <div className="space-y-3">
              <Button onClick={() => navigate("/")} className="w-full bg-primary-500 hover:bg-primary-600">
                Start New Booking
              </Button>

              <div className="pt-4 border-t mt-4">
                <p className="text-sm text-gray-500 mb-2">Need assistance with your booking?</p>
                <Button
                  variant="link"
                  className="text-primary-500 p-0 h-auto"
                  onClick={() => (window.location.href = "mailto:support@pesanbooking.com")}
                >
                  Contact Customer Support
                </Button>
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} PesanBooking. All rights reserved.
          </div>
        </footer>
      </div>
    )
  }

  if (isBooked) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="sticky top-0 z-10 bg-white border-b p-4 flex items-center">
          <h1 className="text-lg font-medium">Booking Confirmed</h1>
        </div>
        <div className="p-4 flex flex-col items-center justify-center flex-1">
          <div className="bg-green-50 rounded-full p-4 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Booking Successful!</h2>
          <p className="text-gray-600 mb-6 text-center">
            Your booking has been confirmed. A confirmation email has been sent to {guestInfo.email}.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            Return to Home
          </Button>
        </div>
      </div>
    )
  }

  // Payment Details Component
  const PaymentDetails = () => (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium mb-4">Rincian Pembayaran</h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{orderCalculation ? formatIDR(orderCalculation.subTotal) : "-"}</span>
        </div>

        {/* Discounts */}
        {orderCalculation?.discounts && orderCalculation.discounts.length > 0 && (
          <>
            {orderCalculation.discounts.map((discount, index) => (
              <div key={index} className="flex justify-between text-green-600">
                <span>Diskon ({discount.name})</span>
                <span>-{formatIDR(discount.amount)}</span>
              </div>
            ))}
          </>
        )}

        {/* Service Charge */}
        {orderCalculation?.serviceCharge > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Biaya Layanan</span>
            <span>{formatIDR(orderCalculation.serviceCharge)}</span>
          </div>
        )}

        {/* Tax */}
        {orderCalculation?.tax > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Pajak</span>
            <span>{formatIDR(orderCalculation.tax)}</span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between pt-3 border-t font-bold">
          <span>Total Pembayaran</span>
          <span className="text-primary-600">{orderCalculation ? formatIDR(orderCalculation.totalPrice) : "-"}</span>
        </div>
      </div>
    </div>
  )

  // Checkout Button Component
  const CheckoutButton = () => (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-gray-500">Total Pembayaran</p>
          <p className="text-xl font-bold text-primary-500">
            {orderCalculation ? formatIDR(orderCalculation.totalPrice) : "calculating..."}
          </p>
          {bookingError && <p className="text-red-500 text-sm mt-1">{bookingError}</p>}
        </div>
        <Button
          onClick={() => {
            // Validate form before showing summary
            if (validateForm()) {
              setShowOrderSummary(true)
            }
          }}
          disabled={isSubmitting}
          className="w-full text-white lg:w-auto bg-primary-500 hover:bg-primary-600 px-6"
        >
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Lengkapi Data Diri"}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <NavigationMenu />

      {/* Main content with desktop optimization */}
      <div className="flex-1 bg-gray-50">
        {/* Container with desktop optimization */}
        <div className="container mx-auto px-4 py-6 max-w-[1200px]">
          {/* Hotel Info - Moved inside container */}
          <div className="bg-primary-500 text-white p-4 flex items-center rounded-lg shadow-sm mb-4 max-w-[540px] mx-auto lg:max-w-none lg:mx-0">
            <div className="bg-white text-primary-500 rounded p-2 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">{hotelData?.hotelName}</h2>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 max-w-[540px] mx-auto lg:max-w-none lg:mx-0">
            {/* Left column - Booking details */}
            <div className="lg:col-span-7 space-y-4 order-3 lg:order-none">
              {/* Booking Details Form */}
              <div className="bg-white rounded-lg shadow-sm p-4 order-3 lg:order-none">
                <h3 className="text-lg font-medium mb-4">Detail Pemesanan</h3>

                {/* Full Name */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Nama Lengkap</label>
                  <Input
                    name="name"
                    value={guestInfo.name}
                    onChange={handleInputChange}
                    placeholder="Masukan nama lengkap anda"
                    className={validationErrors.name ? "border-red-500" : ""}
                  />
                  {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Nomor Telepon</label>
                  <div className="flex">
                    <button
                      type="button"
                      className="flex items-center border rounded-l px-3 bg-gray-50 hover:bg-gray-100 transition-colors relative group"
                      onClick={() => setShowCountryCodes(true)}
                      aria-label="Change country code"
                    >
                      <span className="text-primary-500 font-medium">{countryCode}</span>
                      <ChevronDown className="h-4 w-4 ml-1 text-primary-500" />
                      <span className="absolute -top-7 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Klik untuk ubah
                      </span>
                    </button>
                    <Input
                      name="phone"
                      value={guestInfo.phone}
                      onChange={handleInputChange}
                      placeholder={countryCode === "+62" ? "contoh: 81234567890" : "contoh: 81234567890"}
                      className={`rounded-l-none ${validationErrors.phone ? "border-red-500" : ""}`}
                    />
                  </div>
                  {validationErrors.phone && <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>}
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={guestInfo.email}
                    onChange={handleInputChange}
                    placeholder="Masukkan alamat email kamu"
                    className={validationErrors.email ? "border-red-500" : ""}
                  />
                  {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
                </div>

                {/* Special Requests */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Permintaan Khusus</label>
                  <Textarea
                    name="specialRequests"
                    value={guestInfo.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Tambah Catatan (contoh: permintaan khusus)"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* Payment Method - Moved from right column */}
              <div className="bg-white rounded-lg shadow-sm p-4 order-4 lg:order-none">
                <h3 className="text-lg font-medium mb-2">Metode Pembayaran</h3>

                <button
                  className="w-full flex items-center justify-between p-3 border rounded-md"
                  onClick={() => setShowPaymentOptions(true)}
                >
                  <div className="flex items-center">
                    {selectedPaymentMethod ? (
                      <>
                        {selectedPaymentMethod.imageUrl ? (
                          <img
                            src={selectedPaymentMethod.imageUrl || "/placeholder.svg"}
                            alt={selectedPaymentMethod.name}
                            className="h-6 w-6 object-contain mr-2"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-primary-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                        )}
                        <span className="text-gray-800">{selectedPaymentMethod.name}</span>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-primary-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        <span className="text-gray-500">Pilih Metode Pembayaran</span>
                      </>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                {validationErrors.payment && <p className="text-red-500 text-sm mt-1">{validationErrors.payment}</p>}
              </div>

              {/* Promo Code - Moved from right column */}
              <div className="bg-white rounded-lg shadow-sm p-4 order-5 lg:order-none">
                <h3 className="text-lg font-medium mb-2">Kode Promo</h3>
                {appliedPromoCodes.length === 0 && (
                  <button
                    className="w-full flex items-center justify-between p-3 border rounded-md"
                    onClick={() => setShowPromoDialog(true)}
                  >
                    <div className="flex items-center">
                      <div className="text-primary-500 mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                      </div>
                      <span className="text-gray-500">Masukkan Kode Promo</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                )}

                {/* Show applied promo with success message */}
                {appliedPromoCodes.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-col bg-primary-50 text-primary-700 px-3 py-2 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="font-medium">Kode Promo: {appliedPromoCodes[0]}</span>
                        </div>
                        <button
                          className="text-primary-500 hover:text-primary-700"
                          onClick={async () => {
                            setAppliedPromoCodes([])
                            setPromoCode("")
                            setPromoApplied(false)

                            // Recalculate order without promo code
                            try {
                              await handleApplyPromoCode(null)
                            } catch (error) {
                              console.error("Error recalculating order:", error)
                            }
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 00-1.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      {orderCalculation?.discounts && orderCalculation.discounts.length > 0 && (
                        <p className="text-green-600 text-sm mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 inline mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Promo berhasil diterapkan! Anda mendapatkan diskon{" "}
                          {formatIDR(
                            orderCalculation.discounts.reduce((total, discount) => total + discount.amount, 0),
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Payment Details - Mobile Version (hidden on desktop) */}
              <div className="block lg:hidden mt-4">
                <PaymentDetails />
                <div className="mt-4">
                  <CheckoutButton />
                </div>
              </div>
            </div>

            {/* Right column - Payment and summary */}
            <div className="lg:col-span-5 space-y-4 order-auto lg:order-none">
              {/* Check-in/Check-out */}
              <div className="bg-white p-4 rounded-lg shadow-sm order-1 lg:order-none">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Check-In</p>
                    <p className="font-medium">
                      {datesFromStorage ? formatDate(new Date(datesFromStorage.checkin)) : formatDate(null)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Check-Out</p>
                    <p className="font-medium">
                      {datesFromStorage ? formatDate(new Date(datesFromStorage.checkout)) : formatDate(null)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Room Selection */}
              <div className="bg-white rounded-lg shadow-sm order-2 lg:order-none">
                <h3 className="text-lg font-medium p-4 border-b">Selected Rooms</h3>
                {roomsFromStorage.map((room, index) => (
                  <div key={index} className="p-4 border-b last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{room.qty || room.order || 1}x</span>
                          <div>
                            <p className="font-medium">
                              {room.roomName} {room.breakfastInclude ? "With Breakfast" : "Only"}
                            </p>
                            <p className="text-primary-500">{formatIDR(room.price)}</p>
                          </div>
                        </div>
                      </div>
                      <p className="font-medium">{formatIDR(room.price * (room.qty || room.order || 1))}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Details - Desktop Version (hidden on mobile) */}
              <div className="hidden lg:block">
                <PaymentDetails />
              </div>

              {/* Checkout Button - Desktop Version (hidden on mobile) */}
              <div className="hidden lg:block sticky bottom-0 lg:relative lg:bottom-auto order-7 lg:order-none">
                <CheckoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Dialog */}
      <Dialog open={showPaymentOptions} onOpenChange={setShowPaymentOptions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pilih Metode Pembayaran</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-4 max-h-[60vh] overflow-y-auto">
            {availablePayments.length > 0 ? (
              availablePayments.map((payment) => (
                <div
                  key={payment.id}
                  className={`p-3 border rounded-md flex items-center cursor-pointer ${
                    selectedPaymentMethod?.id === payment.id ? "border-primary-500 bg-primary-50" : ""
                  }`}
                  onClick={() => {
                    setSelectedPaymentMethod(payment)
                    setShowPaymentOptions(false)
                  }}
                >
                  {payment.imageUrl ? (
                    <img
                      src={payment.imageUrl || "/placeholder.svg"}
                      alt={payment.name}
                      className="w-8 h-8 object-contain mr-3"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                      {payment.name.charAt(0)}
                    </div>
                  )}
                  <span>{payment.name}</span>
                  {selectedPaymentMethod?.id === payment.id && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary-500 ml-auto"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">Loading payment methods...</p>
                <Loader2 className="h-8 w-8 animate-spin mx-auto mt-4" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentOptions(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Country Code Dialog */}
      <Dialog open={showCountryCodes} onOpenChange={setShowCountryCodes}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pilih Kode Negara</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-4 max-h-[60vh] overflow-y-auto">
            {[
              { code: "+62", country: "Indonesia" },
              { code: "+60", country: "Malaysia" },
              { code: "+65", country: "Singapore" },
              { code: "+66", country: "Thailand" },
              { code: "+63", country: "Philippines" },
              { code: "+1", country: "United States/Canada" },
              { code: "+44", country: "United Kingdom" },
              { code: "+61", country: "Australia" },
              { code: "+81", country: "Japan" },
              { code: "+82", country: "South Korea" },
            ].map((item) => (
              <div
                key={item.code}
                className={`p-3 border rounded-md flex items-center cursor-pointer ${
                  countryCode === item.code ? "border-primary-500 bg-primary-50" : ""
                }`}
                onClick={() => {
                  setCountryCode(item.code)
                  setShowCountryCodes(false)
                }}
              >
                <span className="font-medium mr-2">{item.code}</span>
                <span>{item.country}</span>
                {countryCode === item.code && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary-500 ml-auto"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCountryCodes(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Summary Modal */}
      <Dialog open={showOrderSummary} onOpenChange={setShowOrderSummary}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ringkasan Pesanan</DialogTitle>
          </DialogHeader>
          <div className="py-4 pb-16 max-h-[60vh] overflow-y-auto">
            {/* Hotel Info */}
            <div className="mb-4">
              <h3 className="font-medium text-lg">{hotelData?.hotelName}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {datesFromStorage
                    ? `${format(new Date(datesFromStorage.checkin), "dd MMM yyyy")} - ${format(
                        new Date(datesFromStorage.checkout),
                        "dd MMM yyyy",
                      )}`
                    : ""}
                </span>
              </div>
            </div>

            {/* Room Details */}
            <div className="border-t border-b py-3 mb-4">
              <h4 className="font-medium mb-2">Detail Kamar</h4>
              {roomsFromStorage.map((room, index) => (
                <div key={index} className="flex justify-between items-center mb-2 text-sm">
                  <span>
                    {room.qty || room.order || 1}x {room.roomName} {room.breakfastInclude ? "With Breakfast" : "Only"}
                  </span>
                  <span>{formatIDR(room.price * (room.qty || room.order || 1))}</span>
                </div>
              ))}
            </div>

            {/* Guest Info */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Informasi Tamu</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-500">Nama:</span> {guestInfo.name || "-"}
                </p>
                <p>
                  <span className="text-gray-500">Email:</span> {guestInfo.email || "-"}
                </p>
                <p>
                  <span className="text-gray-500">Telepon:</span>{" "}
                  {guestInfo.phone
                    ? countryCode + (guestInfo.phone.startsWith("0") ? guestInfo.phone.substring(1) : guestInfo.phone)
                    : "-"}
                </p>
                {guestInfo.specialRequests && (
                  <p>
                    <span className="text-gray-500">Permintaan Khusus:</span> {guestInfo.specialRequests}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Metode Pembayaran</h4>
              {selectedPaymentMethod ? (
                <div className="flex items-center">
                  {selectedPaymentMethod.imageUrl && (
                    <img
                      src={selectedPaymentMethod.imageUrl || "/placeholder.svg"}
                      alt={selectedPaymentMethod.name}
                      className="h-5 w-5 object-contain mr-2"
                    />
                  )}
                  <span>{selectedPaymentMethod.name}</span>
                </div>
              ) : (
                <p className="text-red-500 text-sm">Silakan pilih metode pembayaran</p>
              )}
            </div>

            {/* Terms and Conditions */}
            {orderCalculation?.hotel?.termAndCondition && (
              <div className="border-t pt-3 mt-4">
                <h4 className="font-medium mb-2">Syarat dan Ketentuan</h4>
                <div
                  className="text-sm text-gray-700 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: orderCalculation.hotel.termAndCondition
                      .replace(/<p>/g, '<p class="mb-2">')
                      .replace(/<ul>/g, '<ul class="list-disc pl-5 mb-2">')
                      .replace(/<ol>/g, '<ol class="list-decimal pl-5 mb-2">')
                      .replace(/<li>/g, '<li class="mb-1">'),
                  }}
                />
              </div>
            )}

            {/* Payment Summary */}
            <div className="border-t pt-3">
              <h4 className="font-medium mb-2">Ringkasan Pembayaran</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{orderCalculation ? formatIDR(orderCalculation.subTotal) : "-"}</span>
                </div>

                {orderCalculation?.discounts && orderCalculation.discounts.length > 0 && (
                  <>
                    {orderCalculation.discounts.map((discount, index) => (
                      <div key={index} className="flex justify-between text-green-600">
                        <span>Diskon ({discount.name})</span>
                        <span>-{formatIDR(discount.amount)}</span>
                      </div>
                    ))}
                  </>
                )}

                {orderCalculation?.serviceCharge > 0 && (
                  <div className="flex justify-between">
                    <span>Biaya Layanan</span>
                    <span>{formatIDR(orderCalculation.serviceCharge)}</span>
                  </div>
                )}

                {orderCalculation?.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Pajak</span>
                    <span>{formatIDR(orderCalculation.tax)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">
                    {orderCalculation ? formatIDR(orderCalculation.totalPrice) : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 absolute bottom-0 left-0 right-0 p-4 border-t bg-white shadow-md">
            <Button variant="outline" onClick={() => setShowOrderSummary(false)} className="sm:order-1">
              Kembali
            </Button>
            <Button
              onClick={() => {
                // Save guest info to localStorage
                if (typeof window !== "undefined") {
                  // Process phone number - remove leading 0 for Indonesian numbers
                  let processedPhone = guestInfo.phone
                  if (countryCode === "+62" && processedPhone.startsWith("0")) {
                    processedPhone = processedPhone.substring(1)
                  }

                  const guestInfoForStorage = {
                    name: guestInfo.name,
                    email: guestInfo.email,
                    mobileNumber: countryCode + processedPhone,
                  }

                  localStorage.setItem("guest_info", JSON.stringify(guestInfoForStorage))
                }

                setShowOrderSummary(false)
                handleSubmit()
              }}
              disabled={isSubmitting || !selectedPaymentMethod}
              className="bg-primary-500 text-white hover:bg-primary-600 sm:order-2"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Konfirmasi Pesanan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promo Code Dialog */}
      <Dialog
        open={showPromoDialog}
        onOpenChange={(open) => {
          if (!open) {
            setPromoApplied(false)
          }
          setShowPromoDialog(open)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{promoApplied ? "Promo Berhasil Diterapkan" : "Masukkan Kode Promo"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {promoApplied ? (
              <div className="p-4 rounded-md bg-green-50 text-green-700 flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium">Kode promo {promoCode} berhasil diterapkan!</p>
                  {orderCalculation?.discounts && orderCalculation.discounts.length > 0 && (
                    <p className="mt-1">
                      Anda mendapatkan diskon{" "}
                      {formatIDR(orderCalculation.discounts.reduce((total, discount) => total + discount.amount, 0))}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Input
                  placeholder="Masukkan kode promo"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="mb-2"
                />
                {promoCodeError && (
                  <p className="text-red-500 text-sm">
                    {promoCodeError.includes('"meta"') ? JSON.parse(promoCodeError).meta.message : promoCodeError}
                  </p>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            {promoApplied ? (
              <Button onClick={() => setShowPromoDialog(false)} className="bg-primary-500 text-white hover:bg-primary-600">
                Selesai
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowPromoDialog(false)}>
                  Batal
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const data = await handleApplyPromoCode(promoCode)

                      // Check if there was an error in the response
                      // console.log("handleApplyPromoCode",data)
                      if (data) {
                        setPromoApplied(true)
                        setAppliedPromoCodes([promoCode])
                      }
                    } catch (error) {
                      console.error("Error applying promo code:", error)
                    }
                  }}
                  disabled={isApplyingPromo || !promoCode.trim()}
                  className="bg-primary-500 hover:bg-primary-600"
                >
                  {isApplyingPromo ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                  Terapkan
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promo Result Dialog */}
      <Dialog open={showPromoResultDialog} onOpenChange={setShowPromoResultDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{promoResult.success ? "Promo Berhasil" : "Promo Gagal"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div
              className={`p-4 rounded-md ${promoResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"} flex items-start`}
            >
              {promoResult.success ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 00-1.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <p>{promoResult.message}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPromoResultDialog(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

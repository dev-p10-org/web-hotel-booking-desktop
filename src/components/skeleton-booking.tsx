import { NavigationMenu } from "@/components/navigation-menu"
import { Skeleton } from "@/components/ui/skeleton"

export function BookingLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />

      {/* Hotel Info */}
      <div className="bg-primary-500 text-white p-4 flex items-center">
        <div className="bg-white text-primary-500 rounded p-2 mr-3">
          <Skeleton className="h-6 w-6" />
        </div>
        <Skeleton className="h-7 w-48 bg-primary-400" />
      </div>

      {/* Check-in/Check-out */}
      <div className="bg-white p-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500 text-sm">Check-In</p>
          <Skeleton className="h-6 w-full mt-1" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Check-Out</p>
          <Skeleton className="h-6 w-full mt-1" />
        </div>
      </div>

      {/* Room Selection */}
      <div className="bg-white mt-2">
        {[1, 2].map((index) => (
          <div key={index} className="p-4 border-b">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <Skeleton className="h-6 w-6 mr-2" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Booking Details Form */}
      <div className="bg-white mt-2 p-4">
        <Skeleton className="h-7 w-40 mb-4" />

        {/* Full Name */}
        <div className="mb-4">
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <Skeleton className="h-4 w-32 mb-1" />
          <div className="flex">
            <Skeleton className="h-10 w-16 rounded-l-md" />
            <Skeleton className="h-10 flex-1 rounded-l-none" />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Special Requests */}
        <div className="mb-4">
          <Skeleton className="h-24 w-full" />
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white mt-2 p-4">
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-14 w-full rounded-md" />
      </div>

      {/* Promo Code */}
      <div className="bg-white mt-2 p-4">
        <Skeleton className="h-7 w-32 mb-2" />
        <Skeleton className="h-14 w-full rounded-md" />
      </div>

      {/* Payment Details */}
      <div className="bg-white mt-2 p-4">
        <Skeleton className="h-7 w-48 mb-4" />

        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="flex justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="flex justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>

          {/* Total */}
          <div className="flex justify-between pt-3 border-t">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-28" />
          </div>
        </div>
      </div>

      {/* Total Payment */}
      <div className="mt-auto">
        <div className="bg-white p-4 border-t">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-7 w-40" />
            </div>
            <Skeleton className="h-10 w-40 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

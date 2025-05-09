import { NavigationMenu } from "@/components/navigation-menu"
import { Skeleton } from "@/components/ui/skeleton"

export function HotelRoomsLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationMenu />
      <main className="flex-1 bg-gray-50">
        {/* Image Gallery Skeleton */}
        <div className="w-full h-[300px] md:h-[400px] relative bg-gray-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Navigation Arrows */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4">
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((index) => (
              <Skeleton key={index} className="w-2 h-2 rounded-full" />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Hotel Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-5 w-32 ml-2" />
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Services & Equipments */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-40" />
                </div>

                <div className="grid grid-cols-5 gap-4 mb-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                      <Skeleton className="w-12 h-12 rounded-full mb-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="border-b pb-4">
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-6 h-6 rounded-full" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                        <Skeleton className="w-8 h-8 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Choose your room */}
              <div>
                <Skeleton className="h-7 w-48 mb-4" />

                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg overflow-hidden">
                      <Skeleton className="h-32 w-full" />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Skeleton className="h-6 w-40" />
                          <Skeleton className="h-5 w-24" />
                        </div>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="mb-4">
                          <Skeleton className="h-5 w-32 mb-2" />
                          <div className="flex flex-wrap gap-2">
                            {[1, 2, 3].map((j) => (
                              <Skeleton key={j} className="h-6 w-16" />
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 space-y-4">
                          {[1, 2].map((j) => (
                            <div key={j} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <Skeleton className="h-5 w-32 mb-2" />
                                  <Skeleton className="h-4 w-48 mb-1" />
                                  <Skeleton className="h-3 w-40" />
                                </div>
                                <div className="text-right">
                                  <Skeleton className="h-6 w-24 mb-1" />
                                  <Skeleton className="h-3 w-16" />
                                </div>
                              </div>
                              <div className="flex justify-end mt-3">
                                <Skeleton className="h-8 w-20" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </footer>
    </div>
  )
}

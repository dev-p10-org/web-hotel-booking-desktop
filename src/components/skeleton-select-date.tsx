import { NavigationMenu } from "@/components/navigation-menu"
import { Skeleton } from "@/components/ui/skeleton"

export function SelectDateLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4 mb-6">
            <Skeleton className="h-8 w-3/4" />

            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-7 w-48" />
            </div>

            <div className="space-y-6">
              {/* Check-in date */}
              <div>
                <Skeleton className="h-5 w-20 mb-2" />
                <Skeleton className="h-14 w-full" />
              </div>

              {/* Check-out date */}
              <div>
                <Skeleton className="h-5 w-20 mb-2" />
                <Skeleton className="h-14 w-full" />
              </div>

              {/* Search button */}
              <Skeleton className="h-14 w-full rounded-lg mt-6" />
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

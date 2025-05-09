import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Luxury Hotel"
              className="w-full h-full object-cover brightness-[0.7]"
            />
          </div>
          <div className="container relative z-10 mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Your Perfect Stay Awaits</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Discover exceptional comfort and luxury at our handpicked hotels around the world
            </p>
            <Link to="/select-date">
              <Button size="lg" className="text-lg px-8 py-6 bg-primary-600 hover:bg-primary-700">
                Book Rooms Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Color Palette Showcase */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Primary Color Palette</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-6 rounded-lg bg-primary-50 text-black">
                <h3 className="font-bold">Primary 50</h3>
                <p>bg-primary-50</p>
              </div>
              <div className="p-6 rounded-lg bg-primary-100 text-black">
                <h3 className="font-bold">Primary 100</h3>
                <p>bg-primary-100</p>
              </div>
              <div className="p-6 rounded-lg bg-primary-200 text-black">
                <h3 className="font-bold">Primary 200</h3>
                <p>bg-primary-200</p>
              </div>
              <div className="p-6 rounded-lg bg-primary-300 text-black">
                <h3 className="font-bold">Primary 300</h3>
                <p>bg-primary-300</p>
              </div>
              <div className="p-6 rounded-lg bg-primary-400 text-black">
                <h3 className="font-bold">Primary 400</h3>
                <p>bg-primary-400</p>
              </div>
              <div className="p-6 rounded-lg bg-primary-500 text-white">
                <h3 className="font-bold">Primary 500</h3>
                <p>bg-primary-500</p>
              </div>
              <div className="p-6 rounded-lg bg-primary-600 text-white">
                <h3 className="font-bold">Primary 600</h3>
                <p>bg-primary-600</p>
              </div>
              <div className="p-6 rounded-lg bg-primary-700 text-white">
                <h3 className="font-bold">Primary 700</h3>
                <p>bg-primary-700</p>
              </div>
              <div className="p-6 rounded-lg bg-primary-800 text-white">
                <h3 className="font-bold">Primary 800</h3>
                <p>bg-primary-800</p>
              </div>
              <div className="p-6 rounded-lg bg-primary-900 text-white">
                <h3 className="font-bold">Primary 900</h3>
                <p>bg-primary-900</p>
              </div>
              <div className="p-6 rounded-lg bg-primary-950 text-white">
                <h3 className="font-bold">Primary 950</h3>
                <p>bg-primary-950</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
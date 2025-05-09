import { Routes, Route } from 'react-router-dom';
import { BookingProvider } from "@/components/booking-provider"
import Home from "@/pages/homepage"
import HotelSelectDatePage from "@/pages/select-date"
import HotelDetailPage from '@/pages/hotel-rooms'
import BookingPage from '@/pages/booking'

function App() {
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full bg-white shadow-lg min-h-screen relative overflow-hidden">
        <BookingProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/select-date" element={<HotelSelectDatePage />} />
          <Route path="/hotel-rooms" element={<HotelDetailPage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
        </BookingProvider>
      </div>
    </div>
  );
}

export default App;
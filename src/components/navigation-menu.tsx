"use client"
import { useNavigate } from "react-router-dom"

interface NavigationMenuProps {
  className?: string
}

export function NavigationMenu({ className }: NavigationMenuProps) {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span>Back</span>
      </button>
    </div>
  )
}

// Image utility functions and constants for the application

// Base URL for placeholder images with light theme
export const PLACEHOLDER_BASE = "/placeholder.svg"

// Function to generate a clean, light-themed image URL
export function getCleanImageUrl(query: string, width = 600, height = 400): string {
  // Clean up the query to make it more suitable for image generation
  const cleanQuery = query
    .replace(/with.*$/, "") // Remove "with..." phrases
    .replace(/in.*$/, "") // Remove "in..." phrases
    .trim()

  // Create a light-themed, clean image URL
  return `${PLACEHOLDER_BASE}?height=${height}&width=${width}&query=clean modern ${cleanQuery} with soft lighting, minimalist style, light background`
}

// Function to generate a hotel room image URL
export function getRoomImageUrl(query: string, width = 600, height = 400): string {
  return `${PLACEHOLDER_BASE}?height=${height}&width=${width}&query=clean modern hotel ${query} interior, bright and airy, minimalist design, soft natural lighting`
}

// Function to generate a city image URL
export function getCityImageUrl(query: string, width = 600, height = 400): string {
  return `${PLACEHOLDER_BASE}?height=${height}&width=${width}&query=clean aerial view of ${query}, bright daylight, clear sky, minimalist style`
}

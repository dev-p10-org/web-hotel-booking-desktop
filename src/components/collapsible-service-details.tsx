"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ServiceCategoryProps {
  category: {
    name: string
    imageUrl?: string
    icon?: React.ReactNode
  }
  services: string[]
  isExpanded?: boolean
}

export function CollapsibleServiceDetails({ category, services, isExpanded = false }: ServiceCategoryProps) {
  const [expanded, setExpanded] = useState(isExpanded)

  return (
    <div className="border-b pb-4">
      <div className="flex items-center justify-between py-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          {category.imageUrl ? (
            <div className="w-6 h-6 relative">
              <Image
                src={category.imageUrl || "/placeholder.svg"}
                alt={category.name}
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
          ) : (
            category.icon
          )}
          <h3 className="font-medium">{category.name}</h3>
        </div>
        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {expanded && (
        <div className="pl-9 mt-2">
          <ul className="space-y-2">
            {services.length > 0 ? (
              services.map((service, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>{service}</span>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">No detailed services available</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

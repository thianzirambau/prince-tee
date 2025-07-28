"use client"

import type React from "react"
import { useState } from "react"
import { MapPin, Search, Navigation, Clock } from "lucide-react"
import type { MapLocation } from "@/types"

interface CampusMapProps {
  locations: MapLocation[]
}

export const CampusMap: React.FC<CampusMapProps> = ({ locations }) => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getLocationColor = (type: string) => {
    switch (type) {
      case "building":
        return "bg-blue-600"
      case "facility":
        return "bg-green-600"
      case "parking":
        return "bg-purple-600"
      case "dining":
        return "bg-orange-600"
      default:
        return "bg-gray-600"
    }
  }

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "building":
        return "🏢"
      case "facility":
        return "🏛️"
      case "parking":
        return "🚗"
      case "dining":
        return "🍽️"
      default:
        return "📍"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Campus Navigation</h2>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="relative bg-green-50 rounded-lg h-96 overflow-hidden">
            <svg viewBox="0 0 500 400" className="w-full h-full">
              {/* Campus paths */}
              <path d="M50 200 L450 200 M250 50 L250 350" stroke="#cbd5e1" strokeWidth="4" fill="none" />
              <path d="M150 100 L350 100 M150 300 L350 300" stroke="#cbd5e1" strokeWidth="2" fill="none" />

              {/* Location markers */}
              {filteredLocations.map((location) => (
                <g key={location.id}>
                  <circle
                    cx={location.coordinates.x}
                    cy={location.coordinates.y}
                    r="12"
                    className={`${getLocationColor(location.type)} cursor-pointer hover:opacity-80 transition-opacity`}
                    onClick={() => setSelectedLocation(location)}
                  />
                  <text
                    x={location.coordinates.x}
                    y={location.coordinates.y + 25}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700"
                  >
                    {getLocationIcon(location.type)}
                  </text>
                </g>
              ))}
            </svg>

            {/* Legend */}
            <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Legend</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span>Buildings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span>Facilities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  <span>Parking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                  <span>Dining</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-4">
          {selectedLocation ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start space-x-3 mb-4">
                <div
                  className={`w-10 h-10 ${getLocationColor(selectedLocation.type)} rounded-lg flex items-center justify-center text-white text-lg`}
                >
                  {getLocationIcon(selectedLocation.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedLocation.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{selectedLocation.type.replace("-", " ")}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{selectedLocation.description}</p>

              {selectedLocation.hours && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Hours: {selectedLocation.hours}</span>
                </div>
              )}

              <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Location</h3>
              <p className="text-gray-600">Click on any marker on the map to view details and get directions.</p>
            </div>
          )}

          {/* Quick Locations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
            <div className="space-y-2">
              {locations.slice(0, 4).map((location) => (
                <button
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div
                    className={`w-6 h-6 ${getLocationColor(location.type)} rounded flex items-center justify-center text-white text-xs`}
                  >
                    {getLocationIcon(location.type)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{location.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

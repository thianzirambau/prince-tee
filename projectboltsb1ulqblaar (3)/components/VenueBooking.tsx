"use client"

import type React from "react"
import { useState } from "react"
import { Calendar, Clock, Users, MapPin, Filter, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import type { Venue, Booking } from "@/types"

interface VenueBookingProps {
  venues: Venue[]
  bookings: Booking[]
  onBookVenue: (booking: Omit<Booking, "id">) => void
  onCancelBooking: (bookingId: string) => void
}

export const VenueBooking: React.FC<VenueBookingProps> = ({ venues, bookings, onBookVenue, onCancelBooking }) => {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [filterType, setFilterType] = useState<string>("all")
  const [bookingForm, setBookingForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: 1,
  })

  const filteredVenues = venues.filter((venue) => filterType === "all" || venue.type === filterType)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getVenueTypeColor = (type: string) => {
    switch (type) {
      case "study-room":
        return "bg-blue-100 text-blue-800"
      case "conference-hall":
        return "bg-purple-100 text-purple-800"
      case "lab":
        return "bg-green-100 text-green-800"
      case "auditorium":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVenue) return

    const newBooking: Omit<Booking, "id"> = {
      venue: selectedVenue.name,
      venueId: selectedVenue.id,
      date: bookingForm.date,
      startTime: bookingForm.startTime,
      endTime: bookingForm.endTime,
      status: "pending",
      purpose: bookingForm.purpose,
      attendees: bookingForm.attendees,
    }

    onBookVenue(newBooking)
    setShowBookingForm(false)
    setSelectedVenue(null)
    setBookingForm({
      date: "",
      startTime: "",
      endTime: "",
      purpose: "",
      attendees: 1,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Venue Booking</h2>
        <div className="flex items-center space-x-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Venues</option>
            <option value="study-room">Study Rooms</option>
            <option value="conference-hall">Conference Halls</option>
            <option value="lab">Labs</option>
            <option value="auditorium">Auditoriums</option>
          </select>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Venue List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Available Venues</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer transition-all hover:shadow-md ${
                  selectedVenue?.id === venue.id ? "ring-2 ring-blue-500 border-blue-200" : ""
                } ${!venue.available ? "opacity-60" : ""}`}
                onClick={() => venue.available && setSelectedVenue(venue)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">{venue.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVenueTypeColor(venue.type)}`}>
                    {venue.type.replace("-", " ")}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{venue.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Capacity: {venue.capacity} people</span>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {venue.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {amenity}
                      </span>
                    ))}
                    {venue.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{venue.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-sm font-medium ${venue.available ? "text-green-600" : "text-red-600"}`}>
                    {venue.available ? "Available" : "Unavailable"}
                  </span>
                  {venue.available && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedVenue(venue)
                        setShowBookingForm(true)
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form / My Bookings */}
        <div className="space-y-6">
          {showBookingForm && selectedVenue ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book {selectedVenue.name}</h3>
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      required
                      value={bookingForm.startTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      required
                      value={bookingForm.endTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Group Study Session"
                    value={bookingForm.purpose}
                    onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Attendees</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedVenue.capacity}
                    required
                    value={bookingForm.attendees}
                    onChange={(e) => setBookingForm({ ...bookingForm, attendees: Number.parseInt(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Bookings</h3>
              <div className="space-y-3">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{booking.venue}</h4>
                        {getStatusIcon(booking.status)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {booking.startTime} - {booking.endTime}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{booking.attendees} attendees</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{booking.purpose}</p>
                      {booking.status === "confirmed" && (
                        <button
                          onClick={() => onCancelBooking(booking.id)}
                          className="mt-3 text-red-600 text-sm hover:text-red-700 transition-colors"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No bookings yet</p>
                    <p className="text-sm text-gray-500">Select a venue to make your first booking</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

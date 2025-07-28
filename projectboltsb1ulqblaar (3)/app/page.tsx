"use client"

import { useState } from "react"
import { MapPin, Calendar, Bell, BookOpen, Menu, Search, User, Settings } from "lucide-react"

// Import components
import { Dashboard } from "@/components/Dashboard"
import { CampusMap } from "@/components/CampusMap"
import { VenueBooking } from "@/components/VenueBooking"
import { Announcements } from "@/components/Announcements"
import { AcademicProgress } from "@/components/AcademicProgress"
import { LoginModal } from "@/components/LoginModal"

// Import data and types
import {
  currentUser,
  announcements as initialAnnouncements,
  bookings as initialBookings,
  venues,
  courses,
  mapLocations,
} from "@/data/mockData"
import type { Announcement, Booking } from "@/types"

export default function SmartCampus() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements)
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [showLogin, setShowLogin] = useState(false)

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BookOpen },
    { id: "navigation", label: "Campus Map", icon: MapPin },
    { id: "bookings", label: "Venue Booking", icon: Calendar },
    { id: "announcements", label: "Announcements", icon: Bell },
    { id: "progress", label: "Academic Progress", icon: BookOpen },
  ]

  const handleMarkAsRead = (announcementId: string) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === announcementId ? { ...announcement, isRead: true } : announcement,
      ),
    )
  }

  const handleBookVenue = (newBooking: Omit<Booking, "id">) => {
    const booking: Booking = {
      ...newBooking,
      id: Date.now().toString(),
    }
    setBookings((prev) => [...prev, booking])
  }

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)),
    )
  }

  const unreadCount = announcements.filter((a) => !a.isRead).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Campus Connect</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campus..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setActiveTab("announcements")}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <User className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.id === "announcements" && unreadCount > 0 && (
                      <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>

            <div className="p-4 border-t border-gray-200">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === "dashboard" && (
              <Dashboard
                user={currentUser}
                announcements={announcements}
                bookings={bookings.filter((b) => b.status !== "cancelled")}
                onTabChange={setActiveTab}
              />
            )}

            {activeTab === "navigation" && <CampusMap locations={mapLocations} />}

            {activeTab === "bookings" && (
              <VenueBooking
                venues={venues}
                bookings={bookings.filter((b) => b.status !== "cancelled")}
                onBookVenue={handleBookVenue}
                onCancelBooking={handleCancelBooking}
              />
            )}

            {activeTab === "announcements" && (
              <Announcements announcements={announcements} onMarkAsRead={handleMarkAsRead} />
            )}

            {activeTab === "progress" && <AcademicProgress user={currentUser} courses={courses} />}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  )
}

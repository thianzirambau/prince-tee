"use client"

import type React from "react"
import { Clock, ChevronRight, Calendar, Star, BookOpen, Bell } from "lucide-react"
import type { Announcement, Booking, User } from "@/types"

interface DashboardProps {
  user: User
  announcements: Announcement[]
  bookings: Booking[]
  onTabChange: (tab: string) => void
}

export const Dashboard: React.FC<DashboardProps> = ({ user, announcements, bookings, onTabChange }) => {
  const quickStats = [
    { label: "Current GPA", value: user.gpa.toFixed(2), icon: Star, color: "text-blue-600" },
    {
      label: "Credits Completed",
      value: `${user.creditsCompleted}/${user.totalCredits}`,
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      label: "Active Bookings",
      value: bookings.filter((b) => b.status === "confirmed").length.toString(),
      icon: Calendar,
      color: "text-blue-700",
    },
    {
      label: "Unread Alerts",
      value: announcements.filter((a) => !a.isRead).length.toString(),
      icon: Bell,
      color: "text-blue-800",
    },
  ]

  const recentAnnouncements = announcements.slice(0, 3)
  const upcomingBookings = bookings.filter((b) => b.status === "confirmed").slice(0, 2)

  const navigationItems = [
    { id: "navigation", label: "Campus Map", description: "Find your way around campus" },
    { id: "bookings", label: "Venue Booking", description: "Reserve study spaces and facilities" },
    { id: "announcements", label: "Announcements", description: "Stay updated with campus news" },
    { id: "progress", label: "Academic Progress", description: "Track your academic journey" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(" ")[0]}!</h2>
        <p className="text-blue-100 text-lg">Ready to connect with your campus community today?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Announcements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Announcements</h3>
          </div>
          <div className="p-6 space-y-4">
            {recentAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    announcement.priority === "high"
                      ? "bg-red-500"
                      : announcement.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{announcement.title}</p>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {announcement.time}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
            <button
              onClick={() => onTabChange("announcements")}
              className="w-full p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              View all announcements
            </button>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h3>
          </div>
          <div className="p-6 space-y-4">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{booking.venue}</p>
                  <p className="text-sm text-gray-500">
                    {booking.startTime} - {booking.endTime}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
            <button
              onClick={() => onTabChange("bookings")}
              className="w-full p-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              + Book a new venue
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group text-left"
          >
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.label}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { Bell, Clock, Filter, Search, ChevronDown, AlertTriangle, Info, CheckCircle } from "lucide-react"
import type { Announcement } from "@/types"

interface AnnouncementsProps {
  announcements: Announcement[]
  onMarkAsRead: (announcementId: string) => void
}

export const Announcements: React.FC<AnnouncementsProps> = ({ announcements, onMarkAsRead }) => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null)

  const categories = ["all", ...Array.from(new Set(announcements.map((a) => a.category)))]
  const priorities = ["all", "high", "medium", "low"]

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesCategory = selectedCategory === "all" || announcement.category === selectedCategory
    const matchesPriority = selectedPriority === "all" || announcement.priority === selectedPriority
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesPriority && matchesSearch
  })

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case "medium":
        return <Info className="w-5 h-5 text-yellow-600" />
      case "low":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      case "low":
        return "border-l-green-500 bg-green-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Academic: "bg-blue-100 text-blue-800",
      "IT Services": "bg-purple-100 text-purple-800",
      Facilities: "bg-green-100 text-green-800",
      "Career Services": "bg-orange-100 text-orange-800",
      Events: "bg-pink-100 text-pink-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Campus Announcements</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority === "all"
                  ? "All Priorities"
                  : `${priority.charAt(0).toUpperCase()}${priority.slice(1)} Priority`}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-600">
            {filteredAnnouncements.length} announcement{filteredAnnouncements.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-white rounded-xl shadow-sm border-l-4 ${getPriorityColor(announcement.priority)} p-6 transition-all hover:shadow-md ${
                !announcement.isRead ? "border-r-4 border-r-blue-500" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getPriorityIcon(announcement.priority)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3
                        className={`text-lg font-semibold ${!announcement.isRead ? "text-gray-900" : "text-gray-700"}`}
                      >
                        {announcement.title}
                      </h3>
                      {!announcement.isRead && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{announcement.time}</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(announcement.category)}`}
                      >
                        {announcement.category}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          announcement.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : announcement.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {announcement.priority} priority
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!announcement.isRead && (
                    <button
                      onClick={() => onMarkAsRead(announcement.id)}
                      className="text-blue-600 text-sm hover:text-blue-700 transition-colors"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setExpandedAnnouncement(expandedAnnouncement === announcement.id ? null : announcement.id)
                    }
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedAnnouncement === announcement.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {expandedAnnouncement === announcement.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{announcement.content}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  )
}

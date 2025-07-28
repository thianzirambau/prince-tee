"use client"

import type React from "react"
import { useState } from "react"
import { BookOpen, TrendingUp, Award, BarChart3 } from "lucide-react"
import type { User, Course } from "@/types"

interface AcademicProgressProps {
  user: User
  courses: Course[]
}

export const AcademicProgress: React.FC<AcademicProgressProps> = ({ user, courses }) => {
  const [selectedSemester, setSelectedSemester] = useState("all")

  const semesters = ["all", ...Array.from(new Set(courses.map((c) => c.semester)))]

  const filteredCourses = courses.filter((course) => selectedSemester === "all" || course.semester === selectedSemester)

  const getGradeColor = (grade: string) => {
    if (grade === "A" || grade === "A+") return "text-green-600 bg-green-100"
    if (grade === "A-" || grade === "B+") return "text-blue-600 bg-blue-100"
    if (grade === "B" || grade === "B-") return "text-yellow-600 bg-yellow-100"
    if (grade === "In Progress") return "text-purple-600 bg-purple-100"
    return "text-gray-600 bg-gray-100"
  }

  const completedCredits = user.creditsCompleted
  const totalCredits = user.totalCredits
  const progressPercentage = (completedCredits / totalCredits) * 100

  const currentSemesterCourses = courses.filter((c) => c.grade === "In Progress")
  const completedCourses = courses.filter((c) => c.grade !== "In Progress")

  const averageProgress =
    currentSemesterCourses.length > 0
      ? currentSemesterCourses.reduce((sum, course) => sum + course.progress, 0) / currentSemesterCourses.length
      : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Academic Progress</h2>
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {semesters.map((semester) => (
            <option key={semester} value={semester}>
              {semester === "all" ? "All Semesters" : semester}
            </option>
          ))}
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current GPA</p>
              <p className="text-3xl font-bold text-blue-600">{user.gpa.toFixed(2)}</p>
            </div>
            <Award className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Credits Progress</p>
              <p className="text-3xl font-bold text-green-600">
                {completedCredits}/{totalCredits}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Courses</p>
              <p className="text-3xl font-bold text-purple-600">{currentSemesterCourses.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
              <p className="text-3xl font-bold text-orange-600">{averageProgress.toFixed(0)}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Semester Courses */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Semester</h3>
          <div className="space-y-4">
            {currentSemesterCourses.length > 0 ? (
              currentSemesterCourses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {course.code} - {course.name}
                      </h4>
                      <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                      <p className="text-sm text-gray-600">{course.credits} credits</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(course.grade)}`}>
                      {course.grade}
                    </span>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Course Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No current courses</p>
              </div>
            )}
          </div>
        </div>

        {/* Academic Summary */}
        <div className="space-y-6">
          {/* Degree Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Degree Progress</h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${progressPercentage * 2.51} 251`}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{Math.round(progressPercentage)}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Completion</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Credits Completed:</span>
                  <span className="font-medium">{completedCredits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Credits Remaining:</span>
                  <span className="font-medium">{totalCredits - completedCredits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Graduation:</span>
                  <span className="font-medium">Spring 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50">
                <Award className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Dean's List</p>
                  <p className="text-xs text-gray-600">Fall 2023</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">CS301 Excellence</p>
                  <p className="text-xs text-gray-600">Perfect Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Course</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Credits</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Grade</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Semester</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Instructor</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{course.code}</p>
                      <p className="text-sm text-gray-600">{course.name}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{course.credits}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(course.grade)}`}>
                      {course.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{course.semester}</td>
                  <td className="py-3 px-4 text-gray-900">{course.instructor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

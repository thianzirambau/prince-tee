export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  gpa: number;
  creditsCompleted: number;
  totalCredits: number;
  avatar?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  isRead: boolean;
}

export interface Booking {
  id: string;
  venue: string;
  venueId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  purpose: string;
  attendees: number;
}

export interface Venue {
  id: string;
  name: string;
  type: 'study-room' | 'conference-hall' | 'lab' | 'auditorium';
  capacity: number;
  location: string;
  amenities: string[];
  available: boolean;
  image?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade: string;
  semester: string;
  instructor: string;
  progress: number;
}

export interface MapLocation {
  id: string;
  name: string;
  type: 'building' | 'facility' | 'parking' | 'dining';
  coordinates: { x: number; y: number };
  description: string;
  hours?: string;
}

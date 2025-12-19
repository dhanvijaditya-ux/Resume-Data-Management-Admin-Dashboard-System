
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum ResumeStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  ARCHIVED = 'archived'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  achievements: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
}

export interface Resume {
  id: string;
  userId: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    summary: string;
  };
  education: Education[];
  experience: Experience[];
  skills: string[];
  certifications: Certification[];
  attachment?: {
    name: string;
    type: string;
    size: number;
    data: string; // Base64 mock
  };
  status: ResumeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string; // User ID
  targetId: string;
  details: string;
  timestamp: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalResumes: number;
  submittedToday: number;
  avgExperienceYears: number;
  skillsData: { name: string; value: number }[];
  submissionsByDay: { day: string; count: number }[];
}

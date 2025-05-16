export type UserRole = 'admin' | 'doctor' | 'staff';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  email?: string;
  address: string;
  emergencyContact: string;
  bloodType?: string;
  healthIssue: string;
  diagnosis: string;
  allergies: string;
  medications: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastUpdatedBy: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'staff';
  department?: string;
  specialization?: string;
  contactNumber?: string;
  isActive: boolean;
  createdAt: string;
}
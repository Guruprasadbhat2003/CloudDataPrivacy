import { createContext, useState, useEffect, ReactNode } from 'react';
import { Patient, StaffMember } from '../types';
import { storage } from '../utils/storage';
import { generateId } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

interface DataContextType {
  patients: Patient[];
  staffMembers: StaffMember[];
  isLoading: boolean;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastUpdatedBy'>) => string;
  updatePatient: (id: string, patientData: Partial<Patient>) => boolean;
  getPatientById: (id: string) => Patient | undefined;
  deletePatient: (id: string) => boolean;
  addStaffMember: (staffMember: Omit<StaffMember, 'id' | 'createdAt' | 'isActive'>) => string;
  updateStaffMember: (id: string, staffData: Partial<StaffMember>) => boolean;
  deleteStaffMember: (id: string) => boolean;
}

const defaultContext: DataContextType = {
  patients: [],
  staffMembers: [],
  isLoading: true,
  addPatient: () => '',
  updatePatient: () => false,
  getPatientById: () => undefined,
  deletePatient: () => false,
  addStaffMember: () => '',
  updateStaffMember: () => false,
  deleteStaffMember: () => false,
};

export const DataContext = createContext<DataContextType>(defaultContext);

export function DataProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load data from localStorage
  useEffect(() => {
    const storedPatients = storage.getItem<Patient[]>('patients', []);
    const storedStaffMembers = storage.getItem<StaffMember[]>('staffMembers', []);
    
    setPatients(storedPatients);
    setStaffMembers(storedStaffMembers);
    setIsLoading(false);
    
    // Initialize demo data if none exists
    if (storedPatients.length === 0) {
      const demoPatients: Patient[] = [
        {
          id: generateId(),
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1985-05-15',
          gender: 'male',
          contactNumber: '555-123-4567',
          email: 'john.doe@example.com',
          address: '123 Main St, Anytown, USA',
          emergencyContact: 'Jane Doe - 555-987-6543',
          bloodType: 'O+',
          healthIssue: 'Heart Disease',
          diagnosis: 'Hypertension, Atrial Fibrillation',
          allergies: 'Penicillin',
          medications: 'Lisinopril 10mg, Warfarin 5mg',
          notes: 'Patient requires monthly follow-up',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'admin',
          lastUpdatedBy: 'admin',
        },
        {
          id: generateId(),
          firstName: 'Mary',
          lastName: 'Smith',
          dateOfBirth: '1990-08-22',
          gender: 'female',
          contactNumber: '555-222-3333',
          email: 'mary.smith@example.com',
          address: '456 Oak Ave, Somewhere, USA',
          emergencyContact: 'Robert Smith - 555-444-5555',
          bloodType: 'A-',
          healthIssue: 'Cancer',
          diagnosis: 'Stage 2 Breast Cancer',
          allergies: 'Sulfa drugs',
          medications: 'Tamoxifen 20mg',
          notes: 'Post-surgery follow-up in 2 weeks',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'admin',
          lastUpdatedBy: 'admin',
        },
        {
          id: generateId(),
          firstName: 'David',
          lastName: 'Johnson',
          dateOfBirth: '1978-11-30',
          gender: 'male',
          contactNumber: '555-666-7777',
          email: 'david.johnson@example.com',
          address: '789 Pine St, Elsewhere, USA',
          emergencyContact: 'Sarah Johnson - 555-888-9999',
          bloodType: 'B+',
          healthIssue: 'Diabetes',
          diagnosis: 'Type 2 Diabetes, Obesity',
          allergies: 'None',
          medications: 'Metformin 1000mg, Glipizide 10mg',
          notes: 'Diet and exercise plan reviewed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'admin',
          lastUpdatedBy: 'admin',
        }
      ];

      setPatients(demoPatients);
      storage.setItem('patients', demoPatients);
    }
    
    if (storedStaffMembers.length === 0) {
      const demoStaffMembers: StaffMember[] = [
        {
          id: generateId(),
          name: 'Dr. Sarah Wilson',
          email: 'sarah.wilson@hospital.com',
          role: 'doctor',
          department: 'Cardiology',
          specialization: 'Interventional Cardiology',
          contactNumber: '555-111-2222',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: generateId(),
          name: 'Dr. Michael Chen',
          email: 'michael.chen@hospital.com',
          role: 'doctor',
          department: 'Oncology',
          specialization: 'Medical Oncology',
          contactNumber: '555-333-4444',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: generateId(),
          name: 'Nurse Jessica Brown',
          email: 'jessica.brown@hospital.com',
          role: 'staff',
          department: 'General Medicine',
          contactNumber: '555-555-6666',
          isActive: true,
          createdAt: new Date().toISOString(),
        }
      ];

      setStaffMembers(demoStaffMembers);
      storage.setItem('staffMembers', demoStaffMembers);
    }
  }, []);

  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastUpdatedBy'>): string => {
    const now = new Date().toISOString();
    const newPatient: Patient = {
      id: generateId(),
      ...patientData,
      createdAt: now,
      updatedAt: now,
      createdBy: user?.id || 'unknown',
      lastUpdatedBy: user?.id || 'unknown',
    };
    
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    storage.setItem('patients', updatedPatients);
    return newPatient.id;
  };

  const updatePatient = (id: string, patientData: Partial<Patient>): boolean => {
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    const updatedPatient = {
      ...patients[index],
      ...patientData,
      updatedAt: new Date().toISOString(),
      lastUpdatedBy: user?.id || 'unknown',
    };
    
    const updatedPatients = [...patients];
    updatedPatients[index] = updatedPatient;
    
    setPatients(updatedPatients);
    storage.setItem('patients', updatedPatients);
    return true;
  };

  const getPatientById = (id: string): Patient | undefined => {
    return patients.find(p => p.id === id);
  };

  const deletePatient = (id: string): boolean => {
    const updatedPatients = patients.filter(p => p.id !== id);
    if (updatedPatients.length === patients.length) return false;
    
    setPatients(updatedPatients);
    storage.setItem('patients', updatedPatients);
    return true;
  };

  const addStaffMember = (staffData: Omit<StaffMember, 'id' | 'createdAt' | 'isActive'>): string => {
    const newStaffMember: StaffMember = {
      id: generateId(),
      ...staffData,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    const updatedStaffMembers = [...staffMembers, newStaffMember];
    setStaffMembers(updatedStaffMembers);
    storage.setItem('staffMembers', updatedStaffMembers);
    return newStaffMember.id;
  };

  const updateStaffMember = (id: string, staffData: Partial<StaffMember>): boolean => {
    const index = staffMembers.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    const updatedStaffMember = {
      ...staffMembers[index],
      ...staffData,
    };
    
    const updatedStaffMembers = [...staffMembers];
    updatedStaffMembers[index] = updatedStaffMember;
    
    setStaffMembers(updatedStaffMembers);
    storage.setItem('staffMembers', updatedStaffMembers);
    return true;
  };

  const deleteStaffMember = (id: string): boolean => {
    const updatedStaffMembers = staffMembers.filter(s => s.id !== id);
    if (updatedStaffMembers.length === staffMembers.length) return false;
    
    setStaffMembers(updatedStaffMembers);
    storage.setItem('staffMembers', updatedStaffMembers);
    return true;
  };

  return (
    <DataContext.Provider value={{
      patients,
      staffMembers,
      isLoading,
      addPatient,
      updatePatient,
      getPatientById,
      deletePatient,
      addStaffMember,
      updateStaffMember,
      deleteStaffMember,
    }}>
      {children}
    </DataContext.Provider>
  );
}
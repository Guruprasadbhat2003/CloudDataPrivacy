import { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LoginCredentials, RegisterData, UserRole } from '../types';
import { storage } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  createStaffAccount: (data: Omit<RegisterData, 'role'> & { role: Exclude<UserRole, 'admin'> }) => Promise<boolean>;
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  createStaffAccount: async () => false,
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = storage.getItem<User | null>('user', null);
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  // Initialize demo users if they don't exist
  useEffect(() => {
    const users = storage.getItem<User[]>('users', []);
    if (users.length === 0) {
      // Create demo users
      const demoUsers = [
        {
          id: generateId(),
          email: 'admin@hospital.com',
          name: 'Admin User',
          role: 'admin' as UserRole,
          password: 'admin123',
          createdAt: new Date().toISOString(),
        },
        {
          id: generateId(),
          email: 'doctor@hospital.com',
          name: 'Dr. Smith',
          role: 'doctor' as UserRole,
          password: 'doctor123',
          createdAt: new Date().toISOString(),
        }
      ];
      
      storage.setItem('users', demoUsers);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setError(null);
    try {
      // Simulate API call
      const users = storage.getItem<(User & { password: string })[]>('users', []);
      
      const matchedUser = users.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );

      if (!matchedUser) {
        setError('Invalid email or password');
        return false;
      }

      // Remove password before storing in context/localStorage
      const { password, ...userWithoutPassword } = matchedUser;
      setUser(userWithoutPassword);
      storage.setItem('user', userWithoutPassword);
      
      return true;
    } catch (err) {
      setError('An error occurred during login');
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setError(null);
    try {
      const users = storage.getItem<(User & { password: string })[]>('users', []);
      
      // Check if email already exists
      if (users.some((u) => u.email === data.email)) {
        setError('Email already in use');
        return false;
      }

      const newUser = {
        id: generateId(),
        email: data.email,
        name: data.name,
        role: data.role,
        password: data.password,
        createdAt: new Date().toISOString(),
      };

      // Save user
      storage.setItem('users', [...users, newUser]);

      // Auto login after register
      const { password, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      storage.setItem('user', userWithoutPassword);
      
      return true;
    } catch (err) {
      setError('An error occurred during registration');
      return false;
    }
  };

  const createStaffAccount = async (data: Omit<RegisterData, 'role'> & { role: Exclude<UserRole, 'admin'> }): Promise<boolean> => {
    setError(null);
    try {
      const users = storage.getItem<(User & { password: string })[]>('users', []);
      
      // Check if email already exists
      if (users.some((u) => u.email === data.email)) {
        setError('Email already in use');
        return false;
      }

      const newUser = {
        id: generateId(),
        email: data.email,
        name: data.name,
        role: data.role,
        password: data.password,
        createdAt: new Date().toISOString(),
      };

      // Save user
      storage.setItem('users', [...users, newUser]);
      
      return true;
    } catch (err) {
      setError('An error occurred while creating account');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    storage.removeItem('user');
    navigate('/');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    createStaffAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
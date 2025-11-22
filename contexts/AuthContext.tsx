
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProgress } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  progress: UserProgress;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateProgress: (moduleId: string, score?: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<UserProgress>({
    userId: '',
    completedModules: [],
    quizScores: {},
    currentModuleId: 'cover',
    currentUnitIndex: 0
  });

  // Load user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('bm_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      loadProgress(parsedUser.id);
    }
    setLoading(false);
  }, []);

  const loadProgress = (userId: string) => {
    const storedProgress = localStorage.getItem(`bm_progress_${userId}`);
    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    } else {
      // Initialize new progress
      const newProgress: UserProgress = {
        userId,
        completedModules: [],
        quizScores: {},
        currentModuleId: 'cover',
        currentUnitIndex: 0
      };
      setProgress(newProgress);
      localStorage.setItem(`bm_progress_${userId}`, JSON.stringify(newProgress));
    }
  };

  const login = async (email: string, pass: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const storedUsers = JSON.parse(localStorage.getItem('bm_users_db') || '[]');
        const foundUser = storedUsers.find((u: User) => u.email === email && u.password === pass);
        
        if (foundUser) {
          const { password, ...safeUser } = foundUser;
          setUser(safeUser as User);
          localStorage.setItem('bm_user', JSON.stringify(safeUser));
          loadProgress(safeUser.id);
          resolve();
        } else {
          reject(new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة'));
        }
      }, 800); // Fake delay
    });
  };

  const signup = async (name: string, email: string, pass: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const storedUsers = JSON.parse(localStorage.getItem('bm_users_db') || '[]');
        
        if (storedUsers.find((u: User) => u.email === email)) {
            reject(new Error('البريد الإلكتروني مسجل مسبقاً'));
            return;
        }

        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          password: pass, // In real app, hash this!
          createdAt: new Date().toISOString()
        };

        storedUsers.push(newUser);
        localStorage.setItem('bm_users_db', JSON.stringify(storedUsers));
        
        // Auto login
        const { password, ...safeUser } = newUser;
        setUser(safeUser);
        localStorage.setItem('bm_user', JSON.stringify(safeUser));
        loadProgress(safeUser.id);
        resolve();
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bm_user');
    setProgress({
        userId: '',
        completedModules: [],
        quizScores: {},
        currentModuleId: 'cover',
        currentUnitIndex: 0
    });
  };

  const updateProgress = (moduleId: string, score?: number) => {
    if (!user) return;
    
    setProgress(prev => {
      const newCompleted = prev.completedModules.includes(moduleId) 
        ? prev.completedModules 
        : [...prev.completedModules, moduleId];
      
      const newScores = score !== undefined 
        ? { ...prev.quizScores, [moduleId]: score }
        : prev.quizScores;

      const newProgress = {
        ...prev,
        completedModules: newCompleted,
        quizScores: newScores
      };
      
      localStorage.setItem(`bm_progress_${user.id}`, JSON.stringify(newProgress));
      return newProgress;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, progress, login, signup, logout, updateProgress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

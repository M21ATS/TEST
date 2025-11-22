
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProgress } from '../types';
import { auth, db } from '../firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';

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

  // Listen to Firebase Auth State Changes (Real-time)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const mappedUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
        };
        setUser(mappedUser);
        await loadProgress(firebaseUser.uid);
      } else {
        // User is signed out
        setUser(null);
        setProgress({
            userId: '',
            completedModules: [],
            quizScores: {},
            currentModuleId: 'cover',
            currentUnitIndex: 0
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadProgress = async (userId: string) => {
    try {
      const docRef = doc(db, "progress", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProgress(docSnap.data() as UserProgress);
      } else {
        // Initialize new progress in Cloud Firestore
        const newProgress: UserProgress = {
          userId,
          completedModules: [],
          quizScores: {},
          currentModuleId: 'cover',
          currentUnitIndex: 0
        };
        await setDoc(docRef, newProgress);
        setProgress(newProgress);
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (name: string, email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    // Update the display name immediately
    await updateProfile(userCredential.user, {
        displayName: name
    });
    
    // Create initial progress document
    const newProgress: UserProgress = {
        userId: userCredential.user.uid,
        completedModules: [],
        quizScores: {},
        currentModuleId: 'cover',
        currentUnitIndex: 0
    };
    await setDoc(doc(db, "progress", userCredential.user.uid), newProgress);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateProgress = async (moduleId: string, score?: number) => {
    if (!auth.currentUser) return;
    
    const userId = auth.currentUser.uid;
    const docRef = doc(db, "progress", userId);

    // Calculate new state locally first for immediate UI update
    const newCompleted = progress.completedModules.includes(moduleId) 
        ? progress.completedModules 
        : [...progress.completedModules, moduleId];
      
    const newScores = score !== undefined 
        ? { ...progress.quizScores, [moduleId]: score }
        : progress.quizScores;

    const newProgressState = {
        ...progress,
        completedModules: newCompleted,
        quizScores: newScores
    };

    // Update UI
    setProgress(newProgressState);

    // Sync to Cloud
    await updateDoc(docRef, {
        completedModules: newCompleted,
        quizScores: newScores
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

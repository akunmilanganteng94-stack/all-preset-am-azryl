import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile } from '../types';
import { saveUserProfile } from '../services/userService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (nama: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  makeMeAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Configure persistent auth
  useEffect(() => {
    try {
      setPersistence(auth, browserLocalPersistence);
    } catch (e) {
      console.warn('Error setting auth persistence:', e);
    }
  }, []);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Realtime listener on user profile in Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        unsubscribeSnapshot = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile(docSnap.data() as UserProfile);
            } else {
              // Create default profile if not present
              const initialProfile: UserProfile = {
                uid: currentUser.uid,
                nama: currentUser.displayName || currentUser.email?.split('@')[0] || 'Editor AM',
                email: currentUser.email || '',
                role: 'user',
                status: 'active',
                createdAt: Date.now(),
              };
              saveUserProfile(initialProfile).catch(console.error);
              setUserProfile(initialProfile);
            }
            setLoading(false);
          },
          (error) => {
            console.warn('User profile listener error:', error);
            setUserProfile({
              uid: currentUser.uid,
              nama: currentUser.displayName || currentUser.email?.split('@')[0] || 'Editor AM',
              email: currentUser.email || '',
              role: 'user',
              status: 'active',
              createdAt: Date.now(),
            });
            setLoading(false);
          }
        );
      } else {
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const register = async (nama: string, email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser = userCredential.user;

    const newProfile: UserProfile = {
      uid: newUser.uid,
      nama: nama.trim(),
      email: email.trim().toLowerCase(),
      role: 'user', // Default role
      status: 'active',
      createdAt: Date.now(),
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nama)}`,
    };

    await saveUserProfile(newProfile);
    setUserProfile(newProfile);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const makeMeAdmin = async () => {
    if (!user || !userProfile) return;
    const updated: UserProfile = {
      ...userProfile,
      role: 'admin',
    };
    await saveUserProfile(updated);
    setUserProfile(updated);
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAdmin,
        login,
        register,
        logout,
        makeMeAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
  }

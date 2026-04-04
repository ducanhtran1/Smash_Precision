import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from '@/src/lib/firebase';
import { UserProfile } from '@/src/types';

interface AuthContextType {
  user: any | null; // Can be FirebaseUser or standard user object
  profile: UserProfile | null;
  loading: boolean;
  isAuthReady: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthReady: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Helper to fetch backend user
  const fetchBackendProfile = async (token: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        // Note: You can sync PostgreSQL custom profile here instead of Firestore
        setProfile({
          uid: data.id,
          email: data.email,
          displayName: data.displayName || '',
          photoURL: data.photoUrl || '',
          preferences: { theme: 'stark', currency: 'USD', units: 'MET' }
        });
        setIsAuthReady(true);
        setLoading(false);
      } else {
        localStorage.removeItem('token');
        setIsAuthReady(true);
        setLoading(false);
      }
    } catch (e) {
      setIsAuthReady(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Check local JWT
    const token = localStorage.getItem('token');
    if (token) {
      fetchBackendProfile(token);
      return; 
    }

    // 2. Fallback to Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (localStorage.getItem('token')) return; // handled above

      setUser(firebaseUser);
      if (firebaseUser) {
        // Sync profile
        const userDoc = doc(db, 'users', firebaseUser.uid);
        const unsubProfile = onSnapshot(userDoc, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Create initial profile
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              preferences: {
                theme: 'stark',
                currency: 'USD',
                units: 'MET'
              }
            };
            setDoc(userDoc, newProfile);
            setProfile(newProfile);
          }
          setLoading(false);
          setIsAuthReady(true);
        }, (error) => {
          console.error("Profile snapshot error", error);
          setLoading(false);
          setIsAuthReady(true);
        });
        return () => unsubProfile();
      } else {
        setProfile(null);
        setLoading(false);
        setIsAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    if (!res.ok) {
      throw new Error('Invalid email or password');
    }
    const data = await res.json();
    localStorage.setItem('token', data.access_token);
    await fetchBackendProfile(data.access_token);
  };

  const register = async (email: string, pass: string, displayName: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass, displayName })
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    const data = await res.json();
    localStorage.setItem('token', data.access_token);
    await fetchBackendProfile(data.access_token);
  };

  const localLogout = async () => {
    localStorage.removeItem('token');
    await auth.signOut(); // logout from Firebase too
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAuthReady, login, register, logout: localLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);

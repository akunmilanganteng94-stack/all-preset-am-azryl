import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { UserProfile } from '../types';

// Get single user profile
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = doc(db, 'users', uid);
    const snap = await getDoc(userDoc);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
}

// Create or update user profile upon login / registration
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const userDoc = doc(db, 'users', profile.uid);
  await setDoc(userDoc, profile, { merge: true });
}

// Subscribe to all users (for Admin User Management)
export function subscribeToAllUsers(callback: (users: UserProfile[]) => void) {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const users: UserProfile[] = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as UserProfile[];
      callback(users);
    },
    (err) => {
      console.warn('Users subscription error:', err);
      callback([]);
    }
  );
}

// Admin update user role
export async function updateUserRole(uid: string, newRole: 'admin' | 'user'): Promise<void> {
  const userDoc = doc(db, 'users', uid);
  await updateDoc(userDoc, {
    role: newRole,
  });
}

// Admin toggle user status (active / banned)
export async function updateUserStatus(uid: string, newStatus: 'active' | 'banned'): Promise<void> {
  const userDoc = doc(db, 'users', uid);
  await updateDoc(userDoc, {
    status: newStatus,
  });
}

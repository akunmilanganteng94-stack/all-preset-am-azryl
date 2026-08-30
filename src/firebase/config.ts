import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration provided by Azryl
export const firebaseConfig = {
  apiKey: "AIzaSyCbP4kqlIUGcUnsPORIUcVHyQW_SauLayE",
  authDomain: "all-preset-azryl.firebaseapp.com",
  projectId: "all-preset-azryl",
  storageBucket: "all-preset-azryl.firebasestorage.app",
  messagingSenderId: "499912003215",
  appId: "1:499912003215:web:74809c5050b345addd6afa",
  measurementId: "G-H7TYPRBQY1"
};

// Initialize Firebase modular instance safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

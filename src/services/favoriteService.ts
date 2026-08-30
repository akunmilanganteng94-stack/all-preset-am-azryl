import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Subscribe to a user's favorited preset IDs
export function subscribeToUserFavorites(uid: string, callback: (favoriteIds: string[]) => void) {
  if (!uid) {
    callback([]);
    return () => {};
  }

  const favoritesRef = collection(db, 'users', uid, 'favorites');
  return onSnapshot(
    favoritesRef,
    (snapshot) => {
      const ids = snapshot.docs.map((doc) => doc.id);
      callback(ids);
    },
    (error) => {
      console.warn('Favorites subscription error:', error);
      callback([]);
    }
  );
}

// Toggle favorite state
export async function toggleFavorite(uid: string, presetId: string, isCurrentlyFavorited: boolean): Promise<boolean> {
  if (!uid || !presetId) return false;

  const favDoc = doc(db, 'users', uid, 'favorites', presetId);

  if (isCurrentlyFavorited) {
    await deleteDoc(favDoc);
    return false;
  } else {
    await setDoc(favDoc, {
      presetId,
      addedAt: Date.now(),
    });
    return true;
  }
}

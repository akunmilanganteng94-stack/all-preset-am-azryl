import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { PresetReview } from '../types';

// Subscribe to reviews for a specific preset
export function subscribeToPresetReviews(presetId: string, callback: (reviews: PresetReview[]) => void) {
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, where('presetId', '==', presetId), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const reviews: PresetReview[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PresetReview[];
      callback(reviews);
    },
    (err) => {
      console.warn('Reviews subscription error:', err);
      callback([]);
    }
  );
}

// Subscribe to all reviews (for Admin moderation and Reviews page)
export function subscribeToAllReviews(callback: (reviews: PresetReview[]) => void) {
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const reviews: PresetReview[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PresetReview[];
      callback(reviews);
    },
    (err) => {
      console.warn('All reviews subscription error:', err);
      callback([]);
    }
  );
}

// Add a review and automatically recalculate the preset rating and reviewCount in Firestore
export async function addPresetReview(
  presetId: string,
  presetName: string,
  uid: string,
  userName: string,
  userPhoto: string | undefined,
  rating: number,
  comment: string
): Promise<string> {
  const reviewsRef = collection(db, 'reviews');
  const newReviewDoc = doc(reviewsRef);

  const newReview: Omit<PresetReview, 'id'> = {
    presetId,
    presetName,
    uid,
    userName,
    userPhoto: userPhoto || '',
    rating: Math.max(1, Math.min(5, Number(rating))),
    comment: comment.trim(),
    createdAt: Date.now(),
  };

  await setDoc(newReviewDoc, newReview);

  // Recalculate average rating for this preset
  await updatePresetRatingSummary(presetId);

  return newReviewDoc.id;
}

// Delete review (by Author or Admin)
export async function deletePresetReview(reviewId: string, presetId: string): Promise<void> {
  const reviewDoc = doc(db, 'reviews', reviewId);
  await deleteDoc(reviewDoc);
  if (presetId) {
    await updatePresetRatingSummary(presetId);
  }
}

// Recalculate average rating and total reviewCount from Firestore
export async function updatePresetRatingSummary(presetId: string): Promise<void> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('presetId', '==', presetId));
    const snapshot = await getDocs(q);

    const presetDoc = doc(db, 'presets', presetId);
    if (snapshot.empty) {
      await setDoc(
        presetDoc,
        {
          rating: 5.0,
          reviewCount: 0,
        },
        { merge: true }
      );
      return;
    }

    let totalScore = 0;
    snapshot.docs.forEach((d) => {
      const data = d.data();
      totalScore += Number(data.rating) || 5;
    });

    const avg = Number((totalScore / snapshot.docs.length).toFixed(1));
    await setDoc(
      presetDoc,
      {
        rating: avg,
        reviewCount: snapshot.docs.length,
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Handled preset rating summary update:', error);
  }
}

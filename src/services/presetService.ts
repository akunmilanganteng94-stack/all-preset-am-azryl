import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  query,
  orderBy,
  getDocs,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { Preset, PresetCategory, PresetFormat } from '../types';

export const INITIAL_PRESETS: Omit<Preset, 'id'>[] = [
  {
    name: 'Velocity Smooth Flow 4K',
    description: 'Preset Velocity ultra-smooth dengan transisi optical flow dan motion blur halus untuk jedag-jedug AM aesthetic.',
    category: 'Velocity',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    fileUrl: 'https://raw.githubusercontent.com/azryl-am/presets/main/sample/Velocity_Smooth_Flow_Azryl.xml',
    xmlUrl: 'https://raw.githubusercontent.com/azryl-am/presets/main/sample/Velocity_Smooth_Flow_Azryl.xml',
    fiveMbUrl: 'https://alight.link/AzrylVelocitySmooth4K',
    videoReviewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-at-night-41584-large.mp4',
    fileName: 'Velocity_Smooth_Flow_Azryl.xml',
    fileSize: '4.2 MB',
    format: 'XML',
    version: 'v4.0.4+',
    creator: 'Azryl AM',
    downloads: 1420,
    rating: 4.9,
    reviewCount: 38,
    tags: ['Velocity', 'Smooth', 'JedagJedug', '4K', 'CC'],
    createdAt: Date.now() - 86400000 * 2,
    featured: true,
  },
  {
    name: 'Mega Shake Flash Impact',
    description: 'Koleksi shake guncangan keras dengan efek invert flash, rgb split dan glow neon untuk beat drop yang bertenaga.',
    category: 'Shake',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    fileUrl: 'https://raw.githubusercontent.com/azryl-am/presets/main/sample/Mega_Shake_Impact_Azryl.xml',
    xmlUrl: 'https://raw.githubusercontent.com/azryl-am/presets/main/sample/Mega_Shake_Impact_Azryl.xml',
    fiveMbUrl: 'https://alight.link/AzrylMegaShakeImpact',
    videoReviewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-futuristic-neon-lights-41582-large.mp4',
    fileName: 'Mega_Shake_Impact_Azryl.xml',
    fileSize: '3.8 MB',
    format: 'XML',
    version: 'All Version',
    creator: 'Azryl AM',
    downloads: 980,
    rating: 4.8,
    reviewCount: 24,
    tags: ['Shake', 'BeatDrop', 'Impact', 'Flash'],
    createdAt: Date.now() - 86400000 * 4,
    featured: true,
  },
  {
    name: 'Cinematic Cyberpunk CC Blue-Cyan',
    description: 'Color grading cinematic futuristik dengan nuansa deep dark navy, electric blue neon, dan highlight cyan tajem.',
    category: 'CC',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
    fileUrl: 'https://raw.githubusercontent.com/azryl-am/presets/main/sample/Cyberpunk_CC_Azryl.xml',
    xmlUrl: 'https://raw.githubusercontent.com/azryl-am/presets/main/sample/Cyberpunk_CC_Azryl.xml',
    fiveMbUrl: 'https://alight.link/AzrylCyberpunkCC',
    videoReviewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-driving-through-a-futuristic-city-at-night-41586-large.mp4',
    fileName: 'Cyberpunk_CC_Azryl.xml',
    fileSize: '2.1 MB',
    format: 'XML',
    version: 'v4.0+',
    creator: 'Azryl AM',
    downloads: 2150,
    rating: 5.0,
    reviewCount: 52,
    tags: ['CC', 'Cinematic', 'Cyberpunk', 'BlueTone'],
    createdAt: Date.now() - 86400000 * 5,
    featured: true,
  },
  {
    name: '3D Cube Smooth Zoom Transition',
    description: 'Transisi 3D Cube flip dengan depth blur dan smooth easing kustom. Sangat cocok untuk transisi video TikTok dan Reels.',
    category: 'Transisi',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    fileUrl: 'https://raw.githubusercontent.com/azryl-am/presets/main/sample/3D_Cube_Transition_Azryl.zip',
    xmlUrl: 'https://raw.githubusercontent.com/azryl-am/presets/main/sample/3D_Cube_Transition_Azryl.xml',
    fiveMbUrl: 'https://alight.link/Azryl3DCubeTransition',
    videoReviewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1610-large.mp4',
    fileName: '3D_Cube_Transition_Azryl.zip',
    fileSize: '6.5 MB',
    format: 'ZIP',
    version: 'v4.2.0+',
    creator: 'Azryl AM',
    downloads: 870,
    rating: 4.7,
    reviewCount: 19,
    tags: ['3D', 'Transisi', 'Zoom', 'Reels'],
    createdAt: Date.now() - 86400000 * 7,
    featured: false,
  },
  {
    name: 'Glow Neon Text Motion Typography',
    description: 'Animasi teks tipografi kinetic dengan efek glow neon pulsing, bounce text dan glitch ringan.',
    category: 'Typography',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    fileUrl: 'https://raw.githubusercontent.com/azryl-am/presets/main/sample/Neon_Typography_Azryl.xml',
    xmlUrl: 'https://raw.githubusercontent.com/azryl-am/presets/main/sample/Neon_Typography_Azryl.xml',
    fiveMbUrl: 'https://alight.link/AzrylNeonTypography',
    videoReviewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-charts-and-data-31912-large.mp4',
    fileName: 'Neon_Typography_Azryl.xml',
    fileSize: '3.0 MB',
    format: 'XML',
    version: 'All Version',
    creator: 'Azryl AM',
    downloads: 1640,
    rating: 4.9,
    reviewCount: 41,
    tags: ['Typography', 'Lirik', 'Glow', 'Kinetic'],
    createdAt: Date.now() - 86400000 * 10,
    featured: true,
  },
  {
    name: 'AMV Beat Sync Anime Flash',
    description: 'Sinkronisasi beat audio anime dengan split screen, chromatic aberration dan warp wave distorsi.',
    category: 'AMV',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    fileUrl: 'https://raw.githubusercontent.com/azryl-am/presets/main/sample/AMV_BeatSync_Azryl.xml',
    xmlUrl: 'https://raw.githubusercontent.com/azryl-am/presets/main/sample/AMV_BeatSync_Azryl.xml',
    fiveMbUrl: 'https://alight.link/AzrylAMVBeatSync',
    videoReviewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-laser-lights-moving-in-a-dark-room-41580-large.mp4',
    fileName: 'AMV_BeatSync_Azryl.xml',
    fileSize: '5.4 MB',
    format: 'XML',
    version: 'v4.1.0+',
    creator: 'Azryl AM',
    downloads: 1290,
    rating: 4.8,
    reviewCount: 33,
    tags: ['AMV', 'Anime', 'BeatSync', 'Viral'],
    createdAt: Date.now() - 86400000 * 12,
    featured: false,
  }
];

// Subscribe to real-time presets from Firestore
export function subscribeToPresets(callback: (presets: Preset[]) => void, onError?: (error: Error) => void) {
  const presetsRef = collection(db, 'presets');
  const q = query(presetsRef, orderBy('createdAt', 'desc'));

  // Automatically attempt background seed if empty
  seedPresetsToFirestore().catch(() => {});

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // If Firestore is empty, auto-populate sample presets with deterministic IDs
        const initialWithIds = INITIAL_PRESETS.map((p, idx) => ({
          id: `preset_init_${idx + 1}`,
          ...p,
        }));
        callback(initialWithIds);
      } else {
        const presets: Preset[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Preset[];
        callback(presets);
      }
    },
    (err) => {
      console.warn('Firestore real-time subscription note:', err);
      if (onError) onError(err);
    }
  );
}

// Subscribe to a single preset
export function subscribeToPreset(presetId: string, callback: (preset: Preset | null) => void) {
  const presetDoc = doc(db, 'presets', presetId);
  return onSnapshot(presetDoc, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() } as Preset);
    } else {
      // Check if it matches an initial fallback preset
      const initIdx = presetId.startsWith('preset_init_')
        ? parseInt(presetId.replace('preset_init_', ''), 10) - 1
        : -1;
      if (initIdx >= 0 && INITIAL_PRESETS[initIdx]) {
        callback({
          id: presetId,
          ...INITIAL_PRESETS[initIdx],
        } as Preset);
      } else {
        callback(null);
      }
    }
  });
}

// Seed initial presets into Firestore if needed
export async function seedPresetsToFirestore() {
  try {
    const presetsRef = collection(db, 'presets');
    const existing = await getDocs(presetsRef);
    if (existing.empty) {
      for (let i = 0; i < INITIAL_PRESETS.length; i++) {
        const p = INITIAL_PRESETS[i];
        const docRef = doc(db, 'presets', `preset_init_${i + 1}`);
        await setDoc(docRef, {
          ...p,
          createdAt: Date.now() - (INITIAL_PRESETS.length - i) * 86400000,
        });
      }
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Auto-seed presets info:', err);
    return false;
  }
}

// Add new preset
export async function addPreset(preset: Omit<Preset, 'id'>): Promise<string> {
  const presetsRef = collection(db, 'presets');
  const newDoc = doc(presetsRef);
  await setDoc(newDoc, {
    ...preset,
    downloads: Number(preset.downloads) || 0,
    rating: Number(preset.rating) || 5.0,
    reviewCount: Number(preset.reviewCount) || 0,
    createdAt: Date.now(),
  });
  return newDoc.id;
}

// Update preset
export async function updatePreset(presetId: string, data: Partial<Preset>): Promise<void> {
  const presetDoc = doc(db, 'presets', presetId);
  await setDoc(
    presetDoc,
    {
      ...data,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

// Delete preset
export async function deletePreset(presetId: string): Promise<void> {
  const presetDoc = doc(db, 'presets', presetId);
  await deleteDoc(presetDoc);
}

// Increment download count (safe against unseeded or missing documents)
export async function incrementDownloadCount(presetId: string): Promise<void> {
  try {
    const presetDoc = doc(db, 'presets', presetId);
    const snap = await getDoc(presetDoc);
    
    if (snap.exists()) {
      await updateDoc(presetDoc, {
        downloads: increment(1),
      });
    } else {
      // If doc doesn't exist in Firestore yet, find from INITIAL_PRESETS and create it
      const initIdx = presetId.startsWith('preset_init_')
        ? parseInt(presetId.replace('preset_init_', ''), 10) - 1
        : -1;
      const initialData = initIdx >= 0 && INITIAL_PRESETS[initIdx] ? INITIAL_PRESETS[initIdx] : null;

      if (initialData) {
        await setDoc(
          presetDoc,
          {
            ...initialData,
            downloads: (initialData.downloads || 0) + 1,
            createdAt: Date.now(),
          },
          { merge: true }
        );
      } else {
        await setDoc(
          presetDoc,
          {
            downloads: increment(1),
          },
          { merge: true }
        );
      }
    }
  } catch (error) {
    console.warn('Safe increment download handled:', error);
  }
}

// Upload file to Firebase Storage with progress tracking and fallback
export async function uploadFileToStorage(
  file: File,
  folder: 'presets' | 'thumbnails' | 'videos',
  onProgress?: (progress: number) => void
): Promise<{ url: string; fileName: string; fileSize: string }> {
  const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const storageRef = ref(storage, `${folder}/${cleanName}`);

  const fileSize = formatBytes(file.size);

  try {
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => {
          console.warn('Storage upload error, using object URL fallback:', error);
          // Fallback to safe data url / link if storage permissions are restricted
          const fallbackUrl = URL.createObjectURL(file);
          resolve({
            url: fallbackUrl,
            fileName: file.name,
            fileSize,
          });
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              url: downloadUrl,
              fileName: file.name,
              fileSize,
            });
          } catch (e) {
            const fallbackUrl = URL.createObjectURL(file);
            resolve({
              url: fallbackUrl,
              fileName: file.name,
              fileSize,
            });
          }
        }
      );
    });
  } catch (err) {
    // Local fallback
    const fallbackUrl = URL.createObjectURL(file);
    return {
      url: fallbackUrl,
      fileName: file.name,
      fileSize,
    };
  }
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 KB';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

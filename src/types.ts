export interface UserProfile {
  uid: string;
  nama: string;
  email: string;
  role: 'user' | 'admin';
  photoURL?: string;
  status: 'active' | 'banned';
  createdAt: number;
  lastLoginAt?: number;
}

export type PresetCategory =
  | 'Velocity'
  | 'Shake'
  | 'Transisi'
  | 'CC'
  | 'Effect'
  | 'Typography'
  | 'Beat'
  | 'Slowmo'
  | 'AMV'
  | 'Viral'
  | 'Lainnya';

export type PresetFormat = 'XML' | 'ZIP' | 'AM Package' | 'Project File' | 'Link AM';

export interface Preset {
  id: string;
  name: string;
  description: string;
  category: PresetCategory;
  thumbnailUrl: string;
  fileUrl: string;
  fileName: string;
  fileSize: string; // e.g. "4.8 MB" or "850 KB"
  format: PresetFormat;
  version: string; // e.g. "v4.2.0+", "All Version"
  creator: string;
  downloads: number;
  rating: number; // average rating (1-5)
  reviewCount: number;
  tags: string[];
  createdAt: number;
  updatedAt?: number;
  featured?: boolean;
  xmlUrl?: string; // Link / URL Khusus File XML
  fiveMbUrl?: string; // Link Alight Motion / Preset 5MB
  videoReviewUrl?: string; // Link Vidio Review / Preview (YouTube, MP4, TikTok, GDrive)
}

export interface PresetReview {
  id: string;
  presetId: string;
  presetName?: string;
  uid: string;
  userName: string;
  userPhoto?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: number;
}

export interface UserFavorite {
  presetId: string;
  addedAt: number;
}

export type ActiveTab = 'home' | 'presets' | 'reviews' | 'dashboard' | 'favorites' | 'profile' | 'admin';

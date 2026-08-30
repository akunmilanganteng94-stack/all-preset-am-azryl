export const FIRESTORE_SECURITY_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if the current user is an admin
    function isAdmin() {
      return isAuthenticated() && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         request.auth.token.admin == true);
    }
    
    // Helper function to check ownership
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // 1. Users collection
    match /users/{userId} {
      // Anyone logged in can read basic profile; owners can read their own
      allow read: if isAuthenticated();
      // Users can create their own profile upon registration
      allow create: if isOwner(userId);
      // Users can update their own non-role fields; Admins can update anything (including role/status)
      allow update: if isOwner(userId) && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']))
                    || isAdmin();
      allow delete: if isAdmin();
      
      // Favorites subcollection inside user
      match /favorites/{presetId} {
        allow read, write: if isOwner(userId) || isAdmin();
      }
    }

    // 2. Presets collection
    match /presets/{presetId} {
      // Public read access for all visitors
      allow read: if true;
      // Only admins can create, update, delete presets
      // Authenticated users can increment download count or update rating metadata
      allow create, delete: if isAdmin();
      allow update: if isAdmin() || (isAuthenticated() && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['downloads', 'rating', 'reviewCount']));
    }

    // 3. Reviews collection
    match /reviews/{reviewId} {
      // Anyone can read reviews
      allow read: if true;
      // Authenticated users can write a review where uid matches
      allow create: if isAuthenticated() && request.resource.data.uid == request.auth.uid;
      // Authors can edit/delete their own review, admins can delete any review
      allow update, delete: if (isAuthenticated() && resource.data.uid == request.auth.uid) || isAdmin();
    }
    
    // 4. Settings / Metadata
    match /settings/{settingId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}`;

export const FIREBASE_STORAGE_RULES = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Presets & Thumbnails folder
    match /presets/{allPaths=**} {
      // Only authenticated users can download
      allow read: if request.auth != null;
      // Only admins can upload/delete
      allow write: if request.auth != null;
    }
    match /thumbnails/{allPaths=**} {
      // Thumbnails are publicly viewable
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`;

import { Timestamp } from 'firebase/firestore';

export interface Vendor {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string;   // base64 data URL
  bannerImageUrl: string;    // base64 data URL
  description: string;
  shopName: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  likedBy: string[];  // client ids
  favoriteVendors: string[];
  averageRating: number;
  ratingsCount: number;
  createdAt: number;         // Date.now()
}

export interface Client {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string;   // base64 data URL
  bannerImageUrl: string;    // base64 data URL
  favoriteVendors: string[];
  reviewIds: string[];
  createdAt: number;         // Date.now()
}

export interface Review {
  id: string;
  vendorId: string;
  clientId: string;
  rating: number;
  comment: string;
  createdAt: Timestamp | Date;
}


// Un review enrichi avec les infos utilisateur
export interface ReviewWithUser extends Review {
  user?: {
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
  } | null;
}


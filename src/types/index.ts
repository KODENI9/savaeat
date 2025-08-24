import { Timestamp } from 'firebase/firestore';

export interface Vendor {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string;   // base64 data URL
  bannerImageUrl: string;    // base64 data URL
  shopName: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  likedByClients: string[];  // client ids
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
  favoriteVendorIds: string[];
  reviewIds: string[];
  createdAt: number;         // Date.now()
}

export interface Review {
  id: string;
  vendorId: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  createdAt: Timestamp | Date;
}

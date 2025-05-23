
import { UserProfile } from '@/types/userProfile';

// Type definitions for friend requests and friends
export interface FriendRequest {
  id: string;
  name: string;
  userId: string;
  avatarUrl: string | null;
}

export interface Friend {
  id: string;
  userId: string;
  name: string;
  weeklyPoints: number;
  avatarUrl: string | null;
}

export interface SearchUserResult {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  email?: string; // Added email field as optional to fix AddFriendDialog.tsx
}

export interface InviteShareOptions {
  url: string;
  isOpen: boolean;
}

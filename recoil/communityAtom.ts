import { Timestamp } from 'firebase/firestore';
import { atom } from 'recoil';

export interface Community {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: 'public' | 'restricted' | 'private';
  createdAt: Timestamp;
  imageUrl?: string;
}

export interface CommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageUrl?: string;
}

export interface CommunityState {
  mySnippets: CommunitySnippet[];
  // visitedCommunities:
}

export const defaultCommunityState: CommunityState = {
  mySnippets: [],
};

export const communityState = atom<CommunityState>({
  key: 'communityState',
  default: defaultCommunityState,
});

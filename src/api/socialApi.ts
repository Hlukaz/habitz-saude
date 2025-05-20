
import { FriendRank } from '@/types/activityTypes';

// Fetch friend rankings (mock data for now)
export const fetchFriendRanking = async (userId: string): Promise<FriendRank[]> => {
  return [{
    id: 'user-2',
    name: 'Ana Silva',
    points: 7,
    position: 1,
    positionChange: 'up',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman'
  }, {
    id: userId,
    name: 'Você',
    points: 5,
    position: 2,
    positionChange: 'same',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?person'
  }, {
    id: 'user-3',
    name: 'Carlos Gomes',
    points: 4,
    position: 3,
    positionChange: 'down',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man'
  }, {
    id: 'user-4',
    name: 'Patricia Lima',
    points: 3,
    position: 4,
    positionChange: 'up',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman,2'
  }, {
    id: 'user-5',
    name: 'Marcelo Costa',
    points: 2,
    position: 5,
    positionChange: 'down',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,2'
  }];
};


import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '@/api/profileDataApi';
import { fetchUserAchievements } from '@/api/achievementsApi';

// Custom hook for user profile data
export const useProfileData = (userId: string | undefined) => {
  const { 
    data: profile, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => userId ? fetchUserProfile(userId) : Promise.reject('Usuário não autenticado'),
    enabled: !!userId
  });

  const { 
    data: achievements = [],
    isLoading: isLoadingAchievements,
    error: achievementsError
  } = useQuery({
    queryKey: ['userAchievements', userId],
    queryFn: () => userId ? fetchUserAchievements(userId) : Promise.reject('Usuário não autenticado'),
    enabled: !!userId
  });

  return {
    profile,
    isLoading: isLoading || isLoadingAchievements,
    error: error || achievementsError,
    achievements
  };
};

// Re-export the API functions for backward compatibility
export { fetchProfiles, fetchUserProfile } from '@/api/profileDataApi';
export { fetchUserAchievements } from '@/api/achievementsApi';

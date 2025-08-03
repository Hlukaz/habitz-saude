
import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '@/api/profileDataApi';

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

  return {
    profile,
    isLoading,
    error
  };
};

// Re-export the API functions for backward compatibility
export { fetchProfiles, fetchUserProfile } from '@/api/profileDataApi';

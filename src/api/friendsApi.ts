
import { supabase } from '@/integrations/supabase/client';
import { FriendRequest, Friend, SearchUserResult } from '@/types/friendTypes';

// Function to fetch friend requests
export const fetchFriendRequests = async (userId: string): Promise<FriendRequest[]> => {
  const { data, error } = await supabase
    .from('friend_requests')
    .select(`
      id,
      sender_id,
      receiver_id
    `)
    .eq('receiver_id', userId)
    .eq('status', 'pending');
    
  if (error) throw error;
  
  // Now fetch the sender details for each request
  const requests: FriendRequest[] = [];
  
  for (const request of data) {
    const { data: senderData, error: senderError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .eq('id', request.sender_id)
      .single();
      
    if (senderError) continue;
    
    requests.push({
      id: request.id,
      name: senderData.full_name || senderData.username,
      userId: senderData.id,
      avatarUrl: senderData.avatar_url
    });
  }
  
  return requests;
};

// Function to fetch friends
export const fetchFriends = async (userId: string): Promise<Friend[]> => {
  const { data, error } = await supabase
    .from('friendships')
    .select(`
      id,
      friend_id
    `)
    .eq('user_id', userId);
    
  if (error) throw error;
  
  // Now fetch the friend details for each friendship
  const friends: Friend[] = [];
  
  for (const friendship of data) {
    const { data: friendData, error: friendError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .eq('id', friendship.friend_id)
      .single();
      
    if (friendError) continue;
    
    // Buscar pontos semanais da atividade
    const { data: activityPoints, error: activityError } = await supabase
      .from('user_activity_points')
      .select('points')
      .eq('user_id', friendship.friend_id);
    
    // Calcular pontos totais da semana
    let weeklyPoints = 0;
    if (!activityError && activityPoints) {
      weeklyPoints = activityPoints.reduce((total, item) => total + (item.points || 0), 0);
    }
    
    friends.push({
      id: friendship.id,
      userId: friendData.id,
      name: friendData.full_name || friendData.username,
      weeklyPoints,
      avatarUrl: friendData.avatar_url
    });
  }
  
  return friends;
};

// Search for users by username
export const searchUser = async (query: string, currentUserId: string): Promise<SearchUserResult[]> => {
  if (!query || query.length < 3) return [];
  
  // Search by username or full name
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url')
    .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
    .limit(5);
    
  if (error) throw error;
  
  // Remove the current user from the results
  return data?.filter(result => result.id !== currentUserId) || [];
};

// Send friend request email
export const sendFriendRequestEmail = async (receiverId: string, requestId: string, senderName: string) => {
  const appUrl = window.location.origin;
  
  const { data: tokenData } = await supabase.auth.getSession();

  const response = await fetch(`${window.location.origin}/functions/v1/send-friend-request-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenData.session?.access_token}`
    },
    body: JSON.stringify({
      receiverId,
      requestId,
      senderName,
      appUrl
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao enviar e-mail de convite');
  }
  
  return await response.json();
};

import React, { useState } from 'react';
import { CalendarRange, Camera, Compass, Bell } from 'lucide-react';
import { toast } from 'sonner';
import PointsDisplay from '@/components/PointsDisplay';
import CheckInButton from '@/components/CheckInButton';
import FriendRanking from '@/components/FriendRanking';
import CheckInModal from '@/components/CheckInModal';

// Mock data for demonstration
const mockUserData = {
  id: 'user-1',
  name: 'Você',
  activityPoints: 3,
  nutritionPoints: 2,
  totalPoints: 5,
  avatarUrl: 'https://source.unsplash.com/random/100x100/?person'
};
const mockFriends = [{
  id: 'user-2',
  name: 'Ana Silva',
  points: 7,
  position: 1,
  positionChange: 'up' as const,
  avatarUrl: 'https://source.unsplash.com/random/100x100/?woman'
}, {
  id: 'user-1',
  name: 'Você',
  points: 5,
  position: 2,
  positionChange: 'same' as const,
  avatarUrl: mockUserData.avatarUrl
}, {
  id: 'user-3',
  name: 'Carlos Gomes',
  points: 4,
  position: 3,
  positionChange: 'down' as const,
  avatarUrl: 'https://source.unsplash.com/random/100x100/?man'
}, {
  id: 'user-4',
  name: 'Patricia Lima',
  points: 3,
  position: 4,
  positionChange: 'up' as const,
  avatarUrl: 'https://source.unsplash.com/random/100x100/?woman,2'
}, {
  id: 'user-5',
  name: 'Marcelo Costa',
  points: 2,
  position: 5,
  positionChange: 'down' as const,
  avatarUrl: 'https://source.unsplash.com/random/100x100/?man,2'
}];
const HomePage = () => {
  const [checkInType, setCheckInType] = useState<'activity' | 'nutrition' | null>(null);
  const [userData, setUserData] = useState(mockUserData);
  const handleCheckInSubmit = (images: string[]) => {
    // In a real app, we'd send the images to a server
    // Here we'll just update the local state
    if (checkInType === 'activity') {
      setUserData(prev => ({
        ...prev,
        activityPoints: prev.activityPoints + 1,
        totalPoints: prev.totalPoints + 1
      }));
    } else if (checkInType === 'nutrition') {
      setUserData(prev => ({
        ...prev,
        nutritionPoints: prev.nutritionPoints + 1,
        totalPoints: prev.totalPoints + 1
      }));
    }
  };
  return <div className="pb-20">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-levelup-dark">Habitz</h1>
          <div className="flex items-center text-muted-foreground">
            <CalendarRange className="w-4 h-4 mr-1" />
            <span className="text-sm">Semana atual: 10 - 16 Abril</span>
          </div>
        </div>
        <div className="flex items-center">
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted">
            <Compass className="w-6 h-6 text-muted-foreground" />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted ml-1">
            <Bell className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>
      </header>
      
      {/* Points Display */}
      <div className="px-4 mb-5">
        <PointsDisplay activityPoints={userData.activityPoints} nutritionPoints={userData.nutritionPoints} totalPoints={userData.totalPoints} />
      </div>
      
      {/* Check-in Buttons */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Faça seu Check-in</h2>
        <div className="grid grid-cols-2 gap-3">
          <CheckInButton type="activity" onClick={() => setCheckInType('activity')} />
          <CheckInButton type="nutrition" onClick={() => setCheckInType('nutrition')} />
        </div>
      </div>
      
      {/* Friends Ranking */}
      <div className="px-4 mb-6">
        <FriendRanking friends={mockFriends} currentUserId={userData.id} />
      </div>
      
      {/* Check-in Modal */}
      {checkInType && <CheckInModal type={checkInType} isOpen={!!checkInType} onClose={() => setCheckInType(null)} onSubmit={handleCheckInSubmit} />}
    </div>;
};
export default HomePage;
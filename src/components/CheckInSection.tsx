
import React from 'react';
import CheckInButton from '@/components/CheckInButton';
import CheckInModal from '@/components/CheckInModal';

interface CheckInSectionProps {
  checkInType: 'activity' | 'nutrition' | null;
  setCheckInType: (type: 'activity' | 'nutrition' | null) => void;
  onSubmit: (images: string[], activityTypeId?: string) => void;
}

const CheckInSection: React.FC<CheckInSectionProps> = ({
  checkInType,
  setCheckInType,
  onSubmit
}) => {
  return (
    <>
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3 text-center text-green-950">Faça seu Check-in</h2>
        <div className="grid grid-cols-2 gap-3">
          <CheckInButton type="activity" onClick={() => setCheckInType('activity')} />
          <CheckInButton type="nutrition" onClick={() => setCheckInType('nutrition')} />
        </div>
      </div>
      
      {/* Check-in Modal */}
      {checkInType && (
        <CheckInModal 
          type={checkInType} 
          isOpen={!!checkInType} 
          onClose={() => setCheckInType(null)} 
          onSubmit={onSubmit} 
        />
      )}
    </>
  );
};

export default CheckInSection;

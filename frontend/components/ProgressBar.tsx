import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="flex-1 h-4 bg-neutral-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-brand transition-all duration-500 ease-out rounded-full relative shadow-[0_2px_0_rgba(0,0,0,0.15)_inset]"
        style={{ width: `${percentage}%` }}
      >
        <div className="absolute top-1 right-1 w-[90%] h-[3px] bg-white/30 rounded-full"></div>
      </div>
    </div>
  );
};
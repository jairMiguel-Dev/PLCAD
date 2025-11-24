
import React from 'react';
import { Heart, X, Infinity } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface HeaderProps {
  hearts: number;
  isPremium?: boolean;
  currentQuestionIndex: number;
  totalQuestions: number;
  onQuit: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  hearts, 
  isPremium = false,
  currentQuestionIndex, 
  totalQuestions, 
  onQuit 
}) => {
  return (
    <header className="w-full flex items-center justify-between gap-4 py-4 px-6 bg-gray-900 dark:bg-neutral-900 z-10 transition-colors duration-300">
      <button 
        onClick={onQuit} 
        className="text-neutral-300 hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
      >
        <X size={28} strokeWidth={3} />
      </button>
      
      <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
      
      <div id="header-hearts" className="flex items-center gap-2">
        <Heart 
            fill={isPremium || hearts > 0 ? "#FF4B4B" : "transparent"} 
            stroke="#FF4B4B"
            strokeWidth={3}
            size={28} 
            className={!isPremium && hearts < 2 ? "animate-pulse" : ""} 
        />
        <span className="text-danger font-extrabold text-lg">
            {isPremium ? <Infinity size={24} strokeWidth={4} /> : hearts}
        </span>
      </div>
    </header>
  );
};


import React from 'react';
import { Home, BookOpen, Store, User } from 'lucide-react';
import { ScreenState } from '../types';

interface BottomNavProps {
  activeScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const navItems = [
    { id: ScreenState.HOME, icon: Home, label: 'Aprender' },
    { id: ScreenState.REVIEW, icon: BookOpen, label: 'Revisar' }, 
    { id: ScreenState.SHOP, icon: Store, label: 'Loja' }, 
    { id: ScreenState.PROFILE, icon: User, label: 'Perfil' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t-2 border-neutral-200 dark:border-neutral-800 pb-safe-area z-30 transition-colors duration-300">
      <div className="flex justify-around items-center h-20 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ScreenState)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-transform active:scale-90`}
            >
              <div className={`p-1 rounded-xl ${isActive ? 'bg-brand/70 dark:bg-brand/20' : 'bg-transparent'}`}>
                <item.icon 
                    size={28} 
                    strokeWidth={isActive ? 3 : 2.5}
                    className={isActive ? 'text-brand fill-brand/10 dark:text-brand-light' : 'text-neutral-400 dark:text-neutral-600'} 
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

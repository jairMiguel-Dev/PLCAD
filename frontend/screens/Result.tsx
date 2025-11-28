
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Trophy, Star, Zap, ArrowRight, Target, Flame, Gem } from 'lucide-react';
import { LessonResult, UserStats } from '../types';
import { calculateLevel, calculateXpForNextLevel } from '../constants';

interface ResultProps {
  result: LessonResult;
  userStats: UserStats;
  onHome: () => void;
}

export const Result: React.FC<ResultProps> = ({ result, userStats, onHome }) => {

  const xpForNextLevel = calculateXpForNextLevel(userStats.level);
  const currentLevelProgress = Math.min(100, ((userStats.totalXP % xpForNextLevel) / xpForNextLevel) * 100);
  const earnedGems = 20 + (result.perfectBonus > 0 ? 10 : 0);

  return (
    <div className="h-full w-full bg-white flex flex-col items-center px-6 pt-12 pb-8 overflow-y-auto">

      {/* Celebration Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="mb-6 relative z-10"
      >
        <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 rounded-full"></div>
        <Trophy size={120} className="text-yellow-400 drop-shadow-lg" strokeWidth={1.5} />
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-extrabold text-yellow-500 mb-6 tracking-tight"
      >
        Lição Completa!
      </motion.h2>

      {/* Gem Reward */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl mb-8"
      >
        <Gem size={24} className="text-blue-400 fill-blue-400" />
        <span className="text-blue-500 font-black text-xl">+{earnedGems}</span>
      </motion.div>

      {/* XP Breakdown Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm bg-white rounded-2xl border-2 border-neutral-200 p-5 mb-8 shadow-sm"
      >
        <h3 className="text-neutral-400 font-bold text-sm uppercase mb-4 text-center tracking-widest">Resumo de XP</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-neutral-600 font-bold">
            <span>XP Base</span>
            <span>+{result.baseXP}</span>
          </div>
          {result.comboBonus > 0 && (
            <div className="flex justify-between items-center text-orange-500 font-bold">
              <span className="flex items-center gap-1"><Flame size={16} /> Bônus Combo</span>
              <span>+{result.comboBonus}</span>
            </div>
          )}
          {result.perfectBonus > 0 && (
            <div className="flex justify-between items-center text-brand font-bold">
              <span className="flex items-center gap-1"><Target size={16} /> Perfeição</span>
              <span>+{result.perfectBonus}</span>
            </div>
          )}

          <div className="h-[2px] bg-neutral-100 my-2"></div>

          <div className="flex justify-between items-center text-xl font-black text-yellow-500">
            <span>TOTAL</span>
            <span className="bg-yellow-100 px-3 py-1 rounded-xl">+{result.totalXP}</span>
          </div>
        </div>
      </motion.div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-sm mb-8"
      >
        <div className="flex justify-between text-sm font-bold mb-2">
          <span className="text-brand-dark">Nível {userStats.level}</span>
          <span className="text-neutral-400">Próx: {calculateLevel(userStats.totalXP + xpForNextLevel)}</span>
        </div>
        <div className="h-4 bg-neutral-200 rounded-full overflow-hidden border border-neutral-300">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${currentLevelProgress}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
            className="h-full bg-brand-light"
          />
        </div>
      </motion.div>

      {/* Unlocked Achievements */}
      {result.newAchievements.length > 0 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="w-full max-w-sm mb-8"
        >
          <h4 className="text-center font-black text-neutral-700 mb-3 uppercase tracking-wide">Conquistas Desbloqueadas!</h4>
          <div className="flex flex-col gap-3">
            {result.newAchievements.map(ach => (
              <div key={ach.id} className="flex items-center gap-4 bg-yellow-50 border-2 border-yellow-400 p-3 rounded-xl">
                <div className="text-3xl">{ach.icon}</div>
                <div>
                  <div className="font-bold text-yellow-800">{ach.title}</div>
                  <div className="text-xs text-yellow-600 font-medium">{ach.description}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="w-full max-w-xs mt-auto">
        <Button fullWidth size="lg" onClick={onHome} className="flex items-center justify-center gap-2">
          CONTINUAR <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};

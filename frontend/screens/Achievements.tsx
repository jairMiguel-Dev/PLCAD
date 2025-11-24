
import React from 'react';
import { motion } from 'framer-motion';
import { Award, ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { ACHIEVEMENTS } from '../constants';
import { UserStats } from '../types';
import { Button } from '../components/Button';

interface AchievementsProps {
    userStats: UserStats;
    onBack: () => void;
}

export const Achievements: React.FC<AchievementsProps> = ({ userStats, onBack }) => {
    const unlockedCount = userStats.unlockedAchievements.length;
    const totalCount = ACHIEVEMENTS.length;
    const progress = (unlockedCount / totalCount) * 100;

    return (
        <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 pb-24 overflow-y-auto transition-colors duration-300">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 p-4 flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-neutral-700 dark:text-white" />
                </button>
                <h1 className="text-xl font-black text-neutral-700 dark:text-white">Conquistas</h1>
            </div>

            {/* Progress Banner */}
            <div className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white mb-6 shadow-lg">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h2 className="text-3xl font-black mb-1">Galeria de Troféus</h2>
                        <p className="font-bold opacity-90">Colecione todas as medalhas!</p>
                    </div>
                    <Award size={48} className="text-white/30" />
                </div>
                <div className="flex justify-between text-sm font-bold mb-1">
                    <span>Progresso Total</span>
                    <span>{unlockedCount}/{totalCount}</span>
                </div>
                <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Grid de Conquistas */}
            <div className="px-4 grid gap-4">
                {ACHIEVEMENTS.map((ach, index) => {
                    const isUnlocked = userStats.unlockedAchievements.includes(ach.id);

                    return (
                        <motion.div
                            key={ach.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center p-4 rounded-2xl border-b-4 transition-all ${isUnlocked
                                    ? 'bg-white dark:bg-neutral-800 border-yellow-400 shadow-sm'
                                    : 'bg-neutral-100 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 opacity-70 grayscale'
                                }`}
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mr-4 border-4 ${isUnlocked
                                    ? 'bg-yellow-100 border-yellow-200'
                                    : 'bg-neutral-200 border-neutral-300'
                                }`}>
                                {isUnlocked ? ach.icon : <Lock size={24} className="text-neutral-400" />}
                            </div>

                            <div className="flex-1">
                                <h3 className={`font-black text-lg ${isUnlocked ? 'text-neutral-800 dark:text-white' : 'text-neutral-500'}`}>
                                    {ach.title}
                                </h3>
                                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 leading-tight">
                                    {ach.description}
                                </p>
                            </div>

                            {isUnlocked && (
                                <div className="text-green-500 bg-green-100 p-1 rounded-full">
                                    <CheckCircle size={20} />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

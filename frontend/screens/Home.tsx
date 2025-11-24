import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CURRICULUM, HEART_REFILL_TIME_MS, generateRandomUnit } from '../constants';
import { Star, Lock, Check, Code, Book, Trophy, Zap, Flag, Sparkles, Clock, Heart, CheckCircle, Gift, Loader, ChevronUp, ChevronDown, RefreshCw, Cpu, Bug } from 'lucide-react';
import { Level, Quest, Unit } from '../types';

interface HomeProps {
    onStartLevel: (levelId: number) => void;
    onStartSmartWorkout: () => void;
    onStartDebug?: () => void;
    completedLevels: number[];
    userGems: number;
    userStreak: number;
    userHearts: number;
    lastCompletedLevelId: number | null;
    onAnimationComplete: () => void;
    lastHeartLostTime: number | null;
    quests: Quest[];
    onClaimQuest: (id: string) => void;
    onResetQuest: (questId: string) => void;
    conceptMastery: Record<string, number>;
}

export const Home: React.FC<HomeProps> = ({
    onStartLevel,
    onStartSmartWorkout,
    onStartDebug,
    completedLevels,
    userGems,
    userStreak,
    userHearts,
    lastCompletedLevelId,
    onAnimationComplete,
    lastHeartLostTime,
    quests,
    onClaimQuest,
    onResetQuest,
    conceptMastery
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const loaderRef = useRef<HTMLDivElement>(null);

    const [displayedUnits, setDisplayedUnits] = useState<Unit[]>(CURRICULUM);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [animatingUnlockId, setAnimatingUnlockId] = useState<number | null>(null);
    const [showLevelUpToast, setShowLevelUpToast] = useState(false);
    const [timeToRefill, setTimeToRefill] = useState<string>('');
    const [isQuestsExpanded, setIsQuestsExpanded] = useState(true);
    const [timeToNextQuests, setTimeToNextQuests] = useState<string>('');

    // Flatten displayed levels
    const visibleLevels = displayedUnits.flatMap(u => u.levels);
    const nextLevel = visibleLevels.find(l => !completedLevels.includes(l.id));
    const currentActiveId = nextLevel ? nextLevel.id : -1;

    // Check for weak concepts for Smart Workout
    const hasWeakConcepts = Object.values(conceptMastery ?? {}).some((score) => (score as number) < 60);

    // Infinite Scroll Logic
    const loadMoreUnits = useCallback(() => {
        if (isLoadingMore) return;
        setIsLoadingMore(true);

        setTimeout(() => {
            const lastUnit = displayedUnits[displayedUnits.length - 1];
            const nextUnitId = lastUnit.id + 1;
            const lastLevelId = lastUnit.levels[lastUnit.levels.length - 1].id;
            const startLevelId = nextUnitId * 100 + 1;

            const newUnit = generateRandomUnit(nextUnitId, startLevelId);

            setDisplayedUnits(prev => [...prev, newUnit]);
            setIsLoadingMore(false);
        }, 1500);
    }, [displayedUnits, isLoadingMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreUnits();
                }
            },
            {
                root: scrollRef.current,
                threshold: 0.5,
                rootMargin: '100px'
            }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [loadMoreUnits]);

    // Auto-scroll to current level on mount and updates
    useEffect(() => {
        const scrollToCurrent = () => {
            if (currentActiveId !== -1) {
                const activeEl = document.getElementById(`level-${currentActiveId}`);
                if (activeEl) {
                    activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        };

        scrollToCurrent();
        const timer = setTimeout(scrollToCurrent, 500);

        return () => clearTimeout(timer);
    }, [currentActiveId]);

    useEffect(() => {
        if (lastCompletedLevelId && scrollRef.current) {
            const completedIndex = visibleLevels.findIndex(l => l.id === lastCompletedLevelId);
            const nextLevelIndex = completedIndex + 1;
            const nextLevelId = visibleLevels[nextLevelIndex]?.id;

            const completedEl = document.getElementById(`level-${lastCompletedLevelId}`);
            if (completedEl) {
                completedEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            const sequence = async () => {
                await new Promise(r => setTimeout(r, 800));
                if (nextLevelId) {
                    const nextEl = document.getElementById(`level-${nextLevelId}`);
                    if (nextEl) {
                        nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    await new Promise(r => setTimeout(r, 600));
                    setAnimatingUnlockId(nextLevelId);
                    setShowLevelUpToast(true);
                    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
                }
                await new Promise(r => setTimeout(r, 2000));
                setAnimatingUnlockId(null);
                setShowLevelUpToast(false);
                onAnimationComplete();
            };
            sequence();
        }
    }, [lastCompletedLevelId]);

    useEffect(() => {
        if (userHearts > 0 || !lastHeartLostTime) return;

        const updateTimer = () => {
            const targetTime = lastHeartLostTime + HEART_REFILL_TIME_MS;
            const now = Date.now();
            const diff = targetTime - now;

            if (diff <= 0) {
                setTimeToRefill('00:00');
            } else {
                const m = Math.floor((diff / 1000 / 60));
                const s = Math.floor((diff / 1000) % 60);
                setTimeToRefill(`${m}:${s < 10 ? '0' : ''}${s}`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [userHearts, lastHeartLostTime]);

    // Timer for next daily quests (resets at midnight)
    useEffect(() => {
        const updateQuestTimer = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setHours(24, 0, 0, 0); // Next midnight

            const diff = tomorrow.getTime() - now.getTime();

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeToNextQuests(`${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`);
        };

        updateQuestTimer();
        const interval = setInterval(updateQuestTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    const getIcon = (level: Level) => {
        switch (level.icon) {
            case 'code': return <Code size={32} fill="currentColor" className="text-white" />;
            case 'book': return <Book size={32} fill="currentColor" className="text-white" />;
            case 'trophy': return <Trophy size={32} fill="currentColor" className="text-white" />;
            case 'zap': return <Zap size={32} fill="currentColor" className="text-white" />;
            default: return <Star size={32} fill="currentColor" className="text-white" />;
        }
    }

    return (
        <div 
            className="flex flex-col w-full bg-neutral-200 dark:bg-neutral-900 relative transition-colors duration-300 overflow-hidden"
            style={{ height: '100dvh' }} // Força altura real da viewport (mobile fix)
        >
            {/* Header Fixo com suporte a Safe Area */}
            <header 
                className="fixed top-0 left-0 right-0 z-50 bg-neutral-200/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b-2 border-neutral-300 dark:border-neutral-800 flex items-center justify-between px-4 py-3 shadow-sm no-select"
                style={{ 
                    paddingTop: 'calc(0.75rem + env(safe-area-inset-top))',
                    height: 'calc(62px + env(safe-area-inset-top))' 
                }}
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                        <Flag size={18} className="text-brand" fill="currentColor" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div id="header-streak" className="flex items-center gap-1 cursor-default">
                        <span className="text-orange-500 font-bold">{userStreak}</span>
                        <div className="text-orange-500 text-xl">🔥</div>
                    </div>
                    <div id="header-gems" className="flex items-center gap-1 cursor-default">
                        <span className="text-blue-500 font-bold">{userGems}</span>
                        <div className="text-blue-400 text-xl">💎</div>
                    </div>
                </div>
            </header>

            {/* Zero Hearts Warning Banner (Fixo abaixo do header) */}
            <AnimatePresence>
                {userHearts === 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="fixed left-0 right-0 z-40 bg-danger text-white overflow-hidden shadow-md"
                        style={{ top: 'calc(62px + env(safe-area-inset-top))' }}
                    >
                        <div className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                                    <Heart fill="white" className="text-white" size={20} />
                                </div>
                                <div className="leading-tight">
                                    <p className="font-bold text-sm uppercase opacity-90">Vidas Esgotadas</p>
                                    <div className="flex items-center gap-1 font-mono text-lg font-black">
                                        <Clock size={16} /> {timeToRefill}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => {/* Trigger Shop */ }} className="bg-gray-900 text-danger font-black text-xs px-3 py-2 rounded-xl shadow-sm active:scale-95 transition-transform no-select">
                                RECARREGAR
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scroll Container (Com padding top compensatório) */}
            <div 
                ref={scrollRef} 
                className="flex-1 overflow-y-auto px-4 relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:bg-none"
                style={{ 
                    // Empurra o conteúdo para baixo da altura do header + safe area
                    paddingTop: 'calc(80px + env(safe-area-inset-top))', 
                    paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))'
                }}
            >
                {/* Daily Quests Widget */}
                <div className="mb-6">
                    <div className="bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl p-4 shadow-sm transition-all duration-300">
                        <div
                            className="flex justify-between items-center cursor-pointer no-select"
                            onClick={() => setIsQuestsExpanded(!isQuestsExpanded)}
                        >
                            <h3 className="text-neutral-700 dark:text-neutral-200 font-extrabold uppercase tracking-wide text-sm">Missões Diárias</h3>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <Clock size={14} className="animate-pulse" />
                                    <span className="text-xs font-mono font-bold">{timeToNextQuests}</span>
                                </div>
                                {isQuestsExpanded ? <ChevronUp size={16} className="text-neutral-400" /> : <ChevronDown size={16} className="text-neutral-400" />}
                            </div>
                        </div>

                        <AnimatePresence>
                            {isQuestsExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                    animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-3">
                                        {quests.map(quest => (
                                            <div key={quest.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className={`p-2 rounded-lg ${quest.completed ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-700'}`}>
                                                        {quest.completed ? <CheckCircle size={16} /> : <Trophy size={16} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`text-sm font-bold ${quest.completed ? 'text-neutral-400 line-through' : 'text-neutral-600 dark:text-neutral-300'}`}>
                                                            {quest.description}
                                                        </p>
                                                        <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full mt-1 overflow-hidden">
                                                            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {quest.completed && !quest.claimed && (
                                                    <motion.button
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={(e) => { e.stopPropagation(); onClaimQuest(quest.id); }}
                                                        className="bg-info text-white p-2 rounded-xl shadow-btn-primary animate-bounce no-select"
                                                    >
                                                        <Gift size={16} />
                                                    </motion.button>
                                                )}
                                                {quest.claimed && (
                                                    <span className="text-xs font-bold text-neutral-300 uppercase no-select">Feito</span>
                                                )}
                                                {!quest.completed && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-neutral-400">{quest.current}/{quest.target}</span>
                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (userGems >= 50) {
                                                                    onResetQuest(quest.id);
                                                                }
                                                            }}
                                                            className={`p-1.5 rounded-lg transition-all no-select ${userGems >= 50 ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
                                                            title={userGems >= 50 ? "Resetar missão (50 gemas)" : "Gemas insuficientes"}
                                                        >
                                                            <RefreshCw size={14} />
                                                        </motion.button>
                                                        <span className="text-[10px] font-bold text-purple-500">50💎</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* The Path */}
                <div className="flex flex-col items-center gap-8 max-w-md mx-auto">
                    {displayedUnits.map((unit, unitIndex) => (
                        <div key={unit.id} className="w-full mb-8">
                            {/* Unit Header */}
                            <div className="mb-6 bg-brand text-white p-4 rounded-xl shadow-md border-b-4 border-brand-dark">
                                <h2 className="text-lg font-bold uppercase">{unit.title}</h2>
                                <p className="text-sm opacity-90">{unit.description}</p>
                            </div>
                            
                            {/* Levels Grid/Path */}
                            <div className="flex flex-col items-center gap-4">
                                {unit.levels.map((level) => {
                                    const isCompleted = completedLevels.includes(level.id);
                                    const isLocked = !isCompleted && currentActiveId !== level.id;
                                    const isActive = currentActiveId === level.id;
                                    
                                    return (
                                        <motion.div 
                                            key={level.id}
                                            id={`level-${level.id}`}
                                            whileHover={{ scale: isLocked ? 1 : 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => !isLocked && onStartLevel(level.id)}
                                            className={`
                                                relative w-20 h-20 rounded-full flex items-center justify-center border-b-4 cursor-pointer no-select transition-all
                                                ${isActive 
                                                    ? 'bg-brand border-brand-dark shadow-[0_0_15px_rgba(88,204,2,0.6)]' 
                                                    : isCompleted 
                                                        ? 'bg-yellow-400 border-yellow-600' 
                                                        : 'bg-neutral-300 border-neutral-400 dark:bg-neutral-700 dark:border-neutral-800'
                                                }
                                            `}
                                        >
                                            {/* Icon Logic */}
                                            <div className="z-10 relative">
                                                {isLocked ? (
                                                    <Lock size={24} className="text-neutral-500 dark:text-neutral-400" />
                                                ) : isCompleted ? (
                                                    <Check size={32} className="text-white font-bold" strokeWidth={4} />
                                                ) : (
                                                    getIcon(level)
                                                )}
                                            </div>

                                            {/* Stars/Rating (Optional) */}
                                            {isCompleted && (
                                                <div className="absolute -bottom-2 flex gap-0.5">
                                                    {[1, 2, 3].map(i => (
                                                        <Star key={i} size={12} className="text-yellow-400 fill-yellow-400 drop-shadow-sm" />
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    
                    <div ref={loaderRef} className="py-8 flex justify-center">
                        {isLoadingMore && <Loader className="animate-spin text-brand" />}
                    </div>
                </div>

                {/* Level Up Toast (Fixo) */}
                <AnimatePresence>
                    {showLevelUpToast && (
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="fixed z-50 flex justify-center pointer-events-none left-0 right-0"
                            style={{ top: 'calc(150px + env(safe-area-inset-top))' }}
                        >
                            <div className="bg-brand-dark text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 border-4 border-brand-light">
                                <Sparkles size={20} className="text-yellow-300 animate-spin-slow" />
                                <span className="font-black uppercase tracking-widest">Nível Desbloqueado!</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Smart Workout Floating Button */}
            <AnimatePresence>
                {hasWeakConcepts && (
                    <motion.button
                        initial={{ scale: 0, x: 100 }}
                        animate={{ scale: 1, x: 0 }}
                        exit={{ scale: 0, x: 100 }}
                        onClick={onStartSmartWorkout}
                        className="fixed right-6 z-40 bg-secondary hover:bg-secondary-light text-white p-4 rounded-full shadow-lg border-4 border-white dark:border-neutral-800 flex items-center justify-center gap-2 group no-select"
                        style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom))' }}
                    >
                        <Cpu size={28} className="group-hover:animate-pulse" />
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-danger rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-[10px] font-bold">!</span>
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Debug Challenge Floating Button */}
            {onStartDebug && (
                <motion.button
                    initial={{ scale: 0, x: 100 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={onStartDebug}
                    className="fixed right-6 z-40 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg border-4 border-white dark:border-neutral-800 flex items-center justify-center group no-select"
                    title="Desafios de Debug"
                    style={{ bottom: 'calc(11rem + env(safe-area-inset-bottom))' }}
                >
                    <Bug size={28} className="group-hover:rotate-12 transition-transform" />
                </motion.button>
            )}
        </div>
    );
};

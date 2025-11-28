import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CURRICULUM, HEART_REFILL_TIME_MS, generateRandomUnit } from '../constants';
import { Star, Lock, Check, Code, Book, Trophy, Zap, Flag, Sparkles, Clock, Heart, CheckCircle, Gift, Loader, ChevronUp, ChevronDown, RefreshCw, Cpu, Bug, Rocket } from 'lucide-react';
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

// Generate random stars for the background
const generateStars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2
    }));
};

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
    const [isQuestsExpanded, setIsQuestsExpanded] = useState(false); // Collapsed by default to show the galaxy
    const [timeToNextQuests, setTimeToNextQuests] = useState<string>('');

    // Memoize stars to prevent re-rendering
    const stars = useMemo(() => generateStars(50), []);

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

        // Initial scroll
        scrollToCurrent();
        const timer = setTimeout(scrollToCurrent, 500);

        return () => clearTimeout(timer);
    }, [currentActiveId]);

    // Handle Level Completion Animation
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

    // Heart Refill Timer
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

    // Quest Timer
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
            case 'code': return <Code size={24} fill="currentColor" className="text-white drop-shadow-md" />;
            case 'book': return <Book size={24} fill="currentColor" className="text-white drop-shadow-md" />;
            case 'trophy': return <Trophy size={24} fill="currentColor" className="text-white drop-shadow-md" />;
            case 'zap': return <Zap size={24} fill="currentColor" className="text-white drop-shadow-md" />;
            default: return <Star size={24} fill="currentColor" className="text-white drop-shadow-md" />;
        }
    }

    // Colors for planets based on unit index
    const planetColors = [
        'from-purple-500 to-indigo-600',
        'from-blue-400 to-cyan-600',
        'from-emerald-400 to-green-600',
        'from-orange-400 to-red-600',
        'from-pink-500 to-rose-600',
    ];

    return (
        <div
            className="flex flex-col w-full bg-[#0f172a] relative transition-colors duration-300 overflow-hidden"
            style={{ height: '100dvh' }}
        >
            {/* Galaxy Background with Stars */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Nebula Effects */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0f172a] to-[#0f172a]"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-3xl"></div>

                {/* Stars */}
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute bg-white rounded-full"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`
                        }}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: star.duration, repeat: Infinity, delay: star.delay, ease: "easeInOut" }}
                    />
                ))}
            </div>

            {/* Header Fixo */}
            <header
                className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 py-3 shadow-lg no-select"
                style={{
                    paddingTop: 'calc(0.75rem + env(safe-area-inset-top))',
                    height: 'calc(62px + env(safe-area-inset-top))'
                }}
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shadow-lg shadow-brand/20">
                        <Flag size={18} className="text-white" fill="currentColor" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div id="header-streak" className="flex items-center gap-1 cursor-default bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        <span className="text-orange-400 font-bold">{userStreak}</span>
                        <div className="text-orange-500 text-lg">🔥</div>
                    </div>
                    <div id="header-gems" className="flex items-center gap-1 cursor-default bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        <span className="text-blue-400 font-bold">{userGems}</span>
                        <div className="text-blue-400 text-lg">💎</div>
                    </div>
                </div>
            </header>

            {/* Zero Hearts Warning Banner */}
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

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 relative z-10"
                style={{
                    paddingTop: 'calc(80px + env(safe-area-inset-top))',
                    paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))'
                }}
            >
                {/* Daily Quests Widget (Collapsed by default to show galaxy) */}
                <div className="mb-8 max-w-md mx-auto">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg transition-all duration-300 hover:bg-white/10">
                        <div
                            className="flex justify-between items-center cursor-pointer no-select"
                            onClick={() => setIsQuestsExpanded(!isQuestsExpanded)}
                        >
                            <h3 className="text-white/90 font-extrabold uppercase tracking-wide text-sm flex items-center gap-2">
                                <Rocket size={16} className="text-purple-400" />
                                Missões Diárias
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-lg border border-blue-500/30">
                                    <Clock size={14} className="animate-pulse" />
                                    <span className="text-xs font-mono font-bold">{timeToNextQuests}</span>
                                </div>
                                {isQuestsExpanded ? <ChevronUp size={16} className="text-white/50" /> : <ChevronDown size={16} className="text-white/50" />}
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
                                                    <div className={`p-2 rounded-lg ${quest.completed ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
                                                        {quest.completed ? <CheckCircle size={16} /> : <Trophy size={16} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`text-sm font-bold ${quest.completed ? 'text-white/30 line-through' : 'text-white/80'}`}>
                                                            {quest.description}
                                                        </p>
                                                        <div className="w-full h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {quest.completed && !quest.claimed && (
                                                    <motion.button
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={(e) => { e.stopPropagation(); onClaimQuest(quest.id); }}
                                                        className="bg-info text-white p-2 rounded-xl shadow-lg shadow-info/30 animate-bounce no-select"
                                                    >
                                                        <Gift size={16} />
                                                    </motion.button>
                                                )}
                                                {quest.claimed && (
                                                    <span className="text-xs font-bold text-white/30 uppercase no-select">Feito</span>
                                                )}
                                                {!quest.completed && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-white/40">{quest.current}/{quest.target}</span>
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

                {/* The Galaxy Path */}
                <div className="flex flex-col items-center gap-12 max-w-md mx-auto pb-20">
                    {displayedUnits.map((unit, unitIndex) => {
                        const unitColor = planetColors[unitIndex % planetColors.length];

                        return (
                            <div key={unit.id} className="w-full relative">
                                {/* Unit Header (Floating in space) */}
                                <div className="mb-12 text-center relative">
                                    <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                        <h2 className="text-sm font-black uppercase text-white tracking-widest">{unit.title}</h2>
                                    </div>
                                    <p className="text-xs text-white/50 mt-2">{unit.description}</p>
                                </div>

                                {/* Levels Grid/Path */}
                                <div className="flex flex-col items-center gap-12 relative">
                                    {unit.levels.map((level, levelIndex) => {
                                        const isCompleted = completedLevels.includes(level.id);
                                        const isLocked = !isCompleted && currentActiveId !== level.id;
                                        const isActive = currentActiveId === level.id;

                                        // Calculate zigzag position
                                        // Use sine wave to create a winding path
                                        // We need a global index to make it continuous across units, but local index is easier
                                        // Let's just alternate left/right for simplicity or use a fixed pattern
                                        const offset = Math.sin(levelIndex) * 60; // -60px to +60px

                                        return (
                                            <div key={level.id} className="relative flex justify-center w-full">
                                                {/* Connecting Line (to next level) - Simplified vertical line for now, 
                                                    could be SVG curve in future */}
                                                {levelIndex < unit.levels.length - 1 && (
                                                    <div
                                                        className="absolute top-16 w-1 h-16 bg-white/10 border-l-2 border-dashed border-white/20"
                                                        style={{
                                                            left: `calc(50% + ${offset}px)`,
                                                            transform: `translateX(0px) rotate(${Math.sin(levelIndex) * -15}deg)`,
                                                            height: '80px',
                                                            zIndex: 0
                                                        }}
                                                    />
                                                )}

                                                <motion.div
                                                    id={`level-${level.id}`}
                                                    whileHover={{ scale: isLocked ? 1 : 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => !isLocked && onStartLevel(level.id)}
                                                    className={`
                                                        relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer no-select transition-all z-10
                                                        ${isActive
                                                            ? `bg-gradient-to-br ${unitColor} shadow-[0_0_30px_rgba(255,255,255,0.4)] ring-4 ring-white/20`
                                                            : isCompleted
                                                                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg'
                                                                : 'bg-gradient-to-br from-slate-700 to-slate-800 border-4 border-slate-600 opacity-80'
                                                        }
                                                    `}
                                                    style={{
                                                        transform: `translateX(${offset}px)`,
                                                    }}
                                                >
                                                    {/* Planet Texture/Detail */}
                                                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

                                                    {/* Icon Logic */}
                                                    <div className="z-10 relative">
                                                        {isLocked ? (
                                                            <Lock size={28} className="text-white/30" />
                                                        ) : isCompleted ? (
                                                            <Check size={36} className="text-white drop-shadow-md" strokeWidth={4} />
                                                        ) : (
                                                            getIcon(level)
                                                        )}
                                                    </div>

                                                    {/* ROCKET ANIMATION */}
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="rocket-travel"
                                                            className="absolute -top-8 -right-8 z-20 pointer-events-none"
                                                            transition={{ type: "spring", stiffness: 50, damping: 15 }}
                                                        >
                                                            <div className="relative">
                                                                <Rocket size={48} className="text-white fill-white drop-shadow-[0_0_15px_rgba(255,100,0,0.8)] -rotate-45" />
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-8 bg-gradient-to-b from-orange-500 to-transparent blur-sm"></div>
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {/* Stars/Rating */}
                                                    {isCompleted && (
                                                        <div className="absolute -bottom-6 flex gap-1 justify-center w-full">
                                                            {[1, 2, 3].map(i => (
                                                                <Star key={i} size={14} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]" />
                                                            ))}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    <div ref={loaderRef} className="py-8 flex justify-center">
                        {isLoadingMore && <Loader className="animate-spin text-white/50" />}
                    </div>
                </div>

                {/* Level Up Toast */}
                <AnimatePresence>
                    {showLevelUpToast && (
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="fixed z-50 flex justify-center pointer-events-none left-0 right-0"
                            style={{ top: 'calc(150px + env(safe-area-inset-top))' }}
                        >
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full shadow-[0_0_30px_rgba(124,58,237,0.5)] flex items-center gap-2 border-2 border-white/20 backdrop-blur-md">
                                <Sparkles size={20} className="text-yellow-300 animate-spin-slow" />
                                <span className="font-black uppercase tracking-widest text-sm">Nível Desbloqueado!</span>
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
                        className="fixed right-6 z-40 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white p-4 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)] border-4 border-white/10 flex items-center justify-center gap-2 group no-select"
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
                    className="fixed right-6 z-40 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg border-4 border-white/10 flex items-center justify-center group no-select"
                    title="Desafios de Debug"
                    style={{ bottom: 'calc(11rem + env(safe-area-inset-bottom))' }}
                >
                    <Bug size={28} className="group-hover:rotate-12 transition-transform" />
                </motion.button>
            )}
        </div>
    );
};
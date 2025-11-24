
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CURRICULUM, HEART_REFILL_TIME_MS, generateRandomUnit } from '../constants';
import { Star, Lock, Check, Code, Book, Trophy, Zap, Flag, Sparkles, Clock, Heart, CheckCircle, Gift, Loader, ChevronUp, ChevronDown, RefreshCw, Cpu, Bug } from 'lucide-react';
import { Level, Quest, Unit } from '../types';

interface HomeProps {
    onStartLevel: (levelId: number) => void;
    onStartSmartWorkout: () => void;
    onStartDebug?: () => void; // New: Navigate to Debug Challenges
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

        // Tenta rolar imediatamente e após um pequeno delay para garantir renderização
        scrollToCurrent();
        const timer = setTimeout(scrollToCurrent, 500);

        return () => clearTimeout(timer);
    }, [currentActiveId]); // Executa quando o nível atual muda (ex: carga inicial)

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
        <div className="flex flex-col h-full bg-neutral-200 dark:bg-neutral-900 pb-24 relative transition-colors duration-300">
            {/* Top Bar */}
            <header className="sticky top-0 z-30 bg-neutral-200/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b-2 border-neutral-300 dark:border-neutral-800 flex items-center justify-between px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                        <Flag size={18} className="text-brand" fill="currentColor" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div id="header-streak" className="flex items-center gap-1">
                        <span className="text-orange-500 font-bold">{userStreak}</span>
                        <div className="text-orange-500 text-xl">🔥</div>
                    </div>
                    <div id="header-gems" className="flex items-center gap-1">
                        <span className="text-blue-500 font-bold">{userGems}</span>
                        <div className="text-blue-400 text-xl">💎</div>
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
                        className="bg-danger text-white overflow-hidden sticky top-[58px] z-20 shadow-md"
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
                            <button onClick={() => {/* Trigger Shop via parent if needed, but user can use nav */ }} className="bg-gray-900 text-danger font-black text-xs px-3 py-2 rounded-xl shadow-sm active:scale-95 transition-transform">
                                RECARREGAR
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Daily Quests Widget */}
            <div className="px-4 pt-4">
                <div className="bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl p-4 shadow-sm transition-all duration-300">
                    <div
                        className="flex justify-between items-center cursor-pointer"
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
                                                    className="bg-info text-white p-2 rounded-xl shadow-btn-primary animate-bounce"
                                                >
                                                    <Gift size={16} />
                                                </motion.button>
                                            )}
                                            {quest.claimed && (
                                                <span className="text-xs font-bold text-neutral-300 uppercase">Feito</span>
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
                                                        className={`p-1.5 rounded-lg transition-all ${userGems >= 50 ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
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

            {/* Smart Workout Floating Button - Appears if user has weak concepts */}
            <AnimatePresence>
                {hasWeakConcepts && (
                    <motion.button
                        initial={{ scale: 0, x: 100 }}
                        animate={{ scale: 1, x: 0 }}
                        exit={{ scale: 0, x: 100 }}
                        onClick={onStartSmartWorkout}
                        className="fixed bottom-24 right-6 z-40 bg-secondary hover:bg-secondary-light text-white p-4 rounded-full shadow-lg border-4 border-white dark:border-neutral-800 flex items-center justify-center gap-2 group"
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
                    className="fixed bottom-44 right-6 z-40 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg border-4 border-white dark:border-neutral-800 flex items-center justify-center group"
                    title="Desafios de Debug"
                >
                    <Bug size={28} className="group-hover:rotate-12 transition-transform" />
                </motion.button>
            )}

            {/* The Path */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto py-8 px-4 relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:bg-none">

                <AnimatePresence>
                    {showLevelUpToast && (
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="fixed top-40 left-0 right-0 z-50 flex justify-center pointer-events-none"
                        >
                            <div className="bg-brand-dark text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 border-4 border-brand-light">
                                <Sparkles size={20} className="text-yellow-300 animate-spin-slow" />
                                <span className="font-black uppercase tracking-widest">Nível Desbloqueado!</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {displayedUnits.map((unit) => (
                    <div key={unit.id} className="mb-12">
                        <div className="flex flex-col items-center mb-8">
                            <h2 className="text-xl font-extrabold text-neutral-700 dark:text-white bg-white dark:bg-neutral-800 px-4 py-2 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 shadow-sm z-10 text-center">
                                {unit.title}
                            </h2>
                            <p className="text-neutral-400 dark:text-neutral-500 text-sm font-bold mt-2 bg-white/80 dark:bg-neutral-900/80 px-2 rounded">{unit.description}</p>
                        </div>

                        <div className="flex flex-col items-center gap-6 relative">
                            {/* Path Line */}
                            <div className="absolute top-0 bottom-0 w-2 bg-neutral-200 dark:bg-neutral-700 -z-0 rounded-full" />

                            {unit.levels.map((level, index) => {
                                const globalIndex = visibleLevels.findIndex(l => l.id === level.id);
                                const isFirst = globalIndex === 0;
                                const previousLevel = isFirst ? null : visibleLevels[globalIndex - 1];

                                const isCompleted = completedLevels.includes(level.id);
                                const isLocked = !isFirst && previousLevel && !completedLevels.includes(previousLevel.id);
                                const isCurrent = !isLocked && !isCompleted;

                                const isAnimatingThis = animatingUnlockId === level.id;

                                // Offset for zig-zag effect
                                const xOffset = index % 2 === 0 ? 'translate-x-8' : '-translate-x-8';

                                // Colors
                                let bgColor = 'bg-brand';
                                let shadowColor = 'shadow-[0_6px_0_#46A302]';

                                if (level.color === 'secondary') {
                                    bgColor = 'bg-secondary';
                                    shadowColor = 'shadow-[0_6px_0_#A545EE]';
                                } else if (level.color === 'info') {
                                    bgColor = 'bg-info';
                                    shadowColor = 'shadow-[0_6px_0_#1899D6]';
                                } else if (level.color === 'warn') {
                                    bgColor = 'bg-warn';
                                    shadowColor = 'shadow-[0_6px_0_#E5B400]';
                                }

                                let content = (
                                    <>
                                        {getIcon(level)}
                                        <div className="absolute -bottom-8 flex gap-1">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className={`w-2 h-2 rounded-full ${i < level.stars ? 'bg-yellow-400' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
                                            ))}
                                        </div>
                                    </>
                                );

                                if (isLocked && !isAnimatingThis) {
                                    bgColor = 'bg-neutral-200 dark:bg-neutral-700';
                                    shadowColor = 'shadow-[0_6px_0_#D4D4D4] dark:shadow-[0_6px_0_#404040]';
                                    content = <Lock size={24} className="text-neutral-400 dark:text-neutral-500" />;
                                } else if (isCompleted) {
                                    content = <Check size={32} strokeWidth={4} className="text-white/50" />;
                                }

                                return (
                                    <div key={level.id} id={`level-${level.id}`} className={`relative z-10 ${index !== 0 && xOffset}`}>
                                        <motion.button
                                            initial={false}
                                            animate={isAnimatingThis ? { scale: [0.8, 1.3, 1], rotate: [0, 10, -10, 0] } : { scale: 1 }}
                                            transition={{ duration: 0.6, ease: "easeInOut" }}
                                            whileTap={!isLocked ? { scale: 0.9, translateY: 6, boxShadow: '0 0 0 transparent' } : {}}
                                            onClick={() => !isLocked && onStartLevel(level.id)}
                                            className={`
                            w-20 h-20 rounded-full flex items-center justify-center border-4 border-white dark:border-neutral-800
                            ${bgColor} ${shadowColor} transition-colors duration-500
                            ${isCurrent && !isAnimatingThis ? 'ring-4 ring-brand/30' : 'cursor-default'}
                            ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                        `}
                                        >
                                            {content}
                                        </motion.button>

                                        {/* Start Bubble */}
                                        {isCurrent && !isAnimatingThis && (
                                            <motion.div
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="absolute -top-14 left-1/2 transform -translate-x-1/2 z-20"
                                            >
                                                <div className="bg-white dark:bg-neutral-700 px-3 py-2 rounded-xl border-2 border-neutral-200 dark:border-neutral-600 shadow-sm whitespace-nowrap animate-bounce mb-1">
                                                    <span className="font-bold text-brand dark:text-brand-light uppercase text-xs">Começar</span>
                                                </div>
                                                <div className="w-3 h-3 bg-white dark:bg-neutral-700 border-b-2 border-r-2 border-neutral-200 dark:border-neutral-600 rotate-45 absolute bottom-[-6px] left-1/2 -translate-x-1/2"></div>
                                            </motion.div>
                                        )}

                                        {/* Unlock Particles */}
                                        {isAnimatingThis && (
                                            <div className="absolute inset-0 pointer-events-none">
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 1 }}
                                                    animate={{ scale: 2, opacity: 0 }}
                                                    transition={{ duration: 0.8 }}
                                                    className="absolute inset-0 rounded-full border-4 border-yellow-400"
                                                />
                                                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                                                    <motion.div
                                                        key={deg}
                                                        initial={{ x: 0, y: 0, opacity: 1 }}
                                                        animate={{
                                                            x: Math.cos(deg * Math.PI / 180) * 60,
                                                            y: Math.sin(deg * Math.PI / 180) * 60,
                                                            opacity: 0
                                                        }}
                                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Separator */}
                            <div className="h-8"></div>
                        </div>
                    </div>
                ))}

                {/* Infinite Scroll Loader Trigger */}
                <div ref={loaderRef} className="flex flex-col items-center justify-center py-10 gap-3">
                    {isLoadingMore ? (
                        <>
                            <Loader size={32} className="text-brand animate-spin" />
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Criando novos níveis...</span>
                        </>
                    ) : (
                        <div className="h-10" /> /* Spacer for trigger */
                    )}
                </div>
            </div>
        </div>
    );
};

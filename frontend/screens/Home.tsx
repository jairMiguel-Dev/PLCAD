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

    // --- LÓGICA (Mantida igual) ---
    const visibleLevels = displayedUnits.flatMap(u => u.levels);
    const nextLevel = visibleLevels.find(l => !completedLevels.includes(l.id));
    const currentActiveId = nextLevel ? nextLevel.id : -1;
    const hasWeakConcepts = Object.values(conceptMastery ?? {}).some((score) => (score as number) < 60);

    const loadMoreUnits = useCallback(() => {
        if (isLoadingMore) return;
        setIsLoadingMore(true);
        setTimeout(() => {
            const lastUnit = displayedUnits[displayedUnits.length - 1];
            const nextUnitId = lastUnit.id + 1;
            const startLevelId = nextUnitId * 100 + 1;
            const newUnit = generateRandomUnit(nextUnitId, startLevelId);
            setDisplayedUnits(prev => [...prev, newUnit]);
            setIsLoadingMore(false);
        }, 1500);
    }, [displayedUnits, isLoadingMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) loadMoreUnits(); },
            { root: scrollRef.current, threshold: 0.5, rootMargin: '100px' }
        );
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => { if (loaderRef.current) observer.unobserve(loaderRef.current); };
    }, [loadMoreUnits]);

    useEffect(() => {
        const scrollToCurrent = () => {
            if (currentActiveId !== -1) {
                const activeEl = document.getElementById(`level-${currentActiveId}`);
                if (activeEl) {
                    // Ajuste no scrollIntoView para centralizar melhor considerando o header fixo
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
            const nextLevelId = visibleLevels[visibleLevels.findIndex(l => l.id === lastCompletedLevelId) + 1]?.id;
            const sequence = async () => {
                const completedEl = document.getElementById(`level-${lastCompletedLevelId}`);
                if (completedEl) completedEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await new Promise(r => setTimeout(r, 800));
                if (nextLevelId) {
                    const nextEl = document.getElementById(`level-${nextLevelId}`);
                    if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
            const diff = (lastHeartLostTime + HEART_REFILL_TIME_MS) - Date.now();
            if (diff <= 0) setTimeToRefill('00:00');
            else {
                const m = Math.floor((diff / 1000 / 60));
                const s = Math.floor((diff / 1000) % 60);
                setTimeToRefill(`${m}:${s < 10 ? '0' : ''}${s}`);
            }
        };
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [userHearts, lastHeartLostTime]);

    useEffect(() => {
        const updateQuestTimer = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setHours(24, 0, 0, 0);
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
        // FIX: Usar 'h-screen' ou '100dvh' (dynamic viewport height) para mobile browsers
        <div 
            className="flex flex-col w-full bg-neutral-200 dark:bg-neutral-900 relative transition-colors duration-300 overflow-hidden"
            style={{ height: '100dvh' }} 
        >
            
            {/* FIX DO HEADER: 
               1. Mudei de 'sticky' para 'fixed'. Isso força ele a ficar no topo da tela (viewport) independente do scroll.
               2. 'top-0 left-0 right-0' garante que ocupe a largura total.
               3. 'z-50' garante que fique acima de tudo.
            */}
            <header 
                className="fixed top-0 left-0 right-0 z-50 bg-neutral-200/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b-2 border-neutral-300 dark:border-neutral-800 flex items-center justify-between px-4 py-3 shadow-sm no-select"
                style={{ 
                    // Garante espaço para o notch do iPhone
                    paddingTop: 'calc(0.75rem + env(safe-area-inset-top))',
                    height: 'calc(60px + env(safe-area-inset-top))' // Define altura fixa para calcularmos o padding do conteúdo depois
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

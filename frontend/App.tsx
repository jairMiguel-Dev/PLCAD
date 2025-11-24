import React, { useState, useEffect } from 'react';
import { Home } from './screens/Home';
import { Lesson } from './screens/Lesson';
import { Result } from './screens/Result';
import { Splash } from './screens/Splash';
import { Profile } from './screens/Profile';
import { Shop } from './screens/Shop';
import { Review } from './screens/Review';
import { ModuleSelection } from './screens/ModuleSelection';
import { PaymentSuccess } from './screens/PaymentSuccess';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import { FrameworkChoice } from './screens/FrameworkChoice';
import { Achievements } from './screens/Achievements';
import { CodeDebug } from './screens/CodeDebug';
import { BottomNav } from './components/BottomNav';
import { OnboardingOverlay } from './components/OnboardingOverlay';
import { TermsOverlay } from './components/TermsOverlay';
import { HeartRefillModal } from './components/HeartRefillModal';
import { ResizableContainer } from './components/ResizableContainer';
import { ScreenState, Level, UserStats, LessonResult, Achievement, ShopItem, ModuleType, Quest, ReviewConcept, QuestionType, Question } from './types';
import { MAX_HEARTS, CURRICULUM, calculateLevel, ACHIEVEMENTS, HEART_REFILL_TIME_MS, DAILY_QUEST_TEMPLATES, getLevelById } from './constants';

const INITIAL_STATS: UserStats = {
    hearts: MAX_HEARTS,
    totalXP: 0,
    level: 1,
    streakDays: 1,
    gems: 0,
    completedLevels: [],
    unlockedAchievements: [],
    lessonsCompleted: 0,
    perfectLessons: 0,
    isPremium: false,
    lastHeartLostTime: null,
    hasSeenOnboarding: false,
    selectedModule: null,
    activeQuests: [],
    lastQuestGenDate: null,
    settings: {
        soundEnabled: true,
        hapticsEnabled: true,
        theme: 'light'
    },
    username: 'Dev',
    hasAcceptedTerms: true, // true por padrão, será false apenas após cadastro
    conceptMastery: {},
    skipTokens: 0,
};

const App: React.FC = () => {
    const [screen, setScreen] = useState<ScreenState>(ScreenState.SPLASH);
    const [showHeartModal, setShowHeartModal] = useState(false);
    const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
    const [lastLessonResult, setLastLessonResult] = useState<LessonResult | null>(null);
    const [lastCompletedLevelId, setLastCompletedLevelId] = useState<number | null>(null);
    const [isSmartWorkout, setIsSmartWorkout] = useState(false);
    const [showTermsManual, setShowTermsManual] = useState(false);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [customLevel, setCustomLevel] = useState<Level | null>(null);

    const handleAcceptTerms = () => {
        setUserStats(prev => ({
            ...prev,
            hasAcceptedTerms: true
        }));
    };

    const handleUpdateUsername = (name: string) => {
        setUserStats(prev => ({
            ...prev,
            username: name
        }));
    };

    // --- PERSISTENT GAME STATE ---
    const [userStats, setUserStats] = useState<UserStats>(() => {
        try {
            const savedData = localStorage.getItem('progres_user_v3');
            return savedData ? JSON.parse(savedData) : INITIAL_STATS;
        } catch (e) {
            console.error("Failed to load save data", e);
            return INITIAL_STATS;
        }
    });

    // Persist state & Apply Theme
    useEffect(() => {
        localStorage.setItem('progres_user_v3', JSON.stringify(userStats));

        // Theme Logic
        if (userStats.settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [userStats]);

    // --- QUEST SYSTEM LOGIC ---
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];

        // Generate new quests if needed
        if (userStats.lastQuestGenDate !== today) {
            const shuffled = [...DAILY_QUEST_TEMPLATES].sort(() => 0.5 - Math.random());
            const newQuests: Quest[] = shuffled.slice(0, 3).map(q => ({
                ...q,
                current: 0,
                completed: false,
                claimed: false
            }));

            setUserStats(prev => ({
                ...prev,
                activeQuests: newQuests,
                lastQuestGenDate: today
            }));
        }
    }, [userStats.lastQuestGenDate]);

    const updateQuests = (type: 'lesson' | 'xp' | 'perfect' | 'streak', amount: number = 1) => {
        setUserStats(prev => {
            const updatedQuests = prev.activeQuests.map(q => {
                if (q.type === type && !q.completed) {
                    const newCurrent = q.current + amount;
                    return { ...q, current: newCurrent, completed: newCurrent >= q.target };
                }
                return q;
            });
            return { ...prev, activeQuests: updatedQuests };
        });
    };

    const handleClaimQuest = (id: string) => {
        const quest = userStats.activeQuests.find(q => q.id === id);
        if (quest && quest.completed && !quest.claimed) {
            setUserStats(prev => ({
                ...prev,
                gems: prev.gems + quest.reward,
                activeQuests: prev.activeQuests.map(q => q.id === id ? { ...q, claimed: true } : q)
            }));
        }
    };

    const handleResetQuest = (questId: string) => {
        const RESET_COST = 50;
        if (userStats.gems < RESET_COST) return;

        setUserStats(prev => {
            // Encontrar a missão antiga
            const oldQuest = prev.activeQuests.find(q => q.id === questId);
            if (!oldQuest) return prev;

            // Determinar dificuldade da missão pela recompensa
            let questPool = DAILY_QUEST_TEMPLATES.filter(q => q.id !== questId);

            // Filtrar por dificuldade similar (baseado na recompensa)
            if (oldQuest.reward <= 20) {
                questPool = questPool.filter(q => q.reward <= 20); // Fáceis
            } else if (oldQuest.reward <= 60) {
                questPool = questPool.filter(q => q.reward > 20 && q.reward <= 60); // Médias
            } else {
                questPool = questPool.filter(q => q.reward > 60); // Difíceis
            }

            // Selecionar uma nova missão aleatória
            const newQuestTemplate = questPool[Math.floor(Math.random() * questPool.length)];
            const newQuest: Quest = {
                ...newQuestTemplate,
                current: 0,
                completed: false,
                claimed: false
            };

            return {
                ...prev,
                gems: prev.gems - RESET_COST,
                activeQuests: prev.activeQuests.map(q => q.id === questId ? newQuest : q)
            };
        });
    };

    // --- AUTH LOGIC ---
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (screen === ScreenState.SPLASH && token) {
            setAuthToken(token);
            // Fetch user data to sync progress
            fetchUserProgress(token);
        }
    }, [screen]);

    const fetchUserProgress = async (token: string) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/progress', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.progress && data.isPremium) {
                setUserStats(prev => ({ ...prev, ...data.progress, isPremium: data.isPremium }));
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    };

    const handleLogin = async (token: string, user: any) => {
        setAuthToken(token);
        setUserId(user.id);

        // Carregar progresso do servidor para qualquer usuário
        try {
            const response = await fetch('http://localhost:5000/api/auth/progress', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            // Se tem progresso salvo no servidor, usar ele
            if (data.progress) {
                setUserStats(prev => ({
                    ...prev,
                    ...data.progress,
                    isPremium: user.isPremium,
                    username: user.username
                }));
            } else {
                // Se não tem progresso no servidor, manter o local
                setUserStats(prev => ({
                    ...prev,
                    isPremium: user.isPremium,
                    username: user.username
                }));
            }
        } catch (error) {
            console.error('Error loading progress:', error);
            setUserStats(prev => ({
                ...prev,
                isPremium: user.isPremium,
                username: user.username
            }));
        }

        // Verificar módulo selecionado após carregar stats
        setTimeout(() => {
            if (!userStats.selectedModule) {
                setScreen(ScreenState.MODULE_SELECTION);
            } else {
                setScreen(ScreenState.HOME);
            }
        }, 100);
    };

    const handleRegister = (token: string, user: any) => {
        setAuthToken(token);
        setUserId(user.id);
        // Novo usuário - não aceitou termos ainda
        setUserStats(prev => ({ ...prev, username: user.username, isPremium: user.isPremium, hasAcceptedTerms: false }));
        // Os termos vão aparecer automaticamente porque hasAcceptedTerms = false
        setScreen(ScreenState.MODULE_SELECTION);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        setAuthToken(null);
        setUserId(null);
        setUserStats(INITIAL_STATS);
        setScreen(ScreenState.LOGIN);
    };


    // Check Unit 1 completion and show Framework Choice for premium users
    useEffect(() => {
        if (
            userStats.isPremium &&
            isUnit1Complete() &&
            screen === ScreenState.HOME &&
            !userStats.selectedModule
        ) {
            // Show framework choice if premium, Unit 1 complete, and no module selected yet
            setScreen(ScreenState.FRAMEWORK_CHOICE);
        }
    }, [userStats.completedLevels, userStats.isPremium, screen]);



    const handleDeleteAccount = async () => {
        if (!authToken) return;

        // Confirmação dupla
        const confirmMessage = 'Tem certeza que deseja EXCLUIR SUA CONTA permanentemente?\n\n⚠️ ESTA AÇÃO NÃO PODE SER DESFEITA!\n\nTodos os seus dados serão permanentemente apagados:\n- Progresso completo\n- XP e níveis\n- Conquistas\n- Histórico de assinaturas\n\nDigite "EXCLUIR" para confirmar:';

        const userInput = prompt(confirmMessage);

        if (userInput !== 'EXCLUIR') {
            alert('Exclusão cancelada.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/account', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                alert('✅ Conta excluída com sucesso.');
                // Limpar tudo e voltar para login
                localStorage.removeItem('auth_token');
                localStorage.removeItem('progres_user_v3');
                setAuthToken(null);
                setUserId(null);
                setUserStats(INITIAL_STATS);
                setScreen(ScreenState.LOGIN);
            } else {
                const error = await response.json();
                alert('❌ Erro ao excluir conta: ' + error.error);
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('❌ Erro ao excluir conta. Tente novamente.');
        }
    };



    // Sync progress to backend for all authenticated users
    useEffect(() => {
        if (authToken) {
            const syncProgress = async () => {
                try {
                    await fetch('http://localhost:5000/api/auth/progress', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
                        },
                        body: JSON.stringify({ progress: userStats })
                    });
                } catch (error) {
                    console.error('Error syncing progress:', error);
                }
            };
            const timer = setTimeout(syncProgress, 2000); // Debounce 2s
            return () => clearTimeout(timer);
        }
    }, [userStats, authToken]);

    // --- ROUTING LOGIC ---
    const handleSplashFinish = () => {
        // Check if returning from Stripe payment
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        if (sessionId) {
            setScreen(ScreenState.PAYMENT_SUCCESS);
            return;
        }

        // Check auth
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setScreen(ScreenState.LOGIN);
            return;
        }

        if (!userStats.selectedModule) {
            setScreen(ScreenState.MODULE_SELECTION);
        } else {
            setScreen(ScreenState.HOME);
        }
    };

    // --- HEART REGENERATION LOOP ---
    useEffect(() => {
        if (userStats.hearts >= MAX_HEARTS || !userStats.lastHeartLostTime) return;

        const checkRegen = () => {
            const now = Date.now();
            const timePassed = now - userStats.lastHeartLostTime!;

            if (timePassed >= HEART_REFILL_TIME_MS) {
                const heartsToRecover = Math.floor(timePassed / HEART_REFILL_TIME_MS);

                if (heartsToRecover > 0) {
                    setUserStats(prev => {
                        const newHearts = Math.min(MAX_HEARTS, prev.hearts + heartsToRecover);
                        return {
                            ...prev,
                            hearts: newHearts,
                            lastHeartLostTime: newHearts === MAX_HEARTS
                                ? null
                                : prev.lastHeartLostTime! + (heartsToRecover * HEART_REFILL_TIME_MS)
                        };
                    });
                }
            }
        };

        checkRegen();
        const interval = setInterval(checkRegen, 60000);
        return () => clearInterval(interval);
    }, [userStats.hearts, userStats.lastHeartLostTime]);

    const getLevelData = (id: number): Level | undefined => {
        return getLevelById(id);
    };

    const handleStartLevel = (id: number) => {
        if (userStats.hearts <= 0 && !userStats.isPremium) {
            setShowHeartModal(true);
            return;
        }
        setActiveLevelId(id);
        setIsSmartWorkout(false);
        setScreen(ScreenState.LESSON);
    };

    const handleStartSmartWorkout = () => {
        if (userStats.hearts <= 0 && !userStats.isPremium) {
            setShowHeartModal(true);
            return;
        }
        // Mock "Smart" ID - in Lesson we will handle this
        setActiveLevelId(99999);
        setIsSmartWorkout(true);
        setScreen(ScreenState.LESSON);
    };

    const updateHearts = (newHearts: number) => {
        if (userStats.isPremium) return;

        setUserStats(prev => {
            const isLosing = newHearts < prev.hearts;
            let newTimer = prev.lastHeartLostTime;

            if (isLosing && prev.hearts === MAX_HEARTS) {
                newTimer = Date.now();
            }
            if (newHearts >= MAX_HEARTS) {
                newTimer = null;
            }
            return { ...prev, hearts: newHearts, lastHeartLostTime: newTimer };
        });
    };

    const handleBuyItem = async (item: ShopItem) => {
        let becamePremium = false;

        setUserStats(prev => {
            let updates: Partial<UserStats> = {};
            if (item.type === 'currency_pack') {
                updates = { gems: prev.gems + (item.gemAmount || 0) };
            } else if (item.type === 'subscription') {
                updates = { isPremium: true, hearts: MAX_HEARTS, lastHeartLostTime: null };
                becamePremium = true;
            } else {
                if (item.id === 'refill_hearts') {
                    updates = { hearts: MAX_HEARTS, gems: prev.gems - item.cost, lastHeartLostTime: null };
                } else if (item.id === 'skip_question') {
                    updates = { skipTokens: prev.skipTokens + 1, gems: prev.gems - item.cost };
                } else if (item.id === 'quest_reset') {
                    // Gerar 3 novas missões imediatamente
                    const shuffled = [...DAILY_QUEST_TEMPLATES].sort(() => 0.5 - Math.random());
                    const newQuests: Quest[] = shuffled.slice(0, 3).map(q => ({
                        ...q,
                        current: 0,
                        completed: false,
                        claimed: false
                    }));
                    updates = {
                        activeQuests: newQuests,
                        gems: prev.gems - item.cost
                    };
                } else if (item.id === 'streak_freeze') {
                    updates = { gems: prev.gems - item.cost };
                }
            }
            return { ...prev, ...updates };
        });

        // Se acabou de se tornar premium, salvar progresso imediatamente
        if (becamePremium && authToken) {
            try {
                await fetch('http://localhost:5000/api/auth/premium', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({ isPremium: true })
                });

                // Salvar progresso atual
                await fetch('http://localhost:5000/api/auth/progress', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({ progress: userStats })
                });
            } catch (error) {
                console.error('Error updating premium status:', error);
            }
        }

        if (item.id === 'refill_hearts' || item.type === 'subscription') {
            setShowHeartModal(false);
        }
    };
    const handleCancelPremium = async () => {
        if (!authToken) return;
        try {
            // Update premium status on backend to false
            await fetch('http://localhost:5000/api/auth/premium', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ isPremium: false })
            });
            // Update local state
            setUserStats(prev => ({ ...prev, isPremium: false }));
            // Optionally sync progress after cancellation
            await fetch('http://localhost:5000/api/auth/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ progress: userStats })
            });
        } catch (error) {
            console.error('Error cancelling premium status:', error);
        }
    };

    const handleLessonComplete = (result: LessonResult) => {
        updateQuests('lesson');
        updateQuests('xp', result.totalXP);
        if (result.mistakeCount === 0) updateQuests('perfect');
        updateQuests('streak', userStats.streakDays); // Atualiza com o valor atual da streak

        // --- ADAPTIVE LEARNING LOGIC ---
        // We update the concept mastery based on performance.
        // If the level was "Smart Workout" (99999), we find concepts differently or just boost general.
        // For normal levels, we get concepts from the level data.

        let currentConcepts: string[] = [];
        if (activeLevelId === 88888 && customLevel) {
            currentConcepts = customLevel.learnableConcepts?.map(c => c.term) || [];
        } else if (activeLevelId && activeLevelId !== 99999) {
            const level = getLevelData(activeLevelId);
            if (level) {
                currentConcepts = level.learnableConcepts?.map(c => c.term) || [];
            }
        }

        setUserStats(prev => {
            const newTotalXP = prev.totalXP + result.totalXP;
            const newLevel = calculateLevel(newTotalXP);

            let newCompletedLevels = prev.completedLevels;
            if (activeLevelId && activeLevelId !== 99999 && !prev.completedLevels.includes(activeLevelId)) {
                newCompletedLevels = [...prev.completedLevels, activeLevelId];
            }

            // Calculate Mastery Changes
            const updatedMastery = { ...prev.conceptMastery };
            currentConcepts.forEach(concept => {
                const currentScore = updatedMastery[concept] || 0;
                // Formula: High accuracy = +10, Mistakes = -10 per mistake (clamped)
                let change = 10;
                if (result.mistakeCount > 0) {
                    change = -(result.mistakeCount * 10);
                }
                // Clamp between 0 and 100
                updatedMastery[concept] = Math.min(100, Math.max(0, currentScore + change));
            });

            const newlyUnlocked: Achievement[] = [];
            ACHIEVEMENTS.forEach(ach => {
                if (!prev.unlockedAchievements.includes(ach.id)) {
                    const simulatedStats = { ...prev, totalXP: newTotalXP, lessonsCompleted: prev.lessonsCompleted + 1 };
                    if (ach.condition(simulatedStats, result)) { newlyUnlocked.push(ach); }
                }
            });

            return {
                ...prev,
                totalXP: newTotalXP,
                level: newLevel,
                gems: prev.gems + 8 + (result.perfectBonus > 0 ? 5 : 0), // Reduzido de 20+10 para 8+5
                completedLevels: newCompletedLevels,
                lessonsCompleted: activeLevelId === 99999 ? prev.lessonsCompleted + 1 : newCompletedLevels.length,
                perfectLessons: result.mistakeCount === 0 ? prev.perfectLessons + 1 : prev.perfectLessons,
                unlockedAchievements: [...prev.unlockedAchievements, ...newlyUnlocked.map(a => a.id)],
                conceptMastery: updatedMastery
            };
        });

        setLastLessonResult({ ...result, newAchievements: [] }); // Achievements handled visually in stats update, simpler for now to pass empty or fix logic if needed
        setScreen(ScreenState.RESULT);
    };

    const handleQuitLesson = () => {
        setScreen(ScreenState.HOME);
        if (userStats.hearts <= 0 && !userStats.isPremium) {
            setShowHeartModal(true);
        }
    };

    const handleSelectModule = (module: ModuleType) => {
        setUserStats(prev => ({ ...prev, selectedModule: module }));
        setScreen(ScreenState.HOME);
    };

    const toggleSetting = (key: 'soundEnabled' | 'hapticsEnabled') => {
        setUserStats(prev => ({
            ...prev,
            settings: { ...prev.settings, [key]: !prev.settings[key] }
        }));
    };

    const setMode = (theme: 'light' | 'dark') => {
        setUserStats(prev => ({
            ...prev,
            settings: { ...prev.settings, theme: theme }
        }));
    };

    // Check if Unit 1 is complete (all 10 levels from 101-110)
    const isUnit1Complete = () => {
        const unit1Levels = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110];
        return unit1Levels.every(id => userStats.completedLevels.includes(id));
    };

    const handleFrameworkSelect = (framework: ModuleType.REACT | ModuleType.NODEJS) => {
        setUserStats(prev => ({ ...prev, selectedModule: framework }));
        setScreen(ScreenState.HOME);
    };

    const handleContinueVanilla = () => {
        setScreen(ScreenState.HOME);
    };

    const handlePracticeConcept = (conceptTerm: string) => {
        // Encontrar níveis que ensinam este conceito
        const relevantLevels = CURRICULUM.flatMap(u => u.levels).filter(l =>
            l.learnableConcepts?.some(c => c.term === conceptTerm)
        );

        let practiceQuestions = relevantLevels.flatMap(l => l.questions);

        // Se não tiver questões suficientes, pegar de níveis completados aleatórios para preencher
        if (practiceQuestions.length < 5) {
            const completed = CURRICULUM.flatMap(u => u.levels).filter(l => userStats.completedLevels.includes(l.id));
            const extraQuestions = completed.flatMap(l => l.questions).filter(q => !practiceQuestions.includes(q));
            practiceQuestions = [...practiceQuestions, ...extraQuestions];
        }

        // Filtrar questões incompletas (ex.: falta opções ou respostas)
        const isValid = (q) => {
            switch (q.type) {
                case QuestionType.MULTIPLE_CHOICE:
                case QuestionType.PAIR_MATCH:
                case QuestionType.TRANSLATION:
                    return q.options && q.options.length > 0;
                case QuestionType.CODE_BUILDER:
                    return q.options && q.options.length > 0;
                case QuestionType.FILL_IN_BLANK:
                    return !!q.correctAnswer;
                case QuestionType.DRAG_AND_DROP:
                    return q.segments && q.segments.length > 0;
                default:
                    return true;
            }
        };
        practiceQuestions = practiceQuestions.filter(isValid);

        // Embaralhar e pegar 5
        const selectedQuestions = practiceQuestions.sort(() => Math.random() - 0.5).slice(0, 5);

        if (selectedQuestions.length === 0) {
            alert("Não há questões suficientes para praticar este conceito ainda. Complete mais lições!");
            return;
        }

        // Encontrar o objeto do conceito para o mastery
        let conceptObj: ReviewConcept | undefined;
        for (const unit of CURRICULUM) {
            for (const level of unit.levels) {
                const found = level.learnableConcepts?.find(c => c.term === conceptTerm);
                if (found) {
                    conceptObj = found;
                    break;
                }
            }
            if (conceptObj) break;
        }

        const practiceLevel: Level = {
            id: 88888, // ID especial para prática de conceito
            title: `Prática: ${conceptTerm}`,
            description: 'Reforço focado',
            color: 'info',
            icon: 'zap',
            totalQuestions: selectedQuestions.length,
            stars: 0,
            questions: selectedQuestions,
            learnableConcepts: conceptObj ? [conceptObj] : []
        };

        setCustomLevel(practiceLevel);
        setActiveLevelId(88888);
        setScreen(ScreenState.LESSON);
    };

    const handleDebugChallengeComplete = (xp: number) => {
        setUserStats(prev => ({
            ...prev,
            totalXP: prev.totalXP + xp,
            level: calculateLevel(prev.totalXP + xp)
        }));
    };

    const renderContent = () => {
        switch (screen) {
            case ScreenState.SPLASH: return <Splash onFinish={handleSplashFinish} />;
            case ScreenState.LOGIN: return <Login onLogin={handleLogin} onSwitchToRegister={() => setScreen(ScreenState.REGISTER)} />;
            case ScreenState.REGISTER: return <Register onRegister={handleRegister} onSwitchToLogin={() => setScreen(ScreenState.LOGIN)} />;
            case ScreenState.MODULE_SELECTION: return <ModuleSelection onSelectModule={handleSelectModule} onBack={() => { }} />;
            case ScreenState.FRAMEWORK_CHOICE:
                return (
                    <FrameworkChoice
                        onSelect={handleFrameworkSelect}
                        onContinueVanilla={handleContinueVanilla}
                    />
                );
            case ScreenState.HOME:
                return (
                    <Home
                        onStartLevel={handleStartLevel}
                        onStartSmartWorkout={handleStartSmartWorkout}
                        onStartDebug={() => setScreen(ScreenState.CODE_DEBUG)}
                        completedLevels={userStats.completedLevels}
                        userGems={userStats.gems}
                        userStreak={userStats.streakDays}
                        userHearts={userStats.hearts}
                        lastCompletedLevelId={lastCompletedLevelId}
                        onAnimationComplete={() => setLastCompletedLevelId(null)}
                        lastHeartLostTime={userStats.lastHeartLostTime}
                        quests={userStats.activeQuests}
                        onClaimQuest={handleClaimQuest}
                        onResetQuest={handleResetQuest}
                        conceptMastery={userStats.conceptMastery}
                    />
                );
            case ScreenState.LESSON:
                let levelData: Level | undefined;
                if (isSmartWorkout) {
                    // Generate Adaptive Level
                    // Find weak concepts (mastery < 60)
                    const weakConcepts = Object.entries(userStats.conceptMastery)
                        .filter(([_, score]: [string, number]) => score < 60)
                        .map(([term]) => term);

                    // Fallback if no weak concepts or not enough data
                    const targetConcepts = weakConcepts.length > 0 ? weakConcepts : ['Review'];

                    // Collect questions for Smart Workout
                    let smartWorkoutQuestions: Question[] = [];
                    const allLevels = CURRICULUM.flatMap(u => u.levels);

                    // Prioritize questions from weak concepts
                    if (weakConcepts.length > 0) {
                        const weakConceptLevels = allLevels.filter(l =>
                            l.learnableConcepts?.some(c => weakConcepts.includes(c.term))
                        );
                        smartWorkoutQuestions = weakConceptLevels.flatMap(l => l.questions);
                    }

                    // If not enough questions, or if 'Review' is the target, pull from completed levels
                    if (smartWorkoutQuestions.length < 5 || targetConcepts[0] === 'Review') {
                        const completedLevels = allLevels.filter(l => userStats.completedLevels.includes(l.id));
                        const extraQuestions = completedLevels.flatMap(l => l.questions);
                        // Add unique questions from completed levels, avoiding duplicates
                        smartWorkoutQuestions = [...new Set([...smartWorkoutQuestions, ...extraQuestions])];
                    }

                    // Filter for valid questions (similar to handlePracticeConcept)
                    const isValid = (q) => {
                        switch (q.type) {
                            case QuestionType.MULTIPLE_CHOICE:
                            case QuestionType.PAIR_MATCH:
                            case QuestionType.TRANSLATION:
                                return q.options && q.options.length > 0;
                            case QuestionType.CODE_BUILDER:
                                return q.options && q.options.length > 0;
                            case QuestionType.FILL_IN_BLANK:
                                return !!q.correctAnswer;
                            case QuestionType.DRAG_AND_DROP:
                                return q.segments && q.segments.length > 0;
                            default:
                                return true;
                        }
                    };
                    smartWorkoutQuestions = smartWorkoutQuestions.filter(isValid);

                    // Shuffle and take the desired number of questions
                    const selectedSmartWorkoutQuestions = smartWorkoutQuestions.sort(() => Math.random() - 0.5).slice(0, 5);

                    levelData = {
                        id: 99999,
                        title: "Smart Workout",
                        description: `Focando em: ${targetConcepts.slice(0, 2).join(', ')}...`,
                        color: 'secondary',
                        icon: 'zap',
                        totalQuestions: selectedSmartWorkoutQuestions.length,
                        stars: 0,
                        learnableConcepts: [],
                        questions: selectedSmartWorkoutQuestions, // Adicionado questions aqui
                    };
                } else if (activeLevelId === 88888 && customLevel) {
                    levelData = customLevel;
                } else {
                    levelData = getLevelData(activeLevelId!);
                }

                if (!levelData) return <div>Erro ao carregar nível</div>;
                return (
                    <Lesson
                        key={activeLevelId}
                        level={levelData}
                        hearts={userStats.hearts}
                        isPremium={userStats.isPremium}
                        setHearts={updateHearts}
                        onComplete={handleLessonComplete}
                        onQuit={handleQuitLesson}
                        skipTokens={userStats.skipTokens}
                        onUseSkip={() => setUserStats(prev => ({ ...prev, skipTokens: prev.skipTokens - 1 }))}
                    />
                );
            case ScreenState.RESULT:
                if (!lastLessonResult) return null;
                return <Result result={lastLessonResult} userStats={userStats} onHome={() => { setLastCompletedLevelId(activeLevelId); setScreen(ScreenState.HOME); }} />;
            case ScreenState.PROFILE:
                return (
                    <Profile
                        stats={userStats}
                        onToggleSetting={toggleSetting}
                        onSetTheme={setMode}
                        onCancelPremium={handleCancelPremium}
                        onShowTerms={() => setShowTermsManual(true)}
                        onUpdateUsername={handleUpdateUsername}
                        onLogout={handleLogout}
                        onDeleteAccount={handleDeleteAccount}
                        onViewAllAchievements={() => setScreen(ScreenState.ACHIEVEMENTS)}
                    />
                );
            case ScreenState.ACHIEVEMENTS: return <Achievements userStats={userStats} onBack={() => setScreen(ScreenState.PROFILE)} />;
            case ScreenState.SHOP: return <Shop userStats={userStats} onBuyItem={handleBuyItem} />;
            case ScreenState.REVIEW: return <Review completedLevels={userStats.completedLevels} conceptMastery={userStats.conceptMastery} onPracticeConcept={handlePracticeConcept} />;
            case ScreenState.CODE_DEBUG:
                return (
                    <CodeDebug
                        onBack={() => setScreen(ScreenState.HOME)}
                        onChallengeComplete={handleDebugChallengeComplete}
                        userHearts={userStats.hearts}
                        isPremium={userStats.isPremium}
                    />
                );
            case ScreenState.PAYMENT_SUCCESS: return <PaymentSuccess onContinue={() => setScreen(ScreenState.HOME)} />;
            default: return null;
        }
    };

    const showNav = [ScreenState.HOME, ScreenState.PROFILE, ScreenState.SHOP, ScreenState.REVIEW].includes(screen);

    const handleOnboardingComplete = () => {
        setUserStats(prev => ({ ...prev, hasSeenOnboarding: true }));
    };

    return (
        <ResizableContainer>
            <div className="flex-1 overflow-hidden relative">
                {renderContent()}
            </div>

            {showNav && <BottomNav activeScreen={screen} onNavigate={setScreen} />}

            {screen === ScreenState.HOME && !userStats.hasSeenOnboarding && userStats.hasAcceptedTerms && (
                <OnboardingOverlay onComplete={handleOnboardingComplete} />
            )}

            <TermsOverlay
                isVisible={(authToken && !userStats.hasAcceptedTerms) || showTermsManual}
                onAccept={handleAcceptTerms}
                isReadOnly={userStats.hasAcceptedTerms || showTermsManual}
                onClose={() => setShowTermsManual(false)}
            />

            {showHeartModal && (
                <HeartRefillModal
                    onClose={() => setShowHeartModal(false)}
                    onGoToShop={() => { setShowHeartModal(false); setScreen(ScreenState.SHOP); }}
                    nextRefillTime={userStats.lastHeartLostTime}
                />
            )}
        </ResizableContainer>
    );
};

export default App;

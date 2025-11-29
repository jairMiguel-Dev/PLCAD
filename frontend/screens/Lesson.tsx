import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { FeedbackModal } from '../components/FeedbackModal';
import { TheoryCard } from '../components/TheoryCard';
import { TheoryScreen } from '../components/TheoryScreen';
import { Level, QuestionType, PairItem, LessonResult } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { BASE_XP_PER_QUESTION, COMBO_BONUS_MULTIPLIER, PERFECT_LESSON_BONUS } from '../constants';
import { Volume2, Flame, Zap, Check } from 'lucide-react';

interface LessonProps {
    level: Level;
    hearts: number;
    isPremium: boolean;
    setHearts: (n: number) => void;
    onComplete: (result: LessonResult) => void;
    onQuit: () => void;
    skipTokens: number;
    onUseSkip: () => void;
}

export const Lesson: React.FC<LessonProps> = ({
    level,
    hearts,
    isPremium,
    setHearts,
    onComplete,
    onQuit,
    skipTokens,
    onUseSkip
}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Theory State
    const [showTheory, setShowTheory] = useState(false);
    const [seenTheoryConcepts, setSeenTheoryConcepts] = useState<Set<string>>(new Set());

    // Generic State
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCheckSubmitted, setIsCheckSubmitted] = useState(false);
    const [feedbackState, setFeedbackState] = useState<'correct' | 'wrong' | null>(null);

    // Gamification State
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [mistakeCount, setMistakeCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);

    // Matching Game State
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
    const [selectedPairId, setSelectedPairId] = useState<string | null>(null);
    const [shuffledPairs, setShuffledPairs] = useState<PairItem[]>([]);
    const [wrongPairIds, setWrongPairIds] = useState<string[]>([]);

    // Drag & Drop State
    const [availableSegments, setAvailableSegments] = useState<{ id: string, text: string }[]>([]);
    const [selectedSegments, setSelectedSegments] = useState<{ id: string, text: string }[]>([]);

    // Fill in Blank State
    const [inputValue, setInputValue] = useState('');

    // Listening State
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    const currentQuestion = level.questions[currentQuestionIndex];

    if (!currentQuestion) {
        return <div className="flex items-center justify-center h-full text-white">Carregando...</div>;
    }

    const isTheory = currentQuestion.type === QuestionType.THEORY;
    const isMatching = currentQuestion.type === QuestionType.PAIR_MATCH;
    const isDragDrop = currentQuestion.type === QuestionType.DRAG_AND_DROP;
    const isFillBlank = currentQuestion.type === QuestionType.FILL_IN_BLANK;
    const isListening = currentQuestion.type === QuestionType.LISTENING;
    const isSpeaking = currentQuestion.type === QuestionType.SPEAKING;

    // Check for instant game over on mount if 0 hearts (double safety)
    useEffect(() => {
        if (hearts <= 0 && !isPremium) {
            onQuit();
        }
    }, [hearts, isPremium, onQuit]);

    useEffect(() => {
        // Reset states when question changes
        setSelectedOption(null);
        setIsCheckSubmitted(false);
        setFeedbackState(null);
        setInputValue('');
        setIsPlayingAudio(false);

        // Check if this question has theory that hasn't been shown yet
        // FORCE SHOW THEORY IF IT IS A THEORY QUESTION TYPE
        const shouldShowTheory = currentQuestion.theory && (
            currentQuestion.type === QuestionType.THEORY ||
            !seenTheoryConcepts.has(currentQuestion.theory.concept)
        );

        if (shouldShowTheory) {
            setShowTheory(true);
            return; // Interrompe inicialização do exercício para focar na teoria
        }

        // Init Matching
        if (isMatching && currentQuestion.pairs) {
            const shuffled = [...currentQuestion.pairs].sort(() => Math.random() - 0.5);
            setShuffledPairs(shuffled);
            setMatchedPairs([]);
            setSelectedPairId(null);
            setWrongPairIds([]);
        }

        // Init Drag & Drop
        if (isDragDrop && currentQuestion.segments) {
            const allSegments = [
                ...currentQuestion.segments,
                ...(currentQuestion.distractors || [])
            ].map((text, i) => ({ id: `seg-${i}`, text }));
            setAvailableSegments(allSegments.sort(() => Math.random() - 0.5));
            setSelectedSegments([]);
        }

        if (isListening && currentQuestion.englishWord) {
            setTimeout(() => playAudio(currentQuestion.englishWord!), 500);
        }

    }, [currentQuestionIndex, isMatching, isDragDrop, isListening, currentQuestion]);

    const playAudio = (text: string) => {
        setIsPlayingAudio(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
    };

    // --- HANDLERS ---

    const incrementCombo = () => {
        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo > maxCombo) setMaxCombo(newCombo);
        setCorrectCount(prev => prev + 1);
    };

    const resetCombo = () => {
        setCombo(0);
        setMistakeCount(prev => prev + 1);
    };

    const handleCheck = () => {
        if (isMatching) return;

        let isCorrect = false;

        if (isDragDrop) {
            const userOrder = selectedSegments.map(s => s.text).join('');
            const correctOrder = currentQuestion.segments?.join('') || '';
            isCorrect = userOrder === correctOrder;
        } else if (isFillBlank) {
            isCorrect = inputValue.trim().toLowerCase() === currentQuestion.correctAnswer?.trim().toLowerCase();
        } else if (isListening) {
            const correctOption = currentQuestion.options.find(o => o.isCorrect);
            isCorrect = selectedOption === correctOption?.id;
        } else if (isSpeaking) {
            // Speaking is auto-validated or assumed correct if 'spoken' is selected
            isCorrect = selectedOption === 'spoken';
        } else {
            const correctOption = currentQuestion.options.find(o => o.isCorrect);
            isCorrect = selectedOption === correctOption?.id;
        }

        setIsCheckSubmitted(true);

        if (isCorrect) {
            setFeedbackState('correct');
            incrementCombo();
            playAudio('Correct!');
        } else {
            setFeedbackState('wrong');
            // HARDCORE MODE: Lose Heart immediately
            if (!isPremium) {
                setHearts(hearts - 1);
            }
            resetCombo();
            playAudio('Wrong.');
        }
    };

    const handleContinue = () => {
        // GAME OVER CHECK
        if (hearts <= 0 && !isPremium) {
            onQuit();
            return;
        }

        // HARDCORE MODE: If it was wrong, we do NOT advance. We reset.
        if (feedbackState === 'wrong') {
            setFeedbackState(null);
            setIsCheckSubmitted(false);
            setSelectedOption(null);
            setInputValue('');
            // Shuffle drag items again if drag drop
            if (isDragDrop) {
                setSelectedSegments([]);
                const allSegments = [
                    ...(currentQuestion.segments || []),
                    ...(currentQuestion.distractors || [])
                ].map((text, i) => ({ id: `seg-${i}`, text }));
                setAvailableSegments(allSegments.sort(() => Math.random() - 0.5));
            }
            return;
        }

        // If correct, advance
        setFeedbackState(null);
        setIsCheckSubmitted(false);
        setSelectedOption(null);

        if (currentQuestionIndex < level.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Calculate Final Results
            const baseXP = correctCount * BASE_XP_PER_QUESTION;
            const comboBonus = maxCombo * COMBO_BONUS_MULTIPLIER;
            const perfectBonus = mistakeCount === 0 ? PERFECT_LESSON_BONUS : 0;
            const totalXP = baseXP + comboBonus + perfectBonus;

            const result: LessonResult = {
                baseXP,
                comboBonus,
                perfectBonus,
                totalXP,
                correctCount,
                mistakeCount,
                maxCombo,
                newAchievements: []
            };

            onComplete(result);
        }
    };

    const handleSkipQuestion = () => {
        if (skipTokens <= 0) return;

        onUseSkip();
        incrementCombo();

        setFeedbackState(null);
        setIsCheckSubmitted(false);
        setSelectedOption(null);

        if (currentQuestionIndex < level.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            const baseXP = (correctCount + 1) * BASE_XP_PER_QUESTION;
            const comboBonus = maxCombo * COMBO_BONUS_MULTIPLIER;
            const perfectBonus = mistakeCount === 0 ? PERFECT_LESSON_BONUS : 0;
            const totalXP = baseXP + comboBonus + perfectBonus;

            const result: LessonResult = {
                baseXP,
                comboBonus,
                perfectBonus,
                totalXP,
                correctCount: correctCount + 1,
                mistakeCount,
                maxCombo,
                newAchievements: []
            };

            onComplete(result);
        }
    };

    // --- MATCHING LOGIC ---
    const handlePairClick = (item: PairItem) => {
        if (matchedPairs.includes(item.id) || wrongPairIds.length > 0) return;
        if (selectedPairId === item.id) { setSelectedPairId(null); return; }

        if (!selectedPairId) {
            setSelectedPairId(item.id);
            return;
        }

        const firstItem = shuffledPairs.find(p => p.id === selectedPairId);
        if (!firstItem) return;

        if (firstItem.pairId === item.id) {
            const newMatched = [...matchedPairs, firstItem.id, item.id];
            setMatchedPairs(newMatched);
            setSelectedPairId(null);
            if (newMatched.length === shuffledPairs.length) {
                setTimeout(() => {
                    setFeedbackState('correct');
                    incrementCombo();
                }, 500);
            }
        } else {
            setWrongPairIds([firstItem.id, item.id]);
            if (!isPremium) setHearts(hearts - 1);
            resetCombo();
            setTimeout(() => {
                setWrongPairIds([]);
                setSelectedPairId(null);
            }, 800);
        }
    };

    const handleSegmentClick = (segment: { id: string, text: string }, isSelected: boolean) => {
        if (isCheckSubmitted) return;
        if (isSelected) {
            setSelectedSegments(prev => prev.filter(s => s.id !== segment.id));
            setAvailableSegments(prev => [...prev, segment]);
        } else {
            setAvailableSegments(prev => prev.filter(s => s.id !== segment.id));
            setSelectedSegments(prev => [...prev, segment]);
        }
    };

    const renderMatchingGame = () => (
        <div className="w-full max-w-xl mx-auto px-4 pt-4 pb-32 flex flex-col items-center">
            <h2 className="text-xl md:text-2xl font-extrabold text-neutral-700 dark:text-neutral-200 mb-6 text-center">{currentQuestion.prompt}</h2>
            <div className="grid grid-cols-2 gap-3 w-full">
                {shuffledPairs.map((item) => {
                    const isSelected = selectedPairId === item.id;
                    const isMatched = matchedPairs.includes(item.id);
                    const isWrong = wrongPairIds.includes(item.id);
                    if (isMatched) return <div key={item.id} className="h-[80px]" />;
                    let btnStyle = "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 border-b-4";
                    if (isSelected) btnStyle = "bg-info/10 border-info text-info-dark border-b-4";
                    if (isWrong) btnStyle = "bg-danger/10 border-danger text-danger border-b-4 animate-shake";
                    return (
                        <motion.button
                            key={item.id}
                            layout
                            onClick={() => handlePairClick(item)}
                            className={`${btnStyle} rounded-xl p-4 font-bold text-lg border-2 flex items-center justify-center min-h-[80px] shadow-sm active:scale-95 transition-all duration-100`}
                        >
                            {item.text}
                        </motion.button>
                    )
                })}
            </div>
        </div>
    );

    const renderDragAndDrop = () => (
        <div className="w-full max-w-xl mx-auto px-4 pt-4 pb-32 flex flex-col">
            <h2 className="text-xl md:text-2xl font-extrabold text-neutral-700 dark:text-neutral-200 mb-6 leading-tight">{currentQuestion.prompt}</h2>
            <div className="min-h-[140px] bg-slate-100 dark:bg-neutral-800 rounded-2xl border-2 border-slate-200 dark:border-neutral-700 p-4 flex flex-wrap gap-2 mb-8 items-start content-start transition-colors focus-within:border-brand">
                {selectedSegments.length === 0 && <span className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase pointer-events-none select-none">Toque nos blocos abaixo</span>}
                {selectedSegments.map((seg) => (
                    <motion.button layoutId={seg.id} key={seg.id} onClick={() => handleSegmentClick(seg, true)} className="bg-white dark:bg-neutral-700 border-2 border-b-4 border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-white px-3 py-2 rounded-xl font-mono text-lg font-bold shadow-sm">{seg.text}</motion.button>
                ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
                {availableSegments.map((seg) => (
                    <motion.button layoutId={seg.id} key={seg.id} onClick={() => handleSegmentClick(seg, false)} className="bg-white dark:bg-neutral-700 border-2 border-b-4 border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-white px-3 py-2 rounded-xl font-mono text-lg font-bold active:scale-95 transition-transform">{seg.text}</motion.button>
                ))}
            </div>
        </div>
    );

    const renderFillInBlank = () => (
        <div className="w-full max-w-xl mx-auto px-4 pt-4 pb-32 flex flex-col">
            <h2 className="text-xl md:text-2xl font-extrabold text-neutral-700 dark:text-neutral-200 mb-6 leading-tight">{currentQuestion.prompt}</h2>
            <div className="bg-slate-800 dark:bg-black rounded-2xl p-6 shadow-lg border-2 border-slate-900 dark:border-neutral-700 relative font-mono text-lg md:text-xl text-white leading-loose">
                {currentQuestion.codeSnippet?.split('___').map((part, i, arr) => (
                    <React.Fragment key={i}>
                        <span dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br/>').replace(/\s\s/g, '&nbsp;&nbsp;') }} />
                        {i < arr.length - 1 && (
                            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={isCheckSubmitted}
                                className={`bg-slate-700 dark:bg-neutral-800 border-b-2 border-white text-center min-w-[80px] w-[100px] mx-1 outline-none focus:border-brand focus:bg-slate-600 transition-colors rounded-t ${isCheckSubmitted ? (feedbackState === 'correct' ? 'text-brand-light border-brand' : 'text-danger border-danger') : 'text-white'}`}
                                autoFocus spellCheck={false} autoComplete="off"
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );

    const renderListening = () => (
        <div className="w-full max-w-xl mx-auto px-6 pt-4 pb-32 flex flex-col">
            <h2 className="text-xl md:text-2xl font-extrabold text-neutral-700 dark:text-neutral-200 mb-6 leading-tight">{currentQuestion.prompt}</h2>
            <div className="flex justify-center mb-10">
                <button onClick={() => currentQuestion.englishWord && playAudio(currentQuestion.englishWord)} className={`w-32 h-32 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all shadow-[0_8px_0_rgba(0,0,0,0.1)] border-2 ${isPlayingAudio ? 'bg-brand text-white border-brand-dark scale-105' : 'bg-brand text-white border-brand-dark hover:brightness-110'}`}>
                    <Volume2 size={48} className={isPlayingAudio ? 'animate-bounce' : ''} />
                    <span className="text-xs font-black uppercase tracking-widest">Ouvir</span>
                </button>
            </div>
            <div className="flex flex-col gap-3">
                {currentQuestion.options.map((option) => {
                    const isSelected = selectedOption === option.id;
                    let styles = "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 border-2 border-b-4";
                    if (isSelected) styles = "bg-info/10 border-info text-info-dark border-2 border-b-4";
                    if (isCheckSubmitted && option.isCorrect) styles = "bg-brand/10 border-brand text-brand-dark border-2 border-b-4";
                    if (isCheckSubmitted && isSelected && !option.isCorrect) styles = "bg-danger/10 border-danger text-danger border-2 border-b-4";
                    return (
                        <button key={option.id} onClick={() => !isCheckSubmitted && setSelectedOption(option.id)} className={`w-full p-4 rounded-xl font-mono text-left text-lg transition-all active:scale-[0.98] ${styles}`}>
                            {option.text}
                        </button>
                    )
                })}
            </div>
        </div>
    );

    const renderSpeaking = () => (
        <div className="w-full max-w-xl mx-auto px-6 pt-4 pb-32 flex flex-col items-center text-center">
            <h2 className="text-xl md:text-2xl font-extrabold text-neutral-700 dark:text-neutral-200 mb-6 leading-tight">{currentQuestion.prompt}</h2>

            <div className="mb-8 p-6 bg-slate-100 dark:bg-neutral-800 rounded-2xl border-2 border-slate-200 dark:border-neutral-700 w-full">
                <p className="text-2xl font-bold text-brand dark:text-brand-light mb-2">{currentQuestion.englishWord}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Diga esta frase em voz alta</p>
            </div>

            <button
                onClick={() => {
                    if (isCheckSubmitted) return;
                    setIsPlayingAudio(true);
                    setTimeout(() => {
                        setIsPlayingAudio(false);
                        setSelectedOption('spoken'); // Dummy value to enable check
                        // Auto-submit for speaking after "listening"
                        // But for consistency with other types, we might just mark it as "selected"
                    }, 2000);
                }}
                className={`w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 transition-all shadow-[0_10px_0_rgba(0,0,0,0.1)] border-4 ${selectedOption === 'spoken'
                        ? 'bg-green-500 border-green-600 text-white'
                        : isPlayingAudio
                            ? 'bg-red-500 border-red-600 text-white scale-110 animate-pulse'
                            : 'bg-brand border-brand-dark text-white hover:scale-105'
                    }`}
            >
                {selectedOption === 'spoken' ? <Check size={48} /> : <Volume2 size={48} />}
                <span className="font-black uppercase tracking-widest text-sm">
                    {selectedOption === 'spoken' ? 'Gravado' : isPlayingAudio ? 'Ouvindo...' : 'Falar'}
                </span>
            </button>
        </div>
    );

    const renderStandard = () => {
        const isCode = currentQuestion.type === QuestionType.CODE_BUILDER;
        return (
            <div className="w-full max-w-xl mx-auto px-6 pt-4 pb-32 flex flex-col">
                <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-700 dark:text-neutral-200 mb-8 leading-tight">{currentQuestion.prompt}</h2>
                {currentQuestion.codeSnippet && (
                    <div className="w-full bg-slate-800 dark:bg-black rounded-2xl p-6 mb-8 shadow-lg border-2 border-slate-900 dark:border-neutral-700 relative overflow-hidden">
                        <pre className="font-mono text-white text-lg md:text-xl mt-2 whitespace-pre-wrap">
                            <code dangerouslySetInnerHTML={{ __html: currentQuestion.codeSnippet.replace('___', '<span class="border-b-2 border-white min-w-[40px] inline-block"></span>') }} />
                        </pre>
                    </div>
                )}
                <div className={`grid ${isCode ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'} gap-3 md:gap-4`}>
                    {currentQuestion.options.map((option, idx) => {
                        const isSelected = selectedOption === option.id;
                        const isSubmitted = isCheckSubmitted;
                        const isCorrect = option.isCorrect;
                        let borderClass = "border-neutral-200 dark:border-neutral-700 border-b-4";
                        let bgClass = "bg-white dark:bg-neutral-800";
                        let textClass = "text-neutral-700 dark:text-neutral-200";

                        if (isSubmitted) {
                            if (isSelected && isCorrect) { bgClass = "bg-brand-dim dark:bg-brand/20"; borderClass = "border-brand border-b-4"; textClass = "text-brand-dark dark:text-brand-light"; }
                            else if (isSelected && !isCorrect) { bgClass = "bg-danger-dim dark:bg-danger/20"; borderClass = "border-danger border-b-4"; textClass = "text-danger-dark dark:text-danger-light"; }
                        } else if (isSelected) { bgClass = "bg-info/10"; borderClass = "border-info border-b-4"; textClass = "text-info-dark"; }

                        return (
                            <button key={option.id} onClick={() => !isSubmitted && setSelectedOption(option.id)} disabled={isSubmitted}
                                className={`relative p-4 rounded-xl border-2 border-t-2 transition-all active:translate-y-[2px] active:border-b-2 ${borderClass} ${bgClass} ${textClass} font-bold text-lg md:text-xl text-center flex items-center justify-center min-h-[60px]`}>
                                {isCode ? <code className="font-mono">{option.text}</code> : <span className="flex items-center gap-3"><span className={`w-6 h-6 rounded border-2 flex items-center justify-center text-xs ${isSelected ? 'border-current' : 'border-neutral-300 dark:border-neutral-600 text-neutral-300 dark:text-neutral-500'}`}>{String.fromCharCode(65 + idx)}</span>{option.text}</span>}
                            </button>
                        )
                    })}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (isTheory) return <TheoryCard title={currentQuestion.prompt} content={currentQuestion.theoryContent || ''} englishWord={currentQuestion.englishWord} phonetic={currentQuestion.phonetic} codeSnippet={currentQuestion.codeSnippet} onContinue={handleContinue} />;
        if (isMatching) return renderMatchingGame();
        if (isDragDrop) return renderDragAndDrop();
        if (isFillBlank) return renderFillInBlank();
        if (isListening) return renderListening();
        if (isSpeaking) return renderSpeaking();
        return renderStandard();
    }

    const isValidationDisabled = () => {
        if (isDragDrop) return selectedSegments.length === 0;
        if (isFillBlank) return inputValue.trim().length === 0;
        if (isSpeaking) return selectedOption !== 'spoken';
        return !selectedOption;
    };

    const handleTheoryContinue = () => {
        if (currentQuestion.theory) {
            setSeenTheoryConcepts(prev => new Set(prev).add(currentQuestion.theory!.concept));
        }
        setShowTheory(false);

        // Se for uma questão puramente teórica, avança automaticamente para a próxima
        if (currentQuestion.type === QuestionType.THEORY) {
            handleContinue();
        }
    };

    const showCheckButton = !isTheory && !isMatching;

    // If showing theory, render only theory screen - CORREÇÃO DA ROLAGEM
    if (showTheory && currentQuestion.theory) {
        return (
            <div className="h-full overflow-auto">
                <TheoryScreen
                    title={currentQuestion.theory.title}
                    concept={currentQuestion.theory.concept}
                    explanation={currentQuestion.theory.explanation}
                    examples={currentQuestion.theory.examples}
                    tips={currentQuestion.theory.tips}
                    onContinue={handleTheoryContinue}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-neutral-900 relative transition-colors duration-300">
            <Header hearts={hearts} isPremium={isPremium} currentQuestionIndex={currentQuestionIndex} totalQuestions={level.questions.length} onQuit={onQuit} />

            {combo > 1 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full font-black text-sm flex items-center gap-1 z-40 border-2 border-orange-400 shadow-lg">
                    <Flame size={16} className="fill-yellow-300 animate-pulse" /> COMBO x{combo}
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                <motion.div key={currentQuestionIndex} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.25 }} className="flex-1 flex overflow-y-auto safe-area-pb">
                    {renderContent()}
                </motion.div>
            </AnimatePresence>

            {showCheckButton && (
                <div className={`fixed bottom-0 left-0 right-0 p-4 md:p-6 border-t-2 border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-20 safe-area-pb ${feedbackState ? 'hidden' : 'block'}`}>
                    <div className="max-w-2xl mx-auto flex gap-3">
                        <Button fullWidth size="lg" disabled={isValidationDisabled() || isCheckSubmitted} onClick={handleCheck} variant={isValidationDisabled() ? 'locked' : 'primary'}>
                            VERIFICAR
                        </Button>
                        {skipTokens > 0 && !isTheory && (
                            <button
                                onClick={handleSkipQuestion}
                                className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold border-b-4 border-yellow-700 active:border-b-2 active:translate-y-[2px] transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
                            >
                                <Zap size={20} fill="currentColor" />
                                <span className="hidden sm:inline">Pular</span>
                                <span className="bg-yellow-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">{skipTokens}</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            <FeedbackModal
                isOpen={!!feedbackState}
                isCorrect={feedbackState === 'correct'}
                correctAnswer={currentQuestion.correctAnswer || currentQuestion.options?.find(o => o.isCorrect)?.text}
                feedbackText={feedbackState === 'correct' ? currentQuestion.correctFeedback : currentQuestion.wrongFeedback}
                onContinue={handleContinue}
                skipTokens={skipTokens}
                onSkip={handleSkipQuestion}
            />
        </div>
    );
};
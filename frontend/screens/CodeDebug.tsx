import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Play, ChevronLeft, Lightbulb, CheckCircle, XCircle, FileCode, Heart, Infinity } from 'lucide-react';
import { Button } from '../components/Button';
import { DebugChallenge, DebugDifficulty } from '../types';
import { DEBUG_CHALLENGES } from '../debugChallenges';

interface CodeDebugProps {
    onBack: () => void;
    onChallengeComplete: (xp: number) => void;
    userHearts: number;
    isPremium: boolean;
}

export const CodeDebug: React.FC<CodeDebugProps> = ({ onBack, onChallengeComplete, userHearts, isPremium }) => {
    const [selectedChallenge, setSelectedChallenge] = useState<DebugChallenge | null>(null);
    const [activeFileId, setActiveFileId] = useState<string | null>(null);
    const [fileContents, setFileContents] = useState<Record<string, string>>({});
    const [showHints, setShowHints] = useState(false);
    const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    const getDifficultyColor = (difficulty: DebugDifficulty) => {
        switch (difficulty) {
            case DebugDifficulty.BEGINNER: return 'bg-green-500';
            case DebugDifficulty.INTERMEDIATE: return 'bg-yellow-500';
            case DebugDifficulty.ADVANCED: return 'bg-red-500';
        }
    };

    const getDifficultyLabel = (difficulty: DebugDifficulty) => {
        switch (difficulty) {
            case DebugDifficulty.BEGINNER: return 'Iniciante';
            case DebugDifficulty.INTERMEDIATE: return 'Intermediário';
            case DebugDifficulty.ADVANCED: return 'Avançado';
        }
    };

    const handleStartChallenge = (challenge: DebugChallenge) => {
        setSelectedChallenge(challenge);
        setActiveFileId(challenge.files[0].id);
        const initialContents: Record<string, string> = {};
        challenge.files.forEach(file => {
            initialContents[file.id] = file.initialCode;
        });
        setFileContents(initialContents);
        setTestResult(null);
        setErrorMessage('');
        setShowHints(false);
    };

    const handleCodeChange = (fileId: string, newCode: string) => {
        setFileContents(prev => ({
            ...prev,
            [fileId]: newCode
        }));
    };

    const handleRunCode = () => {
        if (!selectedChallenge) return;
        let allCorrect = true;
        let foundErrors: string[] = [];

        selectedChallenge.files.forEach(file => {
            const userCode = fileContents[file.id] || '';
            const correctCode = file.correctCode;
            const normalizedUser = userCode.replace(/\s+/g, ' ').trim();
            const normalizedCorrect = correctCode.replace(/\s+/g, ' ').trim();

            if (normalizedUser !== normalizedCorrect) {
                allCorrect = false;
                foundErrors.push(`Ainda há bugs em ${file.name}`);
            }
        });

        if (allCorrect) {
            setTestResult('success');
            setErrorMessage('');
            setTimeout(() => {
                onChallengeComplete(selectedChallenge.xpReward);
                setSelectedChallenge(null);
            }, 2000);
        } else {
            setTestResult('error');
            setErrorMessage(foundErrors.join(', ') + '. Continue debugando!');
        }
    };

    if (!selectedChallenge) {
        // Lista de Desafios
        return (
            <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-purple-50 to-blue-50 dark:from-neutral-900 dark:to-neutral-800">
                <header className="sticky top-0 left-0 right-0 flex items-center justify-between gap-4 py-4 px-6 bg-white dark:bg-neutral-900 shadow-lg z-50">
                    <button onClick={onBack} className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors">
                        <ChevronLeft size={28} strokeWidth={3} />
                    </button>
                    <h1 className="text-xl font-bold text-neutral-800 dark:text-white">Debug de Código</h1>
                    <div className="flex items-center gap-2">
                        <Heart fill={isPremium || userHearts > 0 ? "#FF4B4B" : "transparent"} stroke="#FF4B4B" strokeWidth={3} size={28} className={!isPremium && userHearts < 2 ? "animate-pulse" : ""} />
                        <span className="text-danger font-extrabold text-lg">{isPremium ? <Infinity size={24} strokeWidth={4} /> : userHearts}</span>
                    </div>
                </header>

                <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
                    <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 mb-6 shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="bg-purple-500 p-4 rounded-2xl"><Bug className="text-white" size={40} /></div>
                            <div>
                                <h2 className="text-3xl font-black text-neutral-800 dark:text-white">Desafios de Debug</h2>
                                <p className="text-neutral-600 dark:text-neutral-400">Encontre e corrija bugs em código real</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {DEBUG_CHALLENGES.map(challenge => (
                            <motion.div key={challenge.id} whileHover={{ y: -5 }} className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg cursor-pointer border-2 border-transparent hover:border-purple-500 transition-all" onClick={() => handleStartChallenge(challenge)}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`${getDifficultyColor(challenge.difficulty)} text-white text-xs font-bold px-3 py-1 rounded-full`}>{getDifficultyLabel(challenge.difficulty)}</span>
                                    {challenge.timeEstimate && <span className="text-xs text-neutral-500 dark:text-neutral-400">⏱️ {challenge.timeEstimate}</span>}
                                </div>
                                <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">{challenge.title}</h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{challenge.description}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                    <div className="flex gap-2 flex-wrap">
                                        {challenge.tags.slice(0, 3).map(tag => <span key={tag} className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">{tag}</span>)}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-red-500 font-bold"><Bug size={16} className="inline mr-1" />{challenge.bugCount} bugs</span>
                                        <span className="text-brand font-bold">+{challenge.xpReward} XP</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Editor de Código
    const activeFile = selectedChallenge.files.find(f => f.id === activeFileId);
    if (!activeFile) return null;

    return (
        <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800">
            <header className="sticky top-0 left-0 right-0 flex items-center justify-between gap-4 py-4 px-6 bg-neutral-900 shadow-lg z-50">
                <button onClick={() => { setSelectedChallenge(null); setTestResult(null); }} className="text-neutral-400 hover:text-neutral-100 transition-colors">
                    <ChevronLeft size={28} strokeWidth={3} />
                </button>
                <h1 className="text-xl font-bold text-white">{selectedChallenge.title}</h1>
                <div className="flex items-center gap-2">
                    <Heart fill={isPremium || userHearts > 0 ? "#FF4B4B" : "transparent"} stroke="#FF4B4B" strokeWidth={3} size={28} className={!isPremium && userHearts < 2 ? "animate-pulse" : ""} />
                    <span className="text-danger font-extrabold text-lg">{isPremium ? <Infinity size={24} strokeWidth={4} /> : userHearts}</span>
                </div>
            </header>

            <div className="w-full max-w-7xl mx-auto px-4 py-6 pb-32">
                <div className="bg-neutral-800 rounded-2xl p-6 mb-6 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`${getDifficultyColor(selectedChallenge.difficulty)} text-white text-xs font-bold px-3 py-1 rounded-full`}>{getDifficultyLabel(selectedChallenge.difficulty)}</span>
                                <span className="text-red-400 font-bold text-sm"><Bug size={16} className="inline mr-1" />Encontre {selectedChallenge.bugCount} bug(s)</span>
                            </div>
                            <p className="text-white text-lg">{selectedChallenge.description}</p>
                        </div>
                        <button onClick={() => setShowHints(!showHints)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap">
                            <Lightbulb size={20} />Dicas ({selectedChallenge.hints.length})
                        </button>
                    </div>
                    {showHints && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 space-y-2">
                            {selectedChallenge.hints.map((hint, idx) => <div key={idx} className="bg-yellow-900/30 border-l-4 border-yellow-500 p-3 rounded text-yellow-200 text-sm">💡 {hint}</div>)}
                        </motion.div>
                    )}
                </div>

                {selectedChallenge.files.length > 1 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {selectedChallenge.files.map(file => (
                            <button key={file.id} onClick={() => setActiveFileId(file.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors whitespace-nowrap ${activeFileId === file.id ? 'bg-neutral-800 text-white border-2 border-purple-500' : 'bg-neutral-700 text-neutral-400 hover:text-white'}`}>
                                <FileCode size={16} />{file.name}
                            </button>
                        ))}
                    </div>
                )}

                <div className="bg-neutral-900 rounded-2xl p-6 mb-6 shadow-2xl border border-neutral-700">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-neutral-400 font-mono text-sm">{activeFile.name}</span>
                        <span className="text-neutral-500 text-xs uppercase tracking-wider">{activeFile.language}</span>
                    </div>
                    <div className="relative">
                        <textarea
                            value={fileContents[activeFileId] || activeFile.initialCode}
                            onChange={(e) => handleCodeChange(activeFileId, e.target.value)}
                            disabled={!activeFile.isEditable}
                            className="w-full h-[500px] bg-black text-green-400 font-mono text-sm p-4 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-purple-500 overflow-auto"
                            spellCheck={false}
                        />
                        {!activeFile.isEditable && (
                            <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                                Somente Leitura
                            </div>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {testResult && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`p-6 rounded-2xl mb-6 flex items-center gap-4 ${testResult === 'success' ? 'bg-green-500/20 border-2 border-green-500' : 'bg-red-500/20 border-2 border-red-500'}`}>
                            {testResult === 'success' ? (
                                <><CheckCircle className="text-green-400" size={40} /><div><h3 className="text-white font-bold text-xl">🎉 Perfeito!</h3><p className="text-green-200">Todos os bugs foram corrigidos! +{selectedChallenge.xpReward} XP</p></div></>
                            ) : (
                                <><XCircle className="text-red-400" size={40} /><div><h3 className="text-white font-bold text-xl">Ainda há bugs!</h3><p className="text-red-200">{errorMessage}</p></div></>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Spacer for fixed button */}
                <div className="h-24"></div>
            </div>

            {/* Fixed Execute Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-900 via-neutral-900 to-transparent pt-6 pb-4 shadow-2xl z-40">
                <div className="max-w-7xl mx-auto px-4 flex justify-center">
                    <Button variant="primary" onClick={handleRunCode} className="bg-green-500 hover:bg-green-600 active:scale-95 px-12 py-4 text-lg font-bold shadow-2xl border-2 border-green-400 hover:border-green-300 transition-all">
                        <Play size={24} className="mr-2" />Executar Código
                    </Button>
                </div>
            </div>
        </div>
    );
};

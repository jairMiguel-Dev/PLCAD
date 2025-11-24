import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Lightbulb, Code, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface TheoryScreenProps {
    title: string;
    concept: string;
    explanation: string;
    examples?: string[];
    tips?: string[];
    onContinue: () => void;
}

export const TheoryScreen: React.FC<TheoryScreenProps> = ({
    title,
    concept,
    explanation,
    examples = [],
    tips = [],
    onContinue
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-3xl"
            >
                {/* Badge "Teoria" */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center mb-6"
                >
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-full shadow-lg">
                        <Sparkles size={20} className="animate-pulse" />
                        <span className="font-bold text-sm uppercase tracking-wider">Teoria Rapidinha</span>
                    </div>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header com Gradiente */}
                    <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 p-8 text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                                <BookOpen size={32} />
                            </div>
                            <div>
                                <p className="text-purple-100 text-sm font-medium uppercase tracking-wide">Conceito</p>
                                <h1 className="text-3xl font-black">{concept}</h1>
                            </div>
                        </div>
                        <p className="text-lg text-purple-50 font-medium">{title}</p>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        {/* Explicação Principal */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 rounded-2xl border-l-4 border-purple-500"
                        >
                            <div className="flex items-start gap-3">
                                <Lightbulb className="text-purple-500 flex-shrink-0 mt-1" size={24} />
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">Bora entender!</h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                                        {explanation}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Exemplos */}
                        {examples.length > 0 && (
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                    <Code className="text-indigo-500" size={20} />
                                    Exemplos práticos
                                </h3>
                                <div className="space-y-3">
                                    {examples.map((example, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            className="bg-gray-900 dark:bg-gray-950 p-4 rounded-xl border border-gray-700"
                                        >
                                            <pre className="text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                                                {example}
                                            </pre>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Dicas */}
                        {tips.length > 0 && (
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-2xl border-l-4 border-yellow-400"
                            >
                                <h3 className="font-bold text-base text-yellow-800 dark:text-yellow-300 mb-3">
                                    💡 Dica de ouro:
                                </h3>
                                <ul className="space-y-2">
                                    {tips.map((tip, index) => (
                                        <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                            <ArrowRight className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer com Botão */}
                    <div className="p-8 pt-0">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Button
                                variant="primary"
                                onClick={onContinue}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <span className="text-lg">Entendi! Bora praticar</span>
                                <ArrowRight size={24} />
                            </Button>
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                                Agora vamos ver isso na prática! 🚀
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Bottom decoration */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center mt-6 text-gray-500 dark:text-gray-400 text-sm"
                >
                    <p>💪 Você está mandando bem! Continue assim!</p>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

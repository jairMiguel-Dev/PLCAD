
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Cpu, Filter, Code, Zap, Globe, ChevronRight, X, Star } from 'lucide-react';
import { CURRICULUM } from '../constants';
import { ReviewConcept } from '../types';
import { Button } from '../components/Button';

interface ReviewProps {
    completedLevels: number[];
    conceptMastery: Record<string, number>;
    onPracticeConcept: (concept: string) => void;
}

export const Review: React.FC<ReviewProps> = ({ completedLevels, conceptMastery, onPracticeConcept }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<'All' | 'Lógica' | 'Sintaxe' | 'Inglês'>('All');
    const [selectedConcept, setSelectedConcept] = useState<ReviewConcept | null>(null);

    // Calculate unlocked concepts based on progress
    const unlockedConcepts = useMemo(() => {
        const concepts: ReviewConcept[] = [];
        const seen = new Set<string>();

        CURRICULUM.forEach(unit => {
            unit.levels.forEach(level => {
                if (completedLevels.includes(level.id) && level.learnableConcepts) {
                    level.learnableConcepts.forEach(c => {
                        if (!seen.has(c.term)) {
                            concepts.push(c);
                            seen.add(c.term);
                        }
                    });
                }
            });
        });
        return concepts;
    }, [completedLevels]);

    const filteredConcepts = unlockedConcepts.filter(c => {
        const matchesSearch = c.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.definition.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'All' || c.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const totalConcepts = 50; // Meta de conceitos

    const getMasteryLevel = (mastery: number) => {
        if (mastery >= 100) return { label: 'Mestre', color: 'text-yellow-500', icon: Star };
        if (mastery >= 70) return { label: 'Avançado', color: 'text-purple-500', icon: Zap };
        if (mastery >= 30) return { label: 'Aprendiz', color: 'text-blue-500', icon: BookOpen };
        return { label: 'Novato', color: 'text-neutral-400', icon: Cpu };
    };

    const renderConceptCard = (concept: ReviewConcept, index: number) => {
        const mastery = conceptMastery[concept.term] || 0;
        const level = getMasteryLevel(mastery);
        const LevelIcon = level.icon;

        return (
            <motion.div
                key={concept.term}
                layoutId={`card-${concept.term}`}
                onClick={() => setSelectedConcept(concept)}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-slate-200 dark:border-neutral-700 shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer group relative overflow-hidden"
            >
                <div className={`absolute top-0 left-0 w-1 h-full ${concept.type === 'Lógica' ? 'bg-blue-500' : concept.type === 'Sintaxe' ? 'bg-purple-500' : 'bg-red-500'
                    }`}></div>

                <div className="flex justify-between items-start mb-2 pl-3">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {concept.term}
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            {concept.type === 'Lógica' && <Cpu size={10} />}
                            {concept.type === 'Sintaxe' && <Code size={10} />}
                            {concept.type === 'Inglês' && <Globe size={10} />}
                            {concept.type}
                        </span>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-700 ${level.color}`}>
                        <LevelIcon size={12} fill="currentColor" />
                        <span className="text-xs font-black">{mastery}%</span>
                    </div>
                </div>

                <p className="text-slate-500 dark:text-neutral-400 text-sm font-medium line-clamp-2 pl-3">
                    {concept.definition}
                </p>

                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
                    <ChevronRight size={20} />
                </div>
            </motion.div>
        );
    };

    const renderGroupedConcepts = () => {
        const groups = {
            'Lógica': filteredConcepts.filter(c => c.type === 'Lógica'),
            'Sintaxe': filteredConcepts.filter(c => c.type === 'Sintaxe'),
            'Inglês': filteredConcepts.filter(c => c.type === 'Inglês')
        };

        return (
            <div className="space-y-8">
                {Object.entries(groups).map(([type, concepts]) => {
                    if (concepts.length === 0) return null;

                    let icon = <Cpu className="text-blue-500" />;
                    let color = "text-blue-500";
                    if (type === 'Sintaxe') { icon = <Code className="text-purple-500" />; color = "text-purple-500"; }
                    if (type === 'Inglês') { icon = <Globe className="text-red-500" />; color = "text-red-500"; }

                    return (
                        <div key={type}>
                            <div className="flex items-center gap-2 mb-3 px-2">
                                {icon}
                                <h3 className={`text-xl font-black ${color}`}>{type}</h3>
                                <span className="text-xs font-bold text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
                                    {concepts.length}
                                </span>
                            </div>
                            <div className="grid gap-3">
                                {concepts.map((concept, index) => renderConceptCard(concept, index))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-neutral-900 pb-24 transition-colors duration-300">
            {/* Header Místico/Tech */}
            <header className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 text-white rounded-b-[2.5rem] shadow-2xl mb-6 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 text-white/5 rotate-12">
                    <Code size={200} />
                </div>
                <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                                Grimório
                            </h1>
                            <p className="text-blue-200/80 font-medium text-sm">
                                Sua biblioteca de conhecimento arcano.
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-bold">
                            {unlockedConcepts.length} / {totalConcepts} Desbloqueados
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-4 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-white transition-colors" size={20} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar feitiço ou conceito..."
                            className="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-white font-medium placeholder:text-indigo-400/70 focus:outline-none focus:bg-indigo-900/80 focus:border-blue-400 transition-all shadow-inner"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {['All', 'Lógica', 'Sintaxe', 'Inglês'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter as any)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeFilter === filter
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                                    : 'bg-indigo-950/40 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-900/60'
                                    }`}
                            >
                                {filter === 'All' ? 'Todos' : filter}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Grid de Conceitos */}
            <div className="px-4 pb-6 flex-1 overflow-y-auto">
                {unlockedConcepts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                        <div className="w-24 h-24 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                            <BookOpen size={40} className="text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-600 dark:text-neutral-300">Grimório Vazio</h3>
                        <p className="text-sm text-neutral-500 max-w-[200px]">Complete lições para preencher suas páginas com conhecimento.</p>
                    </div>
                ) : (
                    activeFilter === 'All' && !searchTerm
                        ? renderGroupedConcepts()
                        : <div className="grid gap-3">{filteredConcepts.map((concept, index) => renderConceptCard(concept, index))}</div>
                )}
            </div>

            {/* Modal de Detalhes (Flashcard) */}
            <AnimatePresence>
                {selectedConcept && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            layoutId={`card-${selectedConcept.term}`}
                            className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col max-h-[80vh]"
                        >
                            {/* Header do Modal */}
                            <div className={`h-32 p-6 flex flex-col justify-end relative ${selectedConcept.type === 'Lógica' ? 'bg-blue-600' : selectedConcept.type === 'Sintaxe' ? 'bg-purple-600' : 'bg-red-600'
                                }`}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedConcept(null); }}
                                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <div className="absolute top-4 left-4 text-white/30">
                                    {selectedConcept.type === 'Lógica' && <Cpu size={80} />}
                                    {selectedConcept.type === 'Sintaxe' && <Code size={80} />}
                                    {selectedConcept.type === 'Inglês' && <Globe size={80} />}
                                </div>
                                <h2 className="text-3xl font-black text-white relative z-10">{selectedConcept.term}</h2>
                                <span className="text-white/80 font-bold text-sm uppercase tracking-widest relative z-10">{selectedConcept.type}</span>
                            </div>

                            {/* Conteúdo do Modal */}
                            <div className="p-6 overflow-y-auto">
                                <div className="mb-6">
                                    <h3 className="text-sm font-extrabold text-slate-400 uppercase mb-2">Definição</h3>
                                    <p className="text-lg font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                                        {selectedConcept.definition}
                                    </p>
                                </div>

                                {selectedConcept.example && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-extrabold text-slate-400 uppercase mb-2">Exemplo de Código</h3>
                                        <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-blue-300 overflow-x-auto border border-slate-800 shadow-inner">
                                            <pre>{selectedConcept.example}</pre>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 border border-neutral-100 dark:border-neutral-700 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-slate-600 dark:text-slate-300">Seu Domínio</span>
                                        <span className="font-black text-blue-500">{conceptMastery[selectedConcept.term] || 0}%</span>
                                    </div>
                                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${conceptMastery[selectedConcept.term] || 0}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 text-center">
                                        Pratique mais para aumentar seu nível de maestria neste conceito.
                                    </p>
                                </div>

                                <Button fullWidth variant="primary" onClick={() => onPracticeConcept(selectedConcept.term)}>
                                    PRATICAR AGORA
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

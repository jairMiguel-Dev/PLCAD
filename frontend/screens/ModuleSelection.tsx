import React from 'react';
import { motion } from 'framer-motion';
import { ModuleType } from '../types';
import { Code2, Languages, Sparkles, ChevronLeft } from 'lucide-react';

interface ModuleSelectionProps {
  onSelectModule: (module: ModuleType) => void;
  onBack: () => void;
}

export const ModuleSelection: React.FC<ModuleSelectionProps> = ({ onSelectModule, onBack }) => {
  
  const modules = [
    {
      type: ModuleType.ENGLISH,
      title: 'Inglês',
      description: 'Vocabulário tech e cotidiano.',
      icon: Languages,
      color: 'bg-danger',
      shadow: 'shadow-[0_6px_0_#EA2B2B]',
      borderColor: 'border-danger-dark',
    },
    {
      type: ModuleType.LOGIC,
      title: 'Lógica de Programação',
      description: 'Algoritmos, variáveis e loops.',
      icon: Code2,
      color: 'bg-info',
      shadow: 'shadow-[0_6px_0_#1899D6]',
      borderColor: 'border-info-dark',
    },
    {
      type: ModuleType.COMBO,
      title: 'Combo: Lógica + Inglês',
      description: 'O desafio definitivo.',
      icon: Sparkles,
      color: 'bg-purple-500',
      shadow: 'shadow-[0_6px_0_#9333ea]',
      borderColor: 'border-purple-700',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6">
        <div className="w-full max-w-2xl mx-auto">
        <header className="flex items-center mb-8 mt-4">
            <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-200 mr-4">
                <ChevronLeft size={28} className="text-slate-400" />
            </button>
            <h2 className="text-2xl font-extrabold text-slate-700">O que vamos aprender?</h2>
        </header>

        <div className="grid gap-6">
            {modules.map((mod, index) => (
            <motion.button
                key={mod.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelectModule(mod.type)}
                className={`relative group overflow-hidden rounded-2xl border-2 border-slate-200 hover:bg-slate-50 active:scale-95 transition-all duration-150 p-6 text-left flex items-center gap-6 w-full bg-white border-b-4`}
            >
                <div className={`w-16 h-16 rounded-2xl ${mod.color} ${mod.shadow} flex items-center justify-center shrink-0`}>
                    <mod.icon size={32} className="text-white" />
                </div>
                
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-700 mb-1">{mod.title}</h3>
                    <p className="text-slate-500 font-medium leading-snug">{mod.description}</p>
                </div>
            </motion.button>
            ))}
        </div>
      </div>
    </div>
  );
};
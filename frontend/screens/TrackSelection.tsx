import React from 'react';
import { motion } from 'framer-motion';
import { ModuleType } from '../types';
import { MessageSquare, Cpu, Rocket, Check } from 'lucide-react';

interface TrackSelectionProps {
    onSelectTrack: (track: ModuleType) => void;
}

const tracks = [
    {
        id: ModuleType.ENGLISH,
        title: 'English for Devs',
        description: 'Domine o vocabulário técnico, melhore sua pronúncia e entenda reuniões em inglês.',
        icon: MessageSquare,
        color: 'from-blue-500 to-cyan-400',
        features: ['Listening & Speaking', 'Vocabulário Técnico', 'Simulação de Daily']
    },
    {
        id: ModuleType.LOGIC,
        title: 'Lógica Pura',
        description: 'Foco total em algoritmos, estruturas de dados e resolução de problemas complexos.',
        icon: Cpu,
        color: 'from-green-500 to-emerald-400',
        features: ['Algoritmos', 'Estruturas de Dados', 'Desafios de Código']
    },
    {
        id: ModuleType.COMBO,
        title: 'Full Stack Combo',
        description: 'A experiência completa. Aprenda a codar enquanto domina o inglês necessário.',
        icon: Rocket,
        color: 'from-purple-500 to-pink-500',
        features: ['O Melhor dos Dois', 'Carreira Internacional', 'Evolução Rápida'],
        recommended: true
    }
];

export const TrackSelection: React.FC<TrackSelectionProps> = ({ onSelectTrack }) => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 z-10"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Escolha sua Jornada
                </h1>
                <p className="text-gray-400 text-lg max-w-xl mx-auto">
                    Defina como você quer evoluir hoje. Você pode mudar isso depois nas configurações.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full z-10">
                {tracks.map((track, index) => (
                    <motion.button
                        key={track.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectTrack(track.id)}
                        className="relative group text-left"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl blur-xl`} />

                        <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl hover:border-white/20 transition-colors flex flex-col">
                            {track.recommended && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    RECOMENDADO
                                </div>
                            )}

                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center mb-6 shadow-lg`}>
                                <track.icon size={28} className="text-white" />
                            </div>

                            <h3 className="text-2xl font-bold mb-3">{track.title}</h3>
                            <p className="text-gray-400 mb-6 flex-grow">{track.description}</p>

                            <div className="space-y-3 mb-8">
                                {track.features.map((feature, i) => (
                                    <div key={i} className="flex items-center text-sm text-gray-300">
                                        <Check size={16} className="mr-2 text-green-400" />
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <div className={`w-full py-3 rounded-xl font-bold text-center transition-all
                                ${track.recommended
                                    ? `bg-gradient-to-r ${track.color} text-white shadow-lg shadow-purple-500/20`
                                    : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                            >
                                Selecionar
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

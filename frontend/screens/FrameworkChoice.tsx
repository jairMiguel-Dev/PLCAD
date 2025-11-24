import React, { useState } from 'react';
import { ModuleType } from '../types';
import { Code2, Server, Sparkles, Zap, ChevronRight, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface FrameworkChoiceProps {
    onSelect: (framework: ModuleType.REACT | ModuleType.NODEJS) => void;
    onContinueVanilla: () => void;
}

export const FrameworkChoice: React.FC<FrameworkChoiceProps> = ({ onSelect, onContinueVanilla }) => {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const frameworks = [
        {
            id: 'react',
            type: ModuleType.REACT,
            name: 'React',
            tagline: 'Build Modern UIs',
            description: 'Domine a biblioteca mais popular para criar interfaces dinâmicas e reativas',
            icon: Code2,
            gradient: 'from-blue-500 via-cyan-500 to-teal-500',
            features: ['Components', 'Hooks', 'State Management', 'Virtual DOM'],
            color: '#61DAFB'
        },
        {
            id: 'nodejs',
            type: ModuleType.NODEJS,
            name: 'Node.js',
            tagline: 'Power Your Backend',
            description: 'Crie servidores robustos e APIs escaláveis com JavaScript no backend',
            icon: Server,
            gradient: 'from-green-500 via-emerald-500 to-lime-500',
            features: ['Express', 'REST APIs', 'Database', 'Authentication'],
            color: '#68A063'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-6">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm font-semibold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                            CONTEÚDO PREMIUM
                        </span>
                    </div>

                    <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                        Escolha Seu Caminho
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Você completou os fundamentos! Agora escolha se quer se especializar em <span className="text-cyan-400 font-bold">Frontend</span> ou <span className="text-green-400 font-bold">Backend</span>
                    </p>
                </motion.div>

                {/* Framework Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {frameworks.map((framework, index) => {
                        const Icon = framework.icon;
                        const isHovered = hoveredCard === framework.id;

                        return (
                            <motion.div
                                key={framework.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ scale: 1.02 }}
                                onHoverStart={() => setHoveredCard(framework.id)}
                                onHoverEnd={() => setHoveredCard(null)}
                                className="relative group cursor-pointer"
                                onClick={() => onSelect(framework.type)}
                            >
                                {/* Card */}
                                <div className={`relative bg-slate-900/50 backdrop-blur-xl border-2 ${isHovered ? 'border-white/40' : 'border-white/10'} rounded-3xl p-8 overflow-hidden transition-all duration-500`}>
                                    {/* Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${framework.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                    {/* Glow Effect */}
                                    <motion.div
                                        className={`absolute -inset-1 bg-gradient-to-r ${framework.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                                        animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />

                                    <div className="relative z-10">
                                        {/* Icon */}
                                        <motion.div
                                            animate={isHovered ? { rotate: [0, 5, 0, -5, 0] } : {}}
                                            transition={{ duration: 0.5 }}
                                            className="mb-6"
                                        >
                                            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${framework.gradient} p-4 shadow-2xl`}>
                                                <Icon className="w-full h-full text-white" />
                                            </div>
                                        </motion.div>

                                        {/* Title */}
                                        <h2 className="text-4xl font-black mb-2 flex items-center gap-3">
                                            {framework.name}
                                            <Sparkles className="w-6 h-6 text-yellow-400" />
                                        </h2>

                                        <p className={`text-sm font-semibold mb-4 bg-gradient-to-r ${framework.gradient} bg-clip-text text-transparent`}>
                                            {framework.tagline}
                                        </p>

                                        <p className="text-gray-300 mb-6 leading-relaxed">
                                            {framework.description}
                                        </p>

                                        {/* Features */}
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            {framework.features.map((feature, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.2 + idx * 0.1 }}
                                                    className="flex items-center gap-2 text-sm"
                                                >
                                                    <Zap className="w-4 h-4 text-yellow-400" />
                                                    <span className="text-gray-200">{feature}</span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* CTA Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${framework.gradient} shadow-xl flex items-center justify-center gap-2 group/btn`}
                                        >
                                            Começar com {framework.name}
                                            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Continue Vanilla Option */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                >
                    <p className="text-gray-400 mb-4">
                        Ou prefere continuar aprofundando nos fundamentos do JavaScript?
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onContinueVanilla}
                        className="px-8 py-3 rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all font-semibold"
                    >
                        Continuar com JavaScript Puro
                    </motion.button>
                </motion.div>

                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.8, 0.2],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

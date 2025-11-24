
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gem, Flag, Bot, ArrowRight, Zap, Book } from 'lucide-react';
import { Button } from './Button';

interface OnboardingOverlayProps {
    onComplete: () => void;
}

interface StepData {
    targetId: string | null; // null = center of screen
    title: string;
    text: string;
    icon: React.ReactNode;
    positionPreference?: 'top' | 'bottom';
}

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [spotlight, setSpotlight] = useState<{ top: number, left: number, width: number, height: number, opacity: number }>({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
        width: 0,
        height: 0,
        opacity: 0
    });

    const steps: StepData[] = [
        {
            targetId: null,
            title: "Bem‑vindo ao ProGles!",
            text: "Eu sou o Proggy, seu guia. Vamos explorar a plataforma e descobrir todas as funcionalidades que vão te ajudar a aprender inglês e programação.",
            icon: <Bot size={40} className="text-white" />,
            positionPreference: 'bottom'
        },
        {
            targetId: 'onboarding-current-level',
            title: "Trilha de Níveis",
            text: "Esta é a sua jornada. Cada bolha representa um nível. Toque em uma bolha desbloqueada para iniciar a lição correspondente.",
            icon: <Flag size={40} className="text-green-300" />,
            positionPreference: 'bottom'
        },
        {
            targetId: 'header-gems',
            title: "Gemas",
            text: "Ganhe gemas ao concluir lições e missões diárias. Use-as na Loja para comprar skins, power‑ups ou assinar o plano premium.",
            icon: <Gem size={40} className="text-blue-300" />,
            positionPreference: 'bottom'
        },
        {
            targetId: 'header-hearts',
            title: "Sistema de Vidas",
            text: "Você tem 5 corações. Cada erro perde um coração. Quando acabar, aguarde a recarga automática ou use gemas para restaurar.",
            icon: <Heart size={40} className="text-red-400" />,
            positionPreference: 'bottom'
        },
        {
            targetId: 'header-streak',
            title: "Streak (Sequência)",
            text: "Mantenha a prática diária para aumentar seu streak. Quanto maior, mais recompensas diárias você recebe.",
            icon: <Zap size={40} className="text-orange-400" />,
            positionPreference: 'bottom'
        },
        {
            targetId: null,
            title: "Missões Diárias",
            text: "Abaixo da Home há um widget de Daily Quests. Complete-as para ganhar gemas extras rapidamente.",
            icon: <Bot size={40} className="text-white" />,
            positionPreference: 'bottom'
        },
        {
            targetId: 'header-library',
            title: "Biblioteca de Conceitos",
            text: "Acesse a Biblioteca para revisar definições, exemplos e áudios de pronúncia de todos os termos aprendidos.",
            icon: <Book size={40} className="text-purple-300" />,
            positionPreference: 'bottom'
        },
        {
            targetId: 'header-shop',
            title: "Loja",
            text: "Na Loja você pode comprar packs de gemas, produtos como: congelar suas sequencias de acertos e recarregar vidas. E uma assinatura premium que lhe da vidas infinitas.",
            icon: <Zap size={40} className="text-yellow-300" />,
            positionPreference: 'bottom'
        },
        {
            targetId: 'header-profile',
            title: "Perfil",
            text: "No seu perfil você vê estatísticas, histórico de missões, e pode gerenciar sua assinatura premium.",
            icon: <Flag size={40} className="text-indigo-300" />,
            positionPreference: 'bottom'
        },
        {
            targetId: null,
            title: "Modo Dark / Light",
            text: "Alterne entre temas claro e escuro nas Configurações para melhorar o conforto visual.",
            icon: <Zap size={40} className="text-gray-300" />,
            positionPreference: 'bottom'
        },
        {
            targetId: null,
            title: "Tudo pronto!",
            text: "Agora você conhece todas as funcionalidades. Boa sorte e divirta‑se aprendendo!",
            icon: <Bot size={40} className="text-white" />,
            positionPreference: 'bottom'
        }
    ];

    const currentStep = steps[step];

    const updateSpotlight = () => {
        if (!currentStep.targetId) {
            // Center screen "spotlight" (invisible hole, just centers content)
            setSpotlight({
                top: window.innerHeight / 2,
                left: window.innerWidth / 2,
                width: 0,
                height: 0,
                opacity: 0 // Hide spotlight border for center steps
            });
            return;
        }

        const el = document.getElementById(currentStep.targetId);
        if (el) {
            const rect = el.getBoundingClientRect();
            const padding = 10;
            setSpotlight({
                top: rect.top - padding,
                left: rect.left - padding,
                width: rect.width + (padding * 2),
                height: rect.height + (padding * 2),
                opacity: 1
            });

            // Scroll into view if needed
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Fallback if element not found
            setSpotlight(prev => ({ ...prev, opacity: 0 }));
        }
    };

    useLayoutEffect(() => {
        updateSpotlight();
        window.addEventListener('resize', updateSpotlight);
        return () => window.removeEventListener('resize', updateSpotlight);
    }, [step, currentStep.targetId]);

    // Small delay to allow scroll to finish before measuring again for perfect alignment
    useEffect(() => {
        const timer = setTimeout(updateSpotlight, 500);
        return () => clearTimeout(timer);
    }, [step]);

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    const isLastStep = step === steps.length - 1;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
            {/* 
            The "Donut" Overlay Logic:
            We use a massive box-shadow on the spotlight div to create the dark overlay.
            The div itself is transparent, creating the "hole".
        */}
            <motion.div
                animate={{
                    top: spotlight.top,
                    left: spotlight.left,
                    width: spotlight.width,
                    height: spotlight.height,
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                style={{
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.85)',
                }}
                className={`absolute rounded-2xl z-40 pointer-events-none border-4 border-white/50 ${spotlight.opacity === 0 ? 'border-transparent' : ''}`}
            >
                {/* Pulsing effect ring around the spotlight */}
                {spotlight.opacity > 0 && (
                    <div className="absolute -inset-1 border-2 border-brand rounded-2xl animate-ping opacity-50"></div>
                )}
            </motion.div>

            {/* Dialog Container - Always centered relative to viewport width, flexible vertical */}
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none p-6">
                {/* Push content down or up based on spotlight position to avoid overlap if possible */}
                <motion.div
                    key={step}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: -20 }}
                    className={`
                    bg-white p-0 rounded-3xl max-w-xs w-full text-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] 
                    pointer-events-auto flex flex-col overflow-hidden
                    ${currentStep.targetId === 'header-hearts' || currentStep.targetId === 'header-gems' || currentStep.targetId === 'header-streak'
                            ? 'mt-32' // Push down for header items
                            : ''}
                    ${currentStep.targetId === 'onboarding-current-level' ? 'mb-32' : ''} // Push up for bottom items
                `}
                >
                    {/* Mascot Header */}
                    <div className="bg-brand p-6 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <motion.div
                            initial={{ rotate: -10, scale: 0.8 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-inner border-2 border-white/30 relative z-10"
                        >
                            {currentStep.icon}
                        </motion.div>
                    </div>

                    <div className="p-6">
                        <h3 className="text-xl font-black text-neutral-800 mb-2">{currentStep.title}</h3>
                        <p className="text-neutral-500 font-medium mb-8 leading-relaxed min-h-[3rem]">
                            {currentStep.text}
                        </p>

                        <div className="flex gap-2">
                            {/* Skip Button (only if not first or last) */}
                            {step > 0 && !isLastStep && (
                                <button
                                    onClick={onComplete}
                                    className="px-4 py-3 rounded-xl font-bold text-neutral-400 hover:bg-neutral-50 transition-colors text-sm"
                                >
                                    PULAR
                                </button>
                            )}
                            <Button fullWidth onClick={handleNext} className="shadow-btn-primary group">
                                {isLastStep ? "COMEÇAR JORNADA!" : (
                                    <span className="flex items-center justify-center gap-2">
                                        PRÓXIMO <ArrowRight size={18} className="group-active:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Step Indicators */}
                    <div className="flex gap-1 justify-center pb-4">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-brand' : 'w-1.5 bg-neutral-200'}`}
                            />
                        ))}
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

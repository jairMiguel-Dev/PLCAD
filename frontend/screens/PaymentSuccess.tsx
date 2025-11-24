import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Gem, Crown, Loader } from 'lucide-react';
import { getSessionDetails } from '../services/stripe';

interface PaymentSuccessProps {
    onContinue: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ onContinue }) => {
    const [loading, setLoading] = useState(true);
    const [sessionData, setSessionData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        if (sessionId) {
            getSessionDetails(sessionId)
                .then(data => {
                    setSessionData(data);
                    setLoading(false);
                    // Clear URL to prevent refresh loop
                    window.history.replaceState({}, document.title, window.location.pathname);
                })
                .catch(err => {
                    setError('Erro ao verificar pagamento');
                    setLoading(false);
                    // Clear URL even on error to prevent stuck state
                    window.history.replaceState({}, document.title, window.location.pathname);
                });
        } else {
            setError('Sessão inválida');
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-brand-light to-brand dark:from-brand-dark dark:to-brand">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                    <Loader className="w-12 h-12 text-white" />
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-danger-dim to-danger-DEFAULT dark:from-danger-dark dark:to-danger-DEFAULT">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center"
                >
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Ops!</h2>
                    <p className="text-white/80 mb-6">{error}</p>
                    <button
                        onClick={onContinue}
                        className="px-6 py-3 bg-white text-danger-dark rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform"
                    >
                        Voltar
                    </button>
                </motion.div>
            </div>
        );
    }

    const isPremium = sessionData?.metadata?.productId?.includes('premium');
    const gemAmount = sessionData?.metadata?.gemAmount;

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-brand-light to-brand dark:from-brand-dark dark:to-brand overflow-hidden">
            {/* Confetti Animation */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: '-10%',
                            backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347'][Math.floor(Math.random() * 4)]
                        }}
                        animate={{
                            y: ['0vh', '110vh'],
                            rotate: [0, 360],
                            opacity: [1, 0]
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            delay: Math.random() * 0.5,
                            repeat: Infinity
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="relative z-10"
            >
                <div className="relative">
                    <CheckCircle className="w-32 h-32 text-white drop-shadow-2xl" />
                    <motion.div
                        className="absolute -top-2 -right-2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        {isPremium ? (
                            <Crown className="w-12 h-12 text-yellow-300" />
                        ) : (
                            <Gem className="w-12 h-12 text-cyan-300" />
                        )}
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-8 relative z-10"
            >
                <h1 className="text-4xl font-black text-white mb-2">
                    Pagamento Confirmado!
                </h1>
                <p className="text-white/90 text-lg mb-6">
                    {sessionData?.customerEmail && `Recibo enviado para ${sessionData.customerEmail}`}
                </p>

                {isPremium ? (
                    <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 mb-6">
                        <Crown className="w-16 h-16 text-yellow-300 mx-auto mb-3" />
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Bem-vindo ao ProGres Super!
                        </h2>
                        <ul className="text-white/90 space-y-2 text-left max-w-xs mx-auto">
                            <li className="flex items-center gap-2">
                                <span className="text-yellow-300">✓</span>
                                Vidas Infinitas
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-yellow-300">✓</span>
                                Zero Anúncios
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-yellow-300">✓</span>
                                Emblema Dourado
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-yellow-300">✓</span>
                                Acesso a Conteúdo Exclusivo
                            </li>
                        </ul>
                    </div>
                ) : gemAmount && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 mb-6">
                        <Gem className="w-16 h-16 text-cyan-300 mx-auto mb-3" />
                        <h2 className="text-2xl font-bold text-white mb-2">
                            +{gemAmount} Gemas Adicionadas!
                        </h2>
                        <p className="text-white/80">
                            Use suas gemas na loja para comprar vidas, power-ups e muito mais!
                        </p>
                    </div>
                )}

                <motion.button
                    onClick={onContinue}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-brand-dark rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all"
                >
                    Continuar Aprendendo
                </motion.button>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-white/60 text-sm mt-8 relative z-10"
            >
                Obrigado por apoiar o ProGres! 🚀
            </motion.p>
        </div>
    );
};

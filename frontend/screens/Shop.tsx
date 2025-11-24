
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, CheckCircle, Crown, Zap, RefreshCw, Heart, Flame } from 'lucide-react';
import { SHOP_ITEMS } from '../constants';
import { Button } from '../components/Button';
import { UserStats, ShopItem } from '../types';
import { PaymentSheet } from '../components/PaymentSheet';

interface ShopProps {
    userStats: UserStats;
    onBuyItem: (item: ShopItem) => void;
}

export const Shop: React.FC<ShopProps> = ({ userStats, onBuyItem }) => {
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
    const [paymentItem, setPaymentItem] = useState<ShopItem | null>(null);
    const [processingPayment, setProcessingPayment] = useState(false);

    const handleClickItem = async (item: ShopItem) => {
        if (item.type === 'subscription' && userStats.isPremium) return;

        if (item.type === 'currency_pack') {
            setPaymentItem(item);
        } else if (item.type === 'subscription') {
            setPaymentItem(item);
        } else {
            if (userStats.gems < item.cost) {
                alert("Gemas insuficientes!");
                return;
            }
            onBuyItem(item);
            showSuccess(item);
        }
    };

    const handlePaymentConfirm = async () => {
        if (!paymentItem) return;

        setProcessingPayment(true);

        setTimeout(() => {
            onBuyItem(paymentItem);
            setPaymentItem(null);
            setProcessingPayment(false);
            showSuccess(paymentItem);
        }, 2000);
    };

    const showSuccess = (item: ShopItem) => {
        setSelectedItem(item);
        setTimeout(() => setSelectedItem(null), 2500);
    };

    // Categorizar itens
    const powerUps = SHOP_ITEMS.filter(i => ['skip_question', 'quest_reset'].includes(i.id));
    const utilities = SHOP_ITEMS.filter(i => ['refill_hearts', 'streak_freeze'].includes(i.id));
    const gemPacks = SHOP_ITEMS.filter(i => i.type === 'currency_pack');
    const premium = SHOP_ITEMS.find(i => i.id === 'premium_sub');

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-white to-neutral-50 pb-24">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b-2 border-neutral-100 p-4 flex justify-between items-center shadow-sm">
                <h1 className="text-2xl font-black text-neutral-700 tracking-wide uppercase">🏪 Mercado</h1>
                <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-xl shadow-lg">
                    <span className="text-white font-black text-lg">{userStats.gems}</span>
                    <Gem size={20} className="text-white" fill="white" />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-6 safe-area-pb">
                {/* Premium Banner */}
                {!userStats.isPremium && premium && (
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleClickItem(premium)}
                        className="mb-8 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden cursor-pointer border-4 border-yellow-300"
                    >
                        <div className="absolute -right-6 -bottom-6 text-white/10">
                            <Crown size={160} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Crown size={28} fill="white" />
                                <h2 className="text-3xl font-black italic">ProGres Super</h2>
                            </div>
                            <p className="font-bold mb-4 max-w-[80%] text-white/90">
                                Vidas infinitas, zero anúncios, emblema dourado e acesso a conteúdos exclusivos.
                            </p>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl font-black">R$ 19,99</span>
                                <span className="text-sm opacity-90">/mês</span>
                            </div>
                            <div className="bg-white text-orange-500 font-black px-6 py-3 rounded-xl inline-block shadow-lg hover:shadow-xl transition-shadow">
                                ATIVAR PREMIUM
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Power-Ups Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
                            <Zap size={20} className="text-white" />
                        </div>
                        <h3 className="text-xl font-black text-neutral-700">Power-Ups</h3>
                        <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-full">NOVO!</span>
                    </div>
                    <p className="text-sm text-neutral-500 font-medium mb-4">Impulsione seu aprendizado com esses itens especiais</p>

                    <div className="grid gap-3">
                        {powerUps.map((item) => {
                            const canAfford = userStats.gems >= item.cost;
                            const Icon = item.id === 'skip_question' ? Zap : RefreshCw;

                            return (
                                <motion.div
                                    key={item.id}
                                    whileHover={canAfford ? { scale: 1.02 } : {}}
                                    whileTap={canAfford ? { scale: 0.98 } : {}}
                                    className={`flex items-center p-4 rounded-2xl border-2 border-b-4 transition-all ${canAfford
                                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 hover:border-orange-400 cursor-pointer'
                                        : 'bg-neutral-50 border-neutral-200 opacity-60'
                                        }`}
                                >
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mr-3 ${canAfford ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : 'bg-neutral-200 text-neutral-400'
                                        }`}>
                                        <Icon size={28} />
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-black text-neutral-700 text-base">{item.name}</h4>
                                        <p className="text-xs text-neutral-500 font-medium leading-tight">{item.description}</p>
                                    </div>

                                    <Button
                                        size="sm"
                                        disabled={!canAfford}
                                        variant={canAfford ? 'primary' : 'locked'}
                                        onClick={() => handleClickItem(item)}
                                    >
                                        <div className="flex items-center gap-1 font-black">
                                            {item.cost} <Gem size={14} fill="currentColor" />
                                        </div>
                                    </Button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Utilities Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-gradient-to-r from-pink-500 to-red-500 p-2 rounded-lg">
                            <Heart size={20} className="text-white" />
                        </div>
                        <h3 className="text-xl font-black text-neutral-700">Utilidades</h3>
                    </div>
                    <p className="text-sm text-neutral-500 font-medium mb-4">Itens essenciais para manter sua sequência e progresso</p>

                    <div className="grid gap-3">
                        {utilities.map((item) => {
                            const canAfford = userStats.gems >= item.cost;
                            const Icon = item.id === 'refill_hearts' ? Heart : Flame;
                            const colors = item.id === 'refill_hearts'
                                ? { light: 'from-pink-50 to-red-50', border: 'border-pink-300 hover:border-red-400', bg: 'from-pink-500 to-red-500' }
                                : { light: 'from-orange-50 to-yellow-50', border: 'border-orange-300 hover:border-yellow-400', bg: 'from-orange-500 to-yellow-500' };

                            return (
                                <motion.div
                                    key={item.id}
                                    whileHover={canAfford ? { scale: 1.02 } : {}}
                                    whileTap={canAfford ? { scale: 0.98 } : {}}
                                    className={`flex items-center p-4 rounded-2xl border-2 border-b-4 transition-all ${canAfford
                                        ? `bg-gradient-to-r ${colors.light} ${colors.border} cursor-pointer`
                                        : 'bg-neutral-50 border-neutral-200 opacity-60'
                                        }`}
                                >
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mr-3 ${canAfford ? `bg-gradient-to-br ${colors.bg} text-white` : 'bg-neutral-200 text-neutral-400'
                                        }`}>
                                        <Icon size={28} />
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-black text-neutral-700 text-base">{item.name}</h4>
                                        <p className="text-xs text-neutral-500 font-medium leading-tight">{item.description}</p>
                                    </div>

                                    <Button
                                        size="sm"
                                        disabled={!canAfford}
                                        variant={canAfford ? 'primary' : 'locked'}
                                        onClick={() => handleClickItem(item)}
                                    >
                                        <div className="flex items-center gap-1 font-black">
                                            {item.cost} <Gem size={14} fill="currentColor" />
                                        </div>
                                    </Button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Currency Packs Section */}
                <div className="border-t-2 border-neutral-200 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                            <Gem size={20} className="text-white" />
                        </div>
                        <h3 className="text-xl font-black text-neutral-700">Banco de Gemas</h3>
                        <span className="text-xs font-bold bg-green-100 text-green-600 px-2 py-1 rounded-full">$$$</span>
                    </div>
                    <p className="text-sm text-neutral-500 font-medium mb-4">Compre gemas com dinheiro real</p>

                    <div className="grid grid-cols-2 gap-3">
                        {gemPacks.map((item) => (
                            <motion.button
                                key={item.id}
                                onClick={() => handleClickItem(item)}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex flex-col items-center p-5 rounded-2xl border-2 border-b-4 border-neutral-200 bg-gradient-to-br from-white to-blue-50 hover:border-blue-400 hover:shadow-xl transition-all"
                            >
                                <div className="w-16 h-16 mb-3 relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
                                    <Gem size={48} className="text-blue-500 relative z-10 drop-shadow-lg" fill="url(#gemGradient)" />
                                </div>
                                <h4 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-2xl mb-1">
                                    +{item.gemAmount}
                                </h4>
                                <p className="font-bold text-neutral-500 text-xs mb-3">{item.name}</p>
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-xl font-black text-sm shadow-lg">
                                    R$ {item.cost}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* SVG Gradient Definition */}
                <svg width="0" height="0">
                    <defs>
                        <linearGradient id="gemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#9333EA', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Payment Sheet Modal */}
            <AnimatePresence>
                {paymentItem && (
                    <PaymentSheet
                        item={paymentItem}
                        onClose={() => setPaymentItem(null)}
                        onConfirm={handlePaymentConfirm}
                    />
                )}
            </AnimatePresence>

            {/* Success Overlay */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white px-8 py-6 rounded-3xl shadow-2xl border-4 border-green-400 flex flex-col items-center min-w-[280px]"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="text-green-500 mb-4 bg-green-100 p-4 rounded-full"
                        >
                            <CheckCircle size={56} />
                        </motion.div>
                        <h3 className="text-2xl font-black text-neutral-700 mb-2">Sucesso!</h3>
                        <p className="text-neutral-500 font-bold text-center">
                            {selectedItem.type === 'currency_pack'
                                ? `Você recebeu ${selectedItem.gemAmount} gemas!`
                                : `${selectedItem.name} adquirido!`
                            }
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, ShoppingBag } from 'lucide-react';
import { Button } from './Button';
import { HEART_REFILL_TIME_MS } from '../constants';

interface HeartRefillModalProps {
    onClose: () => void;
    onGoToShop: () => void;
    nextRefillTime: number | null;
}

export const HeartRefillModal: React.FC<HeartRefillModalProps> = ({ onClose, onGoToShop, nextRefillTime }) => {

    // Simple time diff calculation for display
    const minutesLeft = nextRefillTime
        ? Math.ceil((nextRefillTime + HEART_REFILL_TIME_MS - Date.now()) / 60000)
        : 35;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white w-full max-w-sm rounded-3xl p-6 text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-neutral-200">
                    <div className="h-full bg-danger w-1/12 animate-[pulse_2s_infinite]"></div>
                </div>

                <div className="w-24 h-24 mx-auto bg-danger-dim rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <Heart size={48} className="text-danger fill-danger" />
                </div>

                <h2 className="text-2xl font-black text-neutral-800 mb-2">Vidas Esgotadas!</h2>
                <p className="text-neutral-500 font-medium mb-6">
                    Você errou demais e precisa descansar o cérebro (ou comprar mais café).
                </p>

                <div className="bg-neutral-100 rounded-xl p-4 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="text-brand" />
                        <span className="font-bold text-neutral-600">Próxima vida em:</span>
                    </div>
                    <span className="font-black text-xl text-brand">{minutesLeft} min</span>
                </div>

                <div className="space-y-3">
                    <Button fullWidth variant="primary" onClick={onGoToShop}>
                        <div className="flex items-center justify-center gap-2">
                            <ShoppingBag size={20} /> RECARREGAR AGORA
                        </div>
                    </Button>
                    <Button fullWidth variant="ghost" onClick={onClose}>
                        ESPERAR
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Lock, Check, X } from 'lucide-react';
import { Button } from './Button';
import { ShopItem } from '../types';

interface PaymentSheetProps {
    item: ShopItem;
    onClose: () => void;
    onConfirm: () => void;
}

export const PaymentSheet: React.FC<PaymentSheetProps> = ({ item, onClose, onConfirm }) => {
    const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
    const [cardNum, setCardNum] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    // Formatters
    const formatCard = (val: string) => val.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    const formatExpiry = (val: string) => val.replace(/\D/g, '').replace(/(\d{2})(\d{1,2})/, '$1/$2').slice(0, 5);

    const isValid = cardNum.length >= 18 && expiry.length === 5 && cvc.length >= 3;

    const handleSubmit = () => {
        setStep('processing');
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onConfirm();
            }, 1500);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-10 sm:pb-6 relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-neutral-400 hover:bg-neutral-100 rounded-full">
                    <X size={24} />
                </button>

                {step === 'input' && (
                    <>
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                                <Lock size={24} />
                            </div>
                            <h2 className="text-xl font-black text-neutral-800">Checkout Seguro</h2>
                            <p className="text-neutral-500 font-bold">Comprando: <span className="text-brand-dark">{item.name}</span></p>
                            <p className="text-2xl font-black text-neutral-800 mt-2">R$ {item.cost}</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-xs font-bold text-neutral-400 uppercase ml-1">Número do Cartão</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-3.5 text-neutral-400" size={20} />
                                    <input
                                        type="text"
                                        value={cardNum}
                                        onChange={(e) => setCardNum(formatCard(e.target.value))}
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full pl-12 pr-4 py-3 bg-neutral-100 rounded-xl font-mono font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-brand"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-neutral-400 uppercase ml-1">Validade</label>
                                    <input
                                        type="text"
                                        value={expiry}
                                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                        placeholder="MM/AA"
                                        className="w-full px-4 py-3 bg-neutral-100 rounded-xl font-mono font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-brand text-center"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-neutral-400 uppercase ml-1">CVC</label>
                                    <input
                                        type="password"
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value.slice(0, 3))}
                                        placeholder="123"
                                        className="w-full px-4 py-3 bg-neutral-100 rounded-xl font-mono font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-brand text-center"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button fullWidth onClick={handleSubmit} disabled={!isValid}>
                            PAGAR AGORA
                        </Button>

                        <div className="flex justify-center gap-4 mt-4 opacity-50 grayscale">
                            <div className="h-6 w-10 bg-neutral-300 rounded"></div>
                            <div className="h-6 w-10 bg-neutral-300 rounded"></div>
                            <div className="h-6 w-10 bg-neutral-300 rounded"></div>
                        </div>
                    </>
                )}

                {step === 'processing' && (
                    <div className="flex flex-col items-center py-12">
                        <div className="w-16 h-16 border-4 border-neutral-200 border-t-brand rounded-full animate-spin mb-6"></div>
                        <h3 className="text-lg font-bold text-neutral-600">Processando pagamento...</h3>
                    </div>
                )}

                {step === 'success' && (
                    <div className="flex flex-col items-center py-12">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg"
                        >
                            <Check size={48} strokeWidth={4} />
                        </motion.div>
                        <h3 className="text-2xl font-black text-neutral-800">Pagamento Aprovado!</h3>
                    </div>
                )}

            </motion.div>
        </div>
    );
};

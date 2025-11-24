import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check } from 'lucide-react';
import { Button } from './Button';

interface TermsOverlayProps {
    onAccept: () => void;
    onDecline?: () => void; // Optional, maybe just close window or show error
    isVisible: boolean;
    isReadOnly?: boolean; // If true, just showing info, no accept button needed (or just a "Close" button)
    onClose?: () => void;
}

export const TermsOverlay: React.FC<TermsOverlayProps> = ({ onAccept, isVisible, isReadOnly = false, onClose }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="bg-brand p-6 flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-full">
                                <Shield className="text-white" size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Termos de Uso</h2>
                                <p className="text-brand-dim font-bold text-sm">Versão Beta</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto flex-1 text-neutral-600 dark:text-neutral-300 space-y-4 text-sm leading-relaxed">
                            <p>
                                <strong className="text-neutral-800 dark:text-white">Atenção:</strong> A ProGres está atualmente em fase <strong>Beta</strong>.
                            </p>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-r-lg">
                                <p className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                                    <strong>🎮 Sobre a Plataforma</strong>
                                </p>
                                <p className="text-blue-700 dark:text-blue-300 text-xs">
                                    ProGres é uma plataforma gamificada de aprendizado de programação que oferece: lições interativas com diferentes tipos de exercícios (múltipla escolha, arrastar e soltar, preencher lacunas, etc.), desafios de debug de código em projetos reais, sistema de hearts e streaks, conquistas (achievements), XP e níveis, Smart Workout adaptativo baseado em seu desempenho, e grimório para revisão de conceitos.
                                </p>
                            </div>

                            <p>
                                <strong className="text-neutral-800 dark:text-white">Armazenamento de Dados:</strong> Durante esta fase Beta, os dados de progresso do usuário são armazenados <strong>localmente no dispositivo</strong> através do navegador (LocalStorage) e também podem ser sincronizados com nossa base de dados (PostgreSQL) caso você crie uma conta.
                            </p>

                            <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-400 p-4 rounded-r-lg">
                                <p className="text-orange-800 dark:text-orange-200 font-medium">
                                    ⚠️ O Usuário reconhece que a exclusão do histórico do navegador, limpeza de cache ou uso de modos de navegação privados pode resultar na <strong>perda dos dados locais</strong>. Recomendamos criar uma conta para backup na nuvem.
                                </p>
                            </div>

                            <p>
                                <strong className="text-neutral-800 dark:text-white">Funcionalidades Premium:</strong> A plataforma oferece um plano premium (via Stripe) que remove limitações de hearts, permite acesso ilimitado aos exercícios e desbloqueia recursos exclusivos.
                            </p>

                            <p>
                                Embora envidemos nossos melhores esforços para manter o funcionamento adequado da plataforma, o Usuário compreende que, devido ao caráter Beta, falhas, instabilidades, bugs em desafios de código e perda de dados podem ocorrer.
                            </p>

                            <p className="text-xs text-neutral-400">
                                Nos limites permitidos pela legislação aplicável, a ProGres não se responsabiliza por danos decorrentes de perda de dados locais causada por ações do Usuário ou limitações tecnológicas inerentes à fase Beta. Ao usar a plataforma, você concorda em fornecer feedback sobre bugs e melhorias.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                            {!isReadOnly ? (
                                <div className="flex flex-col gap-3">
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        onClick={onAccept}
                                        className="h-12 text-lg"
                                    >
                                        <Check className="mr-2" size={20} />
                                        Li e Aceito os Termos
                                    </Button>
                                    <p className="text-center text-xs text-neutral-400">
                                        Ao continuar, você concorda com o armazenamento local de dados.
                                    </p>
                                </div>
                            ) : (
                                <Button
                                    variant="secondary"
                                    fullWidth
                                    onClick={onClose}
                                >
                                    Fechar
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

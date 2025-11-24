import React from 'react';
import { CheckCircle, XCircle, Zap } from 'lucide-react';
import { Button } from './Button';
import { AnimatePresence, motion } from 'framer-motion';

interface FeedbackModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  correctAnswer?: string;
  feedbackText: string;
  onContinue: () => void;
  skipTokens?: number;
  onSkip?: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  isCorrect,
  correctAnswer,
  feedbackText,
  onContinue,
  skipTokens = 0,
  onSkip,
}) => {
  if (!isOpen) return null;

  const title = isCorrect ? 'Incrível!' : 'Incorreto';
  const Icon = isCorrect ? CheckCircle : XCircle;
  const canSkip = !isCorrect && skipTokens > 0 && onSkip;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`w-full pointer-events-auto ${isCorrect ? 'bg-[#d7ffb8]' : 'bg-[#ffdfe0]'} border-t-2 ${isCorrect ? 'border-brand-light' : 'border-danger/30'} p-6 pb-8`}
        >
          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            <div className="flex items-start gap-4 mb-2">
              <div className="mt-1 bg-white rounded-full p-1">
                <Icon size={32} className={isCorrect ? 'text-brand' : 'text-danger'} fill="white" />
              </div>
              <div className="flex-1">
                <h3 className={`text-2xl font-extrabold mb-2 ${isCorrect ? 'text-brand-dark' : 'text-danger-dark'}`}>
                  {title}
                </h3>
                {!isCorrect && (
                  <div className="mb-2">
                    <p className="font-bold text-danger-dark text-sm uppercase">Resposta correta:</p>
                    <p className="text-slate-700">{correctAnswer}</p>
                  </div>
                )}
                <p className={`${isCorrect ? 'text-brand-dark' : 'text-danger-dark'} font-medium`}>
                  {feedbackText}
                </p>
              </div>
            </div>

            <div className={`flex gap-3 ${canSkip ? 'flex-row' : ''}`}>
              <Button
                variant={isCorrect ? 'primary' : 'danger'}
                fullWidth
                onClick={onContinue}
              >
                {isCorrect ? 'Continuar' : 'Tentar Novamente'}
              </Button>

              {canSkip && (
                <button
                  onClick={onSkip}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold border-b-4 border-yellow-700 active:border-b-2 active:translate-y-[2px] transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
                >
                  <Zap size={20} fill="currentColor" />
                  <span>Pular</span>
                  <span className="bg-yellow-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">{skipTokens}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
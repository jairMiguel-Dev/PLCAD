import React, { useEffect, useState } from 'react';
import { Volume2, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './Button';

interface TheoryCardProps {
  title: string;
  content: string;
  phonetic?: string;
  englishWord?: string;
  codeSnippet?: string;
  onContinue: () => void;
}

export const TheoryCard: React.FC<TheoryCardProps> = ({
  title,
  content,
  phonetic,
  englishWord,
  codeSnippet,
  onContinue
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReadingTheory, setIsReadingTheory] = useState(false);

  // Play audio automatically on mount (optional) or mostly via button
  const speak = () => {
    if (!englishWord) return;

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(englishWord);
    utterance.lang = 'en-US';
    utterance.rate = 0.8; // Slower for learning
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const readTheory = () => {
    if (isReadingTheory) {
      window.speechSynthesis.cancel();
      setIsReadingTheory(false);
      return;
    }

    setIsReadingTheory(true);
    // Remove markdown symbols for cleaner reading
    const cleanContent = content.replace(/\*\*/g, '').replace(/`/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanContent);
    utterance.lang = 'pt-BR'; // Portuguese voice for theory
    utterance.rate = 0.8; // Slower for learning, same as speak()
    utterance.onend = () => setIsReadingTheory(false);
    window.speechSynthesis.speak(utterance);
  };

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    }
  }, []);

  return (
    <div className="flex flex-col h-full px-6 pb-8 pt-4 max-w-2xl mx-auto w-full">

      {/* Card Container */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-1 bg-white rounded-3xl border-2 border-neutral-200 shadow-[0_8px_0_#E5E5E5] overflow-hidden flex flex-col mb-8"
      >
        {/* Header */}
        <div className="bg-brand/10 p-6 border-b-2 border-brand/20 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl shadow-sm text-brand">
            <Sparkles size={24} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider">Teoria Flash</h2>
            <h1 className="text-2xl font-black text-neutral-800">{title}</h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto">

          {/* Audio / Pronunciation Section */}
          {englishWord && (
            <div className="flex items-center justify-between bg-neutral-50 rounded-2xl p-4 border-2 border-neutral-100">
              <div>
                <p className="text-sm font-bold text-neutral-400 mb-1">Inglês (Pronúncia)</p>
                <p className="text-2xl font-black text-neutral-700">{englishWord}</p>
                {phonetic && <p className="text-brand font-mono text-lg">{phonetic}</p>}
              </div>
              <button
                onClick={speak}
                className={`
                    w-14 h-14 rounded-full flex items-center justify-center transition-all
                    ${isPlaying ? 'bg-brand text-white scale-110 ring-4 ring-brand/30' : 'bg-white border-2 border-neutral-200 text-brand hover:bg-brand hover:text-white'}
                  `}
              >
                <Volume2 size={28} className={isPlaying ? 'animate-pulse' : ''} />
              </button>
            </div>
          )}

          {/* The Informal Explanation */}
          <div className="prose prose-slate relative">
            <div className="flex justify-between items-start gap-4">
              <p className="text-lg text-neutral-600 leading-relaxed font-medium flex-1">
                {content.split('**').map((part, i) =>
                  i % 2 === 1 ? <span key={i} className="text-brand-dark font-extrabold bg-brand-dim px-1 rounded">{part}</span> : part
                )}
              </p>
              <button
                onClick={readTheory}
                className={`
                        min-w-[48px] h-12 rounded-xl flex items-center justify-center transition-all
                        ${isReadingTheory ? 'bg-brand text-white animate-pulse' : 'bg-neutral-100 text-neutral-400 hover:text-brand hover:bg-brand/10'}
                    `}
                title={isReadingTheory ? "Parar leitura" : "Ouvir explicação"}
              >
                <Volume2 size={24} />
              </button>
            </div>
          </div>

          {/* Code Snippet */}
          {codeSnippet && (
            <div className="bg-slate-800 rounded-xl p-5 shadow-inner relative">
              <div className="absolute top-3 right-3 flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
              </div>
              <pre className="font-mono text-white text-lg whitespace-pre-wrap pt-2">
                <code dangerouslySetInnerHTML={{ __html: codeSnippet.replace('//', '<span class="text-slate-500">//').replace('const', '<span class="text-purple-400">const</span>').replace('console', '<span class="text-blue-400">console</span>') }} />
              </pre>
            </div>
          )}
        </div>
      </motion.div>

      <Button
        fullWidth
        size="lg"
        onClick={onContinue}
        className="animate-bounce-slow shadow-btn-primary"
      >
        ENTENDI, VAMOS LÁ! <ArrowRight className="ml-2" size={20} />
      </Button>
    </div>
  );
};
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

interface SplashProps {
  onFinish: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="h-full w-full bg-brand flex flex-col items-center justify-center text-white relative overflow-hidden">
        {/* Background rings */}
        <div className="absolute w-[600px] h-[600px] border-[40px] border-white/10 rounded-full animate-pulse-fast"></div>
        <div className="absolute w-[400px] h-[400px] border-[40px] border-white/10 rounded-full"></div>
        
        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="z-10 flex flex-col items-center"
        >
            <div className="w-24 h-24 bg-white rounded-3xl shadow-[0_10px_0_rgba(0,0,0,0.1)] flex items-center justify-center mb-6 rotate-6">
                <Terminal size={48} className="text-brand" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-2">ProGres</h1>
            <p className="text-brand-dim font-bold text-lg tracking-wide">Learn Code. Speak English.</p>
        </motion.div>
    </div>
  );
};
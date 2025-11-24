
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Flame, Zap, Award, Target, Book, Volume2, Smartphone, Moon, Sun, Edit2, Check as CheckIcon, X as XIcon, FileText, Briefcase, TrendingUp, Calendar, Star, Code, ChevronRight, GraduationCap } from 'lucide-react';
import { Button } from '../components/Button';
import { UserStats } from '../types';
import { ACHIEVEMENTS, calculateXpForNextLevel } from '../constants';
import { cancelSubscription } from '../services/stripe';

interface ProfileProps {
    stats: UserStats;
    onToggleSetting: (key: 'soundEnabled' | 'hapticsEnabled') => void;
    onSetTheme: (theme: 'light' | 'dark') => void;
    onCancelPremium?: () => void;
    onShowTerms: () => void;
    onUpdateUsername: (name: string) => void;
    onLogout: () => void;
    onDeleteAccount: () => void;
    onViewAllAchievements: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ stats, onToggleSetting, onSetTheme, onCancelPremium, onShowTerms, onUpdateUsername, onLogout, onDeleteAccount, onViewAllAchievements }) => {
    const [canceling, setCanceling] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(stats.username);

    const handleSaveName = () => {
        if (tempName.trim()) {
            onUpdateUsername(tempName.trim());
            setIsEditingName(false);
        }
    };

    const handleCancelSubscription = async () => {
        if (!confirm('Tem certeza que deseja cancelar sua assinatura ProGres Super?')) return;
        setCanceling(true);
        try {
            const result = await cancelSubscription('demo_sub_' + Date.now());
            alert(result.message);
            if (result.status === 'canceled' && onCancelPremium) {
                onCancelPremium();
            }
        } catch (error) {
            alert('Erro ao cancelar assinatura. Tente novamente.');
        } finally {
            setCanceling(false);
        }
    };

    // Lógica de Nível Profissional
    const getCareerLevel = (xp: number) => {
        if (xp < 1000) return { title: 'Estagiário Dev', color: 'text-neutral-500', bg: 'bg-neutral-100', next: 1000 };
        if (xp < 5000) return { title: 'Dev Júnior', color: 'text-green-500', bg: 'bg-green-100', next: 5000 };
        if (xp < 15000) return { title: 'Dev Pleno', color: 'text-blue-500', bg: 'bg-blue-100', next: 15000 };
        return { title: 'Dev Sênior', color: 'text-purple-500', bg: 'bg-purple-100', next: 50000 };
    };

    const career = getCareerLevel(stats.totalXP);
    const xpForNext = calculateXpForNextLevel(stats.level);
    const progressToNext = Math.min(100, (stats.totalXP / xpForNext) * 100);
    const isDark = stats.settings.theme === 'dark';

    // Simulação de Heatmap (últimos 14 dias)
    const activityData = Array.from({ length: 14 }, (_, i) => ({
        day: i,
        level: Math.random() > 0.3 ? Math.floor(Math.random() * 4) : 0 // 0-3 levels of activity
    }));

    return (
        <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 pb-24 overflow-y-auto transition-colors duration-300">
            {/* Header com Gradiente */}
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 pb-16 pt-6 px-6 rounded-b-[2.5rem] shadow-xl">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-2xl font-black text-white tracking-wide">MEU PERFIL</h1>
                    <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm">
                        <Settings size={24} />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`w-24 h-24 rounded-full border-4 ${stats.isPremium ? 'border-yellow-400' : 'border-white/30'} bg-white/10 backdrop-blur-md flex items-center justify-center text-5xl shadow-2xl relative`}>
                        😎
                        {stats.isPremium && (
                            <div className="absolute -top-2 -right-2 bg-yellow-400 text-white p-1.5 rounded-full shadow-md">
                                <Award size={20} fill="currentColor" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-white">
                        {isEditingName ? (
                            <div className="flex items-center gap-2 mb-1">
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    className="text-xl font-black text-white bg-transparent border-b-2 border-white/50 focus:outline-none w-full"
                                    autoFocus
                                />
                                <button onClick={handleSaveName} className="p-1 bg-white text-blue-600 rounded-full"><CheckIcon size={16} /></button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-black">{stats.username}</h2>
                                <button onClick={() => setIsEditingName(true)} className="text-white/60 hover:text-white"><Edit2 size={16} /></button>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-blue-100 font-medium text-sm mb-2">
                            <Briefcase size={14} />
                            <span>{career.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold bg-black/20 px-3 py-1 rounded-full w-fit">
                            <span>LVL {stats.level}</span>
                            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                            <span>Entrou em 2025</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal (Sobrepondo o Header) */}
            <div className="px-4 -mt-12 relative z-10 space-y-6">

                {/* Card de Carreira */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white dark:bg-neutral-800 rounded-3xl p-5 shadow-lg border border-neutral-100 dark:border-neutral-700"
                >
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-extrabold text-neutral-700 dark:text-white flex items-center gap-2">
                            <TrendingUp className="text-blue-500" size={20} />
                            Progresso de Carreira
                        </h3>
                        <span className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg">
                            {stats.totalXP} / {career.next} XP
                        </span>
                    </div>
                    <div className="w-full h-3 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden mb-2">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(stats.totalXP / career.next) * 100}%` }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        />
                    </div>
                    <p className="text-xs text-neutral-400 font-medium text-center">
                        Faltam <span className="text-neutral-600 dark:text-neutral-300 font-bold">{career.next - stats.totalXP} XP</span> para o próximo nível
                    </p>
                </motion.div>

                {/* Grid de Estatísticas */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-orange-500 font-bold text-sm">
                            <Flame size={18} fill="currentColor" /> Ofensiva
                        </div>
                        <span className="text-3xl font-black text-neutral-800 dark:text-white">{stats.streakDays}</span>
                        <span className="text-xs text-neutral-400">Dias seguidos</span>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm">
                            <Zap size={18} fill="currentColor" /> Total XP
                        </div>
                        <span className="text-3xl font-black text-neutral-800 dark:text-white">{stats.totalXP}</span>
                        <span className="text-xs text-neutral-400">Pontos de exp.</span>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                            <Book size={18} /> Lições
                        </div>
                        <span className="text-3xl font-black text-neutral-800 dark:text-white">{stats.lessonsCompleted}</span>
                        <span className="text-xs text-neutral-400">Completadas</span>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-purple-500 font-bold text-sm">
                            <Target size={18} /> Precisão
                        </div>
                        <span className="text-3xl font-black text-neutral-800 dark:text-white">92%</span>
                        <span className="text-xs text-neutral-400">Média geral</span>
                    </div>
                </div>

                {/* Heatmap de Atividade */}
                <div className="bg-white dark:bg-neutral-800 rounded-3xl p-5 shadow-sm border border-neutral-100 dark:border-neutral-700">
                    <h3 className="font-extrabold text-neutral-700 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar size={20} className="text-green-500" />
                        Atividade Recente
                    </h3>
                    <div className="flex justify-between items-end h-16 gap-1">
                        {activityData.map((d, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                <div
                                    className={`w-full rounded-md ${d.level === 0 ? 'bg-neutral-100 dark:bg-neutral-700 h-2' :
                                        d.level === 1 ? 'bg-green-200 dark:bg-green-900 h-6' :
                                            d.level === 2 ? 'bg-green-400 dark:bg-green-600 h-10' :
                                                'bg-green-500 dark:bg-green-500 h-14'
                                        }`}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-neutral-400 font-bold uppercase">
                        <span>2 semanas atrás</span>
                        <span>Hoje</span>
                    </div>
                </div>

                {/* Conquistas */}
                <div className="bg-white dark:bg-neutral-800 rounded-3xl p-5 shadow-sm border border-neutral-100 dark:border-neutral-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-extrabold text-neutral-700 dark:text-white flex items-center gap-2">
                            <Award size={20} className="text-yellow-500" />
                            Conquistas
                        </h3>
                        <span className="text-xs font-bold text-neutral-400">
                            {stats.unlockedAchievements.length}/{ACHIEVEMENTS.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {ACHIEVEMENTS.slice(0, 5).map((ach) => {
                            const isUnlocked = stats.unlockedAchievements.includes(ach.id);
                            return (
                                <div key={ach.id} className={`flex items-center gap-4 p-3 rounded-xl border-b-2 ${isUnlocked ? 'bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/30' : 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-100 dark:border-neutral-700 opacity-60'}`}>
                                    <div className="text-3xl filter drop-shadow-sm">{ach.icon}</div>
                                    <div className="flex-1">
                                        <h4 className={`font-bold text-sm ${isUnlocked ? 'text-neutral-800 dark:text-white' : 'text-neutral-500'}`}>{ach.title}</h4>
                                        <p className="text-xs text-neutral-400 leading-tight">{ach.description}</p>
                                    </div>
                                    {isUnlocked && <CheckIcon size={16} className="text-green-500" />}
                                </div>
                            );
                        })}
                    </div>

                    <Button
                        variant="ghost"
                        fullWidth
                        onClick={onViewAllAchievements}
                        className="mt-4 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold"
                    >
                        VER TODAS AS CONQUISTAS
                    </Button>
                </div>

                {/* Configurações Rápidas */}
                <div className="bg-white dark:bg-neutral-800 rounded-3xl p-5 shadow-sm border border-neutral-100 dark:border-neutral-700">
                    <h3 className="font-extrabold text-neutral-700 dark:text-white mb-4">Preferências</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Volume2 size={20} className="text-neutral-400" />
                                <span className="font-bold text-neutral-700 dark:text-neutral-200">Efeitos Sonoros</span>
                            </div>
                            <div onClick={() => onToggleSetting('soundEnabled')} className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${stats.settings.soundEnabled ? 'bg-brand' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${stats.settings.soundEnabled ? 'translate-x-5' : ''}`} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Smartphone size={20} className="text-neutral-400" />
                                <span className="font-bold text-neutral-700 dark:text-neutral-200">Vibração</span>
                            </div>
                            <div onClick={() => onToggleSetting('hapticsEnabled')} className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${stats.settings.hapticsEnabled ? 'bg-brand' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${stats.settings.hapticsEnabled ? 'translate-x-5' : ''}`} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {isDark ? <Moon size={20} className="text-purple-400" /> : <Sun size={20} className="text-orange-400" />}
                                <span className="font-bold text-neutral-700 dark:text-neutral-200">Tema Escuro</span>
                            </div>
                            <div onClick={() => onSetTheme(isDark ? 'light' : 'dark')} className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${isDark ? 'bg-purple-500' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isDark ? 'translate-x-5' : ''}`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Área de Perigo e Links */}
                <div className="space-y-3 pt-4">
                    {stats.isPremium && (
                        <Button variant="ghost" fullWidth onClick={handleCancelSubscription} disabled={canceling} className="bg-red-50 text-red-500 hover:bg-red-100 border-red-100">
                            {canceling ? 'Processando...' : 'Cancelar Assinatura Premium'}
                        </Button>
                    )}
                    <Button variant="ghost" fullWidth onClick={onShowTerms} className="text-neutral-500">
                        <FileText size={16} className="mr-2" /> Termos e Privacidade
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" onClick={onLogout}>Sair</Button>
                        <Button variant="outline" onClick={onDeleteAccount} className="border-red-200 text-red-400 hover:bg-red-50">Excluir Conta</Button>
                    </div>
                    <p className="text-center text-[10px] text-neutral-300 font-bold uppercase tracking-widest pt-4">
                        ProGres v1.0.0 (Beta)
                    </p>
                </div>
            </div>
        </div>
    );
};

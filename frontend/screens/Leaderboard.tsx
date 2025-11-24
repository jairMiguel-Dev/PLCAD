
import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

interface LeaderboardProps {
  userXP: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ userXP }) => {
  // Mock Data simulating a league, but we sort 'You' into the right place
  const rawUsers = [
    { id: 1, name: 'Ana Dev', xp: Math.max(userXP + 450, 1000), avatar: '👩‍💻', isUser: false },
    { id: 2, name: 'CodeMaster', xp: Math.max(userXP + 200, 800), avatar: '🦸‍♂️', isUser: false },
    { id: 4, name: 'Pythonista', xp: Math.max(50, userXP - 150), avatar: '🐍', isUser: false },
    { id: 5, name: 'JavaJoe', xp: Math.max(20, userXP - 300), avatar: '☕', isUser: false },
    { id: 6, name: 'Newbie', xp: Math.max(0, userXP - 500), avatar: '🐣', isUser: false },
  ];

  const users = [
      ...rawUsers,
      { id: 3, name: 'You', xp: userXP, avatar: '😎', isUser: true }
  ].sort((a, b) => b.xp - a.xp); // Real sorting

  return (
    <div className="flex flex-col h-full bg-white pb-24">
      {/* Header */}
      <header className="bg-white border-b-2 border-neutral-100 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="text-warn" size={24} fill="currentColor" />
            <h2 className="text-lg font-bold text-neutral-400 uppercase tracking-widest">Liga Diamante</h2>
        </div>
        <p className="text-center text-neutral-500 text-sm">Os top 10 avançam para a Liga Obsidiana</p>
      </header>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="flex flex-col gap-4">
            {users.map((user, index) => {
                const rank = index + 1;
                let rankStyle = "text-neutral-500 font-bold";
                if (rank === 1) rankStyle = "text-yellow-500 font-black text-xl";
                if (rank === 2) rankStyle = "text-slate-400 font-black text-lg";
                if (rank === 3) rankStyle = "text-orange-400 font-black text-lg";

                return (
                    <motion.div 
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`
                            flex items-center p-4 rounded-2xl border-2 
                            ${user.isUser ? 'border-brand bg-brand/5 shadow-[0_4px_0_#46A302]' : 'border-neutral-200 bg-white'}
                        `}
                    >
                        <div className={`w-8 text-center ${rankStyle} mr-4`}>
                            {rank}
                        </div>
                        
                        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-2xl border-2 border-neutral-200 mr-4">
                            {user.avatar}
                        </div>

                        <div className="flex-1">
                            <h3 className={`font-bold ${user.isUser ? 'text-brand-dark' : 'text-neutral-700'}`}>
                                {user.name}
                            </h3>
                            <p className="text-xs text-neutral-400 font-bold">
                                {user.isUser ? 'Subindo rápido!' : 'Programador Ninja'}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="font-bold text-neutral-700">{user.xp} XP</p>
                        </div>
                    </motion.div>
                )
            })}
        </div>

        <div className="mt-8 p-6 bg-info/10 rounded-2xl border-2 border-info/30 text-center">
             <h3 className="font-bold text-info-dark mb-2">Promoção em 2 dias!</h3>
             <p className="text-sm text-neutral-600">Continue praticando para se manter no topo da tabela.</p>
        </div>
      </div>
    </div>
  );
};

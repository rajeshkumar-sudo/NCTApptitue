import React from 'react';
import { motion } from 'motion/react';
import { Trophy, CheckCircle2, XCircle, RefreshCcw, LogOut } from 'lucide-react';
import { UserData } from '../types';
import { cn } from '../utils';

interface ResultViewProps {
  user: UserData;
  score: number;
  total: number;
  onRestart: () => void;
  attempts: number;
}

export const ResultView: React.FC<ResultViewProps> = ({ user, score, total, onRestart, attempts }) => {
  const percentage = (score / total) * 100;
  const isPassed = percentage >= 60;
  const canRetake = attempts < 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto bg-white p-12 md:p-20 border border-black/10 shadow-2xl relative overflow-hidden text-center"
    >
      <div className="relative z-10 mb-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 mx-auto bg-black text-white flex items-center justify-center mb-12 shadow-2xl"
        >
          {isPassed ? <Trophy className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold text-black mb-8 tracking-tight uppercase">
            Assessment Finalized
          </h2>
          <p className="text-black/40 text-lg font-medium max-w-xl mx-auto leading-relaxed uppercase tracking-tight">
            The evaluation for <span className="text-black font-bold">{user.name}</span> has been archived in the central repository.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
        {[
          { label: 'Performance Score', value: `${score} / ${total}`, sub: 'Raw Points' },
          { label: 'Accuracy Index', value: `${Math.round(percentage)}%`, sub: 'Precision Rate' },
          { label: 'Final Standing', value: isPassed ? 'Qualified' : 'Review Required', sub: 'Status' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
            className="p-10 border border-black/5 flex flex-col items-center justify-center"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-black/30 mb-6">{stat.label}</span>
            <p className="text-4xl font-display font-bold mb-2 text-black">{stat.value}</p>
            <span className="text-[9px] font-bold uppercase tracking-widest text-black/20">{stat.sub}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col md:flex-row items-center justify-center gap-8"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="w-full md:w-auto flex items-center justify-center gap-4 px-12 py-6 bg-black text-white font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all"
        >
          <RefreshCcw className="w-3 h-3" />
          Re-Initialize
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.reload()}
          className="w-full md:w-auto flex items-center justify-center gap-4 px-12 py-6 bg-white text-black/40 border border-black/10 font-bold uppercase tracking-[0.3em] text-[10px] hover:text-black transition-all"
        >
          <LogOut className="w-3 h-3" />
          Terminate
        </motion.button>
      </motion.div>

      <div className="mt-24 pt-12 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
        <div className="flex flex-col items-start gap-1">
          <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-black">Verification ID</span>
          <span className="text-[10px] font-mono text-black font-bold">{user.rollNumber}</span>
        </div>
        <div className="flex items-center gap-10">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-black">Timestamp</span>
            <span className="text-[10px] font-mono text-black font-bold">{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="w-10 h-10 bg-black rounded flex items-center justify-center p-2 invert">
            <img 
              src="https://ik.imagekit.io/hgl70kbgh/nichetectcareer_logo%20(1).png" 
              alt="Niche Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

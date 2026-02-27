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
}

export const ResultView: React.FC<ResultViewProps> = ({ user, score, total, onRestart }) => {
  const percentage = (score / total) * 100;
  const isPassed = percentage >= 60;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto p-8 md:p-12 bg-white rounded-[2.5rem] shadow-sm border border-black/5 text-center"
    >
      <div className="mb-10">
        <div className={cn(
          "w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-6",
          isPassed ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
        )}>
          {isPassed ? <Trophy className="w-12 h-12" /> : <CheckCircle2 className="w-12 h-12" />}
        </div>
        <h2 className="text-4xl font-bold text-zinc-900 mb-2">Assessment Complete</h2>
        <p className="text-zinc-500">Thank you for participating, {user.name}.</p>
        <p className="text-zinc-400 text-sm mt-1">Roll Number: {user.rollNumber}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Score</p>
          <p className="text-3xl font-bold text-zinc-900">{score} / {total}</p>
        </div>
        <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Accuracy</p>
          <p className="text-3xl font-bold text-zinc-900">{Math.round(percentage)}%</p>
        </div>
        <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Status</p>
          <p className={cn(
            "text-xl font-bold uppercase tracking-tight",
            isPassed ? "text-emerald-600" : "text-orange-600"
          )}>
            {isPassed ? 'Passed' : 'Needs Review'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-all active:scale-[0.98]"
        >
          <RefreshCcw className="w-5 h-5" />
          Retake Assessment
        </button>
        <button
          onClick={() => window.location.reload()}
          className="w-full flex items-center justify-center gap-2 py-4 bg-white text-zinc-600 border border-zinc-200 rounded-2xl font-semibold hover:bg-zinc-50 transition-all active:scale-[0.98]"
        >
          <LogOut className="w-5 h-5" />
          Exit Platform
        </button>
      </div>
    </motion.div>
  );
};

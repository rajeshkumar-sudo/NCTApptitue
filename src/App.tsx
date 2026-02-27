import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RegistrationForm } from './components/RegistrationForm';
import { AptitudeTest } from './components/AptitudeTest';
import { ResultView } from './components/ResultView';
import { UserData, AppState } from './types';
import { BrainCircuit } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>('registration');
  const [user, setUser] = useState<UserData | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const handleRegister = (data: UserData) => {
    setUser(data);
    setAppState('test');
  };

  const handleComplete = (finalScore: number, totalQuestions: number) => {
    setScore(finalScore);
    setTotal(totalQuestions);
    setAppState('result');
  };

  const handleRestart = () => {
    setScore(0);
    setAppState('test');
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-zinc-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-zinc-200/30 rounded-full blur-3xl" />
      </div>

      <nav className="relative z-10 w-full px-6 py-8 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">AptiMaster</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-500">
          <span className="hover:text-zinc-900 cursor-pointer transition-colors">Resources</span>
          <span className="hover:text-zinc-900 cursor-pointer transition-colors">Support</span>
          <div className="h-4 w-px bg-zinc-200" />
          <span className="text-zinc-900">v2.4.0</span>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 pb-20">
        <AnimatePresence mode="wait">
          {appState === 'registration' && (
            <RegistrationForm key="reg" onRegister={handleRegister} />
          )}

          {appState === 'test' && user && (
            <motion.div
              key="test"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <AptitudeTest user={user} onComplete={handleComplete} />
            </motion.div>
          )}

          {appState === 'result' && user && (
            <ResultView
              key="result"
              user={user}
              score={score}
              total={total}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 w-full py-8 text-center text-zinc-400 text-xs tracking-widest uppercase">
        &copy; 2026 AptiMaster Professional Suite &bull; Secure Assessment Environment
      </footer>
    </div>
  );
}

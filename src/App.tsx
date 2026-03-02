import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RegistrationForm } from './components/RegistrationForm';
import { AptitudeTest } from './components/AptitudeTest';
import { ResultView } from './components/ResultView';
import { UserData, AppState } from './types';
import { sendTestResults } from './services/emailService';

export default function App() {
  const [appState, setAppState] = useState<AppState>('registration');
  const [user, setUser] = useState<UserData | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleRegister = (data: UserData) => {
    setUser(data);
    setAppState('test');
  };

  const handleComplete = async (finalScore: number, totalQuestions: number) => {
    setScore(finalScore);
    setTotal(totalQuestions);
    setAppState('result');
    setAttempts(prev => prev + 1);

    if (user) {
      setIsSendingEmail(true);
      await sendTestResults(user, finalScore, totalQuestions);
      setIsSendingEmail(false);
    }
  };

  const handleRestart = () => {
    if (attempts >= 2) {
      alert("Only one time Retake allowed. You have already completed your retake attempt.");
      return;
    }

    const confirmRetake = window.confirm("Only one time Retake allowed. Click OK to continue or Cancel to refresh.");
    
    if (confirmRetake) {
      setScore(0);
      setAppState('test');
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <nav className="relative z-50 w-full px-8 py-10 flex items-center justify-between max-w-7xl mx-auto border-b border-black/5">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-6"
        >
          <div className="w-10 h-10 bg-black rounded flex items-center justify-center overflow-hidden">
            <img 
              src="https://ik.imagekit.io/hgl70kbgh/nichetectcareer_logo%20(1).png" 
              alt="Niche Logo" 
              className="w-full h-full object-contain p-1.5 invert"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-display font-bold tracking-tight leading-none uppercase">Aptitude</span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-black/40 font-bold mt-1">Professional Evaluation</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-widest text-black/40"
        >
          <span className="hover:text-black cursor-pointer transition-colors">Documentation</span>
          <span className="hover:text-black cursor-pointer transition-colors">Support</span>
          <div className="h-3 w-px bg-black/10" />
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-black" />
            <span className="text-black/60">System Online</span>
          </div>
        </motion.div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4 py-20">
        <AnimatePresence mode="wait">
          {appState === 'registration' && (
            <RegistrationForm key="reg" onRegister={handleRegister} />
          )}

          {appState === 'test' && user && (
            <motion.div
              key="test"
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
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
              attempts={attempts}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 w-full py-12 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em]">
            &copy; 2026 Niche Tech Career &bull; Global Standard Assessment
          </p>
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-zinc-800" />
            <span className="text-zinc-700 text-[10px] uppercase tracking-widest font-bold">Secure Environment v4.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

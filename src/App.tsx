import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RegistrationForm } from './components/RegistrationForm';
import { AptitudeTest } from './components/AptitudeTest';
import { ResultView } from './components/ResultView';
import { UserData, AppState } from './types';
import { sendTestResults } from './services/emailService';
import { AlertTriangle } from 'lucide-react';
import { cn } from './utils';

export default function App() {
  const [appState, setAppState] = useState<AppState>('registration');
  const [user, setUser] = useState<UserData | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [retakeAlert, setRetakeAlert] = useState<{ 
    show: boolean; 
    message: string; 
    type: 'warning' | 'error' | 'key-entry';
    inputValue?: string;
    error?: string;
  } | null>(null);

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
      setRetakeAlert({
        show: true,
        type: 'error',
        message: "Only one time Retake allowed. You have already completed your retake attempt."
      });
      return;
    }

    setRetakeAlert({
      show: true,
      type: 'warning',
      message: "Only one time Retake allowed. Click 'Continue' to proceed to key verification."
    });
  };

  const proceedToKeyEntry = () => {
    setRetakeAlert({
      show: true,
      type: 'key-entry',
      message: "Please enter your authorized Retake Key to initialize the final attempt.",
      inputValue: '',
      error: ''
    });
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRetakeAlert(prev => prev ? { ...prev, inputValue: e.target.value, error: '' } : null);
  };

  const validateRetakeKey = () => {
    if (!retakeAlert?.inputValue) return;
    
    if (retakeAlert.inputValue.trim() === "673573") {
      confirmRetake();
    } else {
      setRetakeAlert(prev => prev ? { ...prev, error: 'Invalid Retake Key. Please enter the correct authorization code.' } : null);
    }
  };

  const confirmRetake = () => {
    setRetakeAlert(null);
    setScore(0);
    setAppState('test');
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
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4 py-20">
        <AnimatePresence>
          {retakeAlert?.show && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-md bg-white border border-black p-10 shadow-2xl text-center"
              >
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-8">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-display font-bold uppercase tracking-tight mb-4">
                  {retakeAlert.type === 'error' ? 'Limit Reached' : 'Retake Policy'}
                </h4>
                <p className="text-black/60 text-sm font-medium leading-relaxed mb-10 uppercase tracking-tight">
                  {retakeAlert.message}
                </p>
                <div className="flex flex-col gap-4">
                  {retakeAlert.type === 'warning' ? (
                    <>
                      <button
                        onClick={proceedToKeyEntry}
                        className="w-full py-4 bg-black text-white font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-black/90 transition-all"
                      >
                        Continue
                      </button>
                      <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 bg-white text-black/40 border border-black/10 font-bold uppercase tracking-[0.3em] text-[10px] hover:text-black transition-all"
                      >
                        Cancel
                      </button>
                    </>
                  ) : retakeAlert.type === 'key-entry' ? (
                    <div className="flex flex-col gap-6">
                      <div className="relative">
                        <input
                          autoFocus
                          type="text"
                          value={retakeAlert.inputValue}
                          onChange={handleKeyChange}
                          placeholder="Enter Code"
                          className={cn(
                            "w-full bg-black/5 border-b-2 px-4 py-4 text-center font-mono text-xl tracking-[0.2em] focus:outline-none transition-all",
                            retakeAlert.error ? "border-red-500" : "border-black focus:bg-black/10"
                          )}
                        />
                        {retakeAlert.error && (
                          <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-2 block">
                            {retakeAlert.error}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={validateRetakeKey}
                          className="w-full py-4 bg-black text-white font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-black/90 transition-all"
                        >
                          Verify & Start
                        </button>
                        <button
                          onClick={() => setRetakeAlert(null)}
                          className="text-[9px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors py-2"
                        >
                          Back to Results
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRetakeAlert(null)}
                      className="w-full py-4 bg-black text-white font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-black/90 transition-all"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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

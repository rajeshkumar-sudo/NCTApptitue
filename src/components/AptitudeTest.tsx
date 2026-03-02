import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2, AlertCircle, AlertTriangle, ChevronRight, ChevronLeft, Send } from 'lucide-react';
import { Question, UserData, QuestionsData } from '../types';
import { cn } from '../utils';
import questionsRaw from '../questions.json';

const questionsData = questionsRaw as unknown as QuestionsData;

interface AptitudeTestProps {
  user: UserData;
  onComplete: (score: number, total: number) => void;
}

export const AptitudeTest: React.FC<AptitudeTestProps> = ({ user, onComplete }) => {
  const [selectedSetIndex] = useState(() => Math.floor(Math.random() * questionsData.sets.length));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [violations, setViolations] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [securityAlert, setSecurityAlert] = useState<{ show: boolean; message: string; count: number; isInitial?: boolean } | null>({
    show: true,
    isInitial: true,
    count: 0,
    message: "Warning: Window minimization or tab switching is not allowed during the assessment. Violation 1/3. The test will automatically submit on the 3rd violation. Don't make it half of the screen."
  });

  const selectedSet = questionsData.sets[selectedSetIndex];
  const questions: Question[] = selectedSet.questions;

  const DIFFICULTY_TIMES = {
    'Easy': 40,
    'Medium': 60,
    'Hard': 100
  };

  useEffect(() => {
    if (questions[currentQuestionIndex]) {
      const difficulty = questions[currentQuestionIndex].difficulty || 'Medium';
      setQuestionTimeLeft(DIFFICULTY_TIMES[difficulty as keyof typeof DIFFICULTY_TIMES]);
    }
  }, [currentQuestionIndex, questions]);

  const handleSubmit = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    
    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) {
        score++;
      }
    });
    onComplete(score, questions.length);
  };

  useEffect(() => {
    if (!hasStarted || isSubmitted) return;

    const handleSecurityViolation = (message: string) => {
      setViolations((prev) => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          setSecurityAlert({ 
            show: true, 
            message: `Security Protocol Breach: ${message}. Maximum violations reached. Terminating session.`,
            count: newCount 
          });
          setTimeout(() => handleSubmit(), 3000);
          return newCount;
        } else {
          setSecurityAlert({ 
            show: true, 
            message: `Warning: Window minimization or tab switching is not allowed during the assessment. Violation ${newCount}/3. The test will automatically submit on the 3rd violation. Don't make it half of the screen.`,
            count: newCount
          });
          return newCount;
        }
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isSubmitted) {
        handleSecurityViolation('Tab switching or window minimization detected');
      }
    };

    const handleBlur = () => {
      if (!isSubmitted) {
        handleSecurityViolation('Window focus lost');
      }
    };

    const handleResize = () => {
      if (!isSubmitted) {
        // Check if window is significantly smaller than screen width (suggests split screen)
        const isSplitScreen = window.innerWidth < window.screen.availWidth * 0.85;
        if (isSplitScreen) {
          handleSecurityViolation('Split-screen or window resizing detected');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSubmitted, hasStarted]);

  useEffect(() => {
    if (!hasStarted || isSubmitted) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
      
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
          } else {
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasStarted, isSubmitted, currentQuestionIndex, questions.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionKey: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: optionKey,
    });
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      {/* Security Alert Dialog */}
      <AnimatePresence>
        {securityAlert?.show && (
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
              <h4 className="text-xl font-display font-bold uppercase tracking-tight mb-4">Security Alert</h4>
              <p className="text-black/60 text-sm font-medium leading-relaxed mb-10 uppercase tracking-tight">
                {securityAlert.message}
              </p>
              {securityAlert.count < 3 && (
                <button
                  onClick={() => {
                    setSecurityAlert(null);
                    if (securityAlert.isInitial) setHasStarted(true);
                  }}
                  className="w-full py-4 bg-black text-white font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-black/90 transition-all"
                >
                  {securityAlert.isInitial ? "I Understand & Begin" : "Acknowledge & Continue"}
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-4 mb-3">
            <span className="px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded">Live Session</span>
            <span className="text-black/30 text-[9px] font-bold uppercase tracking-widest">ID: {user.rollNumber}</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-black tracking-tight uppercase">{user.name}</h2>
          <p className="text-black/40 font-medium mt-1 text-sm">Technical Aptitude Evaluation</p>
        </motion.div>

        <div className="flex flex-wrap items-center gap-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-1 min-w-[140px]"
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-black/30">Total Remaining</span>
            <div className="flex items-center gap-3">
              <Clock className={cn("w-3 h-3", timeLeft < 300 ? "text-black animate-pulse" : "text-black/40")} />
              <span className={cn("font-mono text-2xl font-bold", timeLeft < 300 ? "text-black" : "text-black/80")}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-1 min-w-[140px]"
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-black/30">Question Timer</span>
            <div className="flex items-center gap-3">
              <Clock className={cn("w-3 h-3", questionTimeLeft < 10 ? "text-black animate-pulse" : "text-black/40")} />
              <span className={cn("font-mono text-2xl font-bold", questionTimeLeft < 10 ? "text-black" : "text-black/80")}>
                {formatTime(questionTimeLeft)}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full">
        {/* Question Area */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-12 md:p-16 border border-black/10 shadow-2xl min-h-[500px] flex flex-col relative"
            >
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-black/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-black"
                />
              </div>

              {/* Question Header */}
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-black/40 text-[9px] font-bold uppercase tracking-widest">
                    Question {currentQuestionIndex + 1} / {questions.length}
                  </span>
                  {currentQuestion.difficulty && (
                    <span className="px-2 py-0.5 border border-black/10 text-black/60 text-[9px] font-bold uppercase tracking-widest rounded">
                      {currentQuestion.difficulty}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-black leading-tight text-balance uppercase tracking-tight">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-4 mb-16 flex-grow">
                {Object.entries(currentQuestion.options).map(([key, option]) => (
                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    key={key}
                    onClick={() => handleOptionSelect(key)}
                    className={cn(
                      "group relative flex items-center p-6 border transition-all duration-200 text-left",
                      answers[currentQuestion.id] === key
                        ? "bg-black border-black text-white"
                        : "bg-transparent border-black/10 text-black/60 hover:border-black hover:text-black"
                    )}
                  >
                    <span className={cn(
                      "w-8 h-8 flex items-center justify-center border mr-6 text-[10px] font-bold transition-all",
                      answers[currentQuestion.id] === key
                        ? "bg-white/10 border-white/20 text-white"
                        : "bg-black/5 border-black/5 text-black/30 group-hover:border-black/20"
                    )}>
                      {key.toUpperCase()}
                    </span>
                    <span className="font-bold text-lg uppercase tracking-tight">{option}</span>
                  </motion.button>
                ))}
              </div>

              {/* Footer Controls */}
              <div className="flex items-center justify-end pt-12 border-t border-black/5">
                {currentQuestionIndex === questions.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="flex items-center gap-4 px-12 py-5 bg-black text-white font-bold uppercase tracking-[0.3em] text-[10px] shadow-xl"
                  >
                    Finalize Submission
                    <Send className="w-3 h-3" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="flex items-center gap-4 px-12 py-5 bg-black text-white font-bold uppercase tracking-[0.3em] text-[10px] shadow-xl"
                  >
                    Next Question
                    <ChevronRight className="w-3 h-3" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-12 flex justify-center opacity-30">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-black" />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-black">
                {violations === 0 ? "Environment Secure" : `Security Violations: ${violations}/3`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

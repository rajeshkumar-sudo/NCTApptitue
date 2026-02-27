import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, Send } from 'lucide-react';
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [violations, setViolations] = useState(0);
  const [hasStarted] = useState(true);

  const selectedSet = questionsData.sets[selectedSetIndex];
  const questions: Question[] = selectedSet.questions;

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
    if (!hasStarted) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isSubmitted) {
        setViolations((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            alert('Test terminated: You have exceeded the maximum number of window minimization violations (3/3). Your current progress will be submitted.');
            handleSubmit();
            return newCount;
          } else {
            alert(`Warning: Window minimization or tab switching is not allowed during the assessment. Violation ${newCount}/3. The test will automatically submit on the 3rd violation.`);
            return newCount;
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSubmitted, answers, hasStarted]);

  useEffect(() => {
    if (!hasStarted || timeLeft <= 0) {
      if (hasStarted && timeLeft <= 0) handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasStarted]);

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
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">{user.name}</h2>
          <p className="text-zinc-500">Aptitude Assessment in Progress</p>
        </div>
        <div className={cn(
          "flex items-center gap-3 px-6 py-3 rounded-2xl border transition-colors",
          timeLeft < 300 ? "bg-red-50 border-red-100 text-red-600" : "bg-zinc-50 border-zinc-100 text-zinc-700"
        )}>
          <Clock className={cn("w-5 h-5", timeLeft < 300 && "animate-pulse")} />
          <span className="font-mono text-xl font-medium">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-zinc-100 rounded-full mb-12 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-zinc-900"
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 min-h-[400px] flex flex-col">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <h3 className="text-xl md:text-2xl font-medium text-zinc-900 leading-relaxed">
            {currentQuestion.question}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 flex-grow">
          {Object.entries(currentQuestion.options).map(([key, option]) => (
            <button
              key={key}
              onClick={() => handleOptionSelect(key)}
              className={cn(
                "group relative flex items-center p-5 rounded-2xl border text-left transition-all duration-200",
                answers[currentQuestion.id] === key
                  ? "bg-zinc-900 border-zinc-900 text-white shadow-md"
                  : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
              )}
            >
              <span className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full border mr-4 text-sm font-medium transition-colors",
                answers[currentQuestion.id] === key
                  ? "bg-white/20 border-white/20 text-white"
                  : "bg-zinc-50 border-zinc-200 text-zinc-500 group-hover:border-zinc-300"
              )}>
                {key.toUpperCase()}
              </span>
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-zinc-100">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-600/20"
            >
              Submit Test
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              className="flex items-center gap-2 px-8 py-3 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-900/20"
            >
              Next Question
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Question Navigator */}
      <div className="mt-8 flex flex-wrap gap-2 justify-center">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestionIndex(idx)}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all",
              currentQuestionIndex === idx
                ? "ring-2 ring-zinc-900 ring-offset-2 bg-zinc-900 text-white"
                : answers[q.id] !== undefined
                ? "bg-zinc-200 text-zinc-700"
                : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
            )}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

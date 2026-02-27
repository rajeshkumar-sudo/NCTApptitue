import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, ArrowRight } from 'lucide-react';
import { UserData } from '../types';
import { cn } from '../utils';

interface RegistrationFormProps {
  onRegister: (data: UserData) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.phone) {
      onRegister(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 bg-white rounded-3xl shadow-sm border border-black/5"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Get Started</h2>
        <p className="text-zinc-500 mt-2">Enter your details to begin the aptitude assessment.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              required
              type="text"
              placeholder="John Doe"
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              required
              type="email"
              placeholder="john@example.com"
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 ml-1">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              required
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full group relative flex items-center justify-center gap-2 py-4 bg-zinc-900 text-white rounded-2xl font-medium hover:bg-zinc-800 transition-all active:scale-[0.98]"
        >
          Begin Assessment
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </motion.div>
  );
};

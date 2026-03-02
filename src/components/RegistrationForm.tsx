import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, ArrowRight, Hash } from 'lucide-react';
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
    rollNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Name validation: Letters and spaces only
    if (!/^[a-zA-Z\s]*$/.test(formData.name)) {
      newErrors.name = 'Full Name should contain only letters';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Please enter a valid name';
    }

    // Phone validation: Exactly 10 digits
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    // Email validation (basic)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Roll Number validation: Just check if empty
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
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
              className={cn(
                "w-full pl-11 pr-4 py-3 bg-zinc-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all",
                errors.name ? "border-red-300 focus:border-red-500" : "border-zinc-200 focus:border-zinc-900"
              )}
              value={formData.name}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(val)) {
                  setFormData({ ...formData, name: val });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }
              }}
            />
          </div>
          {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 ml-1">Student Roll Number</label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              required
              type="text"
              placeholder="ROLL-2026-001"
              className={cn(
                "w-full pl-11 pr-4 py-3 bg-zinc-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all",
                errors.rollNumber ? "border-red-300 focus:border-red-500" : "border-zinc-200 focus:border-zinc-900"
              )}
              value={formData.rollNumber}
              onChange={(e) => {
                setFormData({ ...formData, rollNumber: e.target.value });
                if (errors.rollNumber) setErrors({ ...errors, rollNumber: '' });
              }}
            />
          </div>
          {errors.rollNumber && <p className="text-xs text-red-500 ml-1">{errors.rollNumber}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              required
              type="email"
              placeholder="john@example.com"
              className={cn(
                "w-full pl-11 pr-4 py-3 bg-zinc-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all",
                errors.email ? "border-red-300 focus:border-red-500" : "border-zinc-200 focus:border-zinc-900"
              )}
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 ml-1">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              required
              type="tel"
              maxLength={10}
              placeholder="10-digit mobile number"
              className={cn(
                "w-full pl-11 pr-4 py-3 bg-zinc-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all",
                errors.phone ? "border-red-300 focus:border-red-500" : "border-zinc-200 focus:border-zinc-900"
              )}
              value={formData.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 10) {
                  setFormData({ ...formData, phone: val });
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }
              }}
            />
          </div>
          {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone}</p>}
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

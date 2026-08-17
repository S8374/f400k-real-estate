'use client';

import { Lock, Eye, EyeClosed, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header */}
      <div className="mb-10 text-center w-full">
        <h2 className="text-3xl font-bold text-white tracking-tight">Reset Password</h2>
        <p className="text-sm text-zinc-400 mt-2">
          Create a new password for your account.
        </p>
      </div>

      <form className="space-y-6 w-full">
        {/* New Password */}
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-1.5 ml-1">New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-zinc-500" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="block w-full pl-10 pr-12 py-3 bg-zinc-800/60 border border-zinc-700/50 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5e8b7e] transition-all text-sm"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-1.5 ml-1">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-zinc-500" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="block w-full pl-10 pr-12 py-3 bg-zinc-800/60 border border-zinc-700/50 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5e8b7e] transition-all text-sm"
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#5e8b7e] hover:bg-[#4a7266] text-white font-semibold py-3.5 px-4 rounded transition-all text-sm flex items-center justify-center gap-2 mt-4"
        >
          Update Password <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

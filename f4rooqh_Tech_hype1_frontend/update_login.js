const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'components', 'auth', 'LoginForm.tsx');
let content = `
'use client';

import { Mail, Lock, Eye, EyeClosed, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '@/redux/api/authApi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const res = await login(data).unwrap();
      if (res.success) {
        toast.success(res.message || 'Login successful!');
        router.push('/');
        router.refresh();
      } else {
        toast.error(res.message || 'Login failed');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header */}
      <div className="mb-10 text-center w-full">
        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back</h2>
        <p className="text-sm text-zinc-400 mt-2">
          Enter your credentials to access the dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
        {/* Email */}
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-1.5 ml-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-zinc-500" />
            </div>
            <input
              type="email"
              {...register('email', { required: true })}
              placeholder="example@gmail.com"
              className="block w-full pl-10 pr-4 py-3 bg-zinc-800/60 border border-zinc-700/50 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5e8b7e] transition-all text-sm"
            />
          </div>
          {errors.email && <span className="text-red-500 text-xs ml-1 mt-1">Email is required</span>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5 ml-1">
            <label className="block text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Password</label>
            <Link href="/forgot-password" className="text-[10px] font-semibold text-[#5e8b7e] hover:text-[#4a7266] transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-zinc-500" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              {...register('password', { required: true })}
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
          {errors.password && <span className="text-red-500 text-xs ml-1 mt-1">Password is required</span>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#5e8b7e] hover:bg-[#4a7266] text-white font-semibold py-3.5 px-4 rounded transition-all text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign in'} <ArrowRight className="w-4 h-4" />
        </button>

        {/* Switch to Signup */}
        <div className="text-center mt-6">
          <span className="text-sm text-zinc-400">No Account? </span>
          <Link href="/signup" className="text-sm font-semibold text-[#5e8b7e] hover:text-[#4a7266] transition-colors">
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
}
`;

fs.writeFileSync(targetFile, content);
console.log('LoginForm updated');

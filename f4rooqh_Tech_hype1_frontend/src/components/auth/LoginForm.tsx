
'use client';

import { Mail, Lock, Eye, EyeClosed, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginMutation, useLogoutMutation } from '@/redux/api/authApi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [logout] = useLogoutMutation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const res = await login(data).unwrap();
      if (res.success) {
        if (res.data?.status === 'BANNED' || res.data?.user?.status === 'BANNED' || res.user?.status === 'BANNED') {
          toast.error('Your account has been banned.');
          await logout({}).unwrap();
          return;
        }
        toast.success(res.message || 'Login successful!');
        const channel = new BroadcastChannel('auth_channel');
        channel.postMessage('auth_sync');
        channel.close();
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
          <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 ml-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-zinc-500" />
            </div>
            <input
              type="email"
              {...register('email', { required: true })}
              placeholder="example@gmail.com"
              className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-zinc-700/50 bg-zinc-800/60 text-white focus:ring-2 focus:ring-[#5e8b7e] focus:border-[#5e8b7e] transition-all shadow-sm placeholder:text-zinc-500 outline-none text-sm font-medium"
            />
          </div>
          {errors.email && <span className="text-red-500 text-xs ml-1 mt-1">Email is required</span>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5 ml-1">
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Password</label>
            <Link href="/forgot-password" className="text-xs font-semibold text-[#5e8b7e] hover:text-[#4a7266] transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-zinc-500" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              {...register('password', { required: true })}
              placeholder="••••••••••••"
              className="w-full pl-12 pr-12 py-3.5 rounded-lg border border-zinc-700/50 bg-zinc-800/60 text-white focus:ring-2 focus:ring-[#5e8b7e] focus:border-[#5e8b7e] transition-all shadow-sm placeholder:text-zinc-500 outline-none text-sm font-medium"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <Eye className="h-5 w-5" /> : <EyeClosed className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <span className="text-red-500 text-xs ml-1 mt-1">Password is required</span>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 flex justify-center items-center py-4 px-4 border border-transparent rounded-sm shadow-md text-sm font-bold text-white bg-[#5e8b7e] hover:bg-[#4a7266] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5e8b7e] disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            <span className="flex items-center">
              Sign in
              <ArrowRight className="ml-2 w-4 h-4" />
            </span>
          )}
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

'use client';

import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useForgotPasswordMutation } from '@/redux/api/authApi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function ForgotPasswordForm() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = async (data: any) => {
    if (!data.email) {
      toast.error('Please enter your email');
      return;
    }
    try {
      const res = await forgotPassword({ email: data.email }).unwrap();
      if (res.success || res.message) {
        toast.success('Verification code sent to your email.');
        router.push(`/forgot-otp-verify?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(res.message || 'Failed to send verification code');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to send verification code');
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-10 text-center w-full">
        <h2 className="text-3xl font-bold text-white tracking-tight">Forgot Password</h2>
        <p className="text-sm text-zinc-400 mt-2">
          Enter your email and we'll send you a verification code to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
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
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#5e8b7e] hover:bg-[#4a7266] text-white font-semibold py-3.5 px-4 rounded transition-all text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
          ) : (
            <>Send Verification Code <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-zinc-400">
        Remember your password?{' '}
        <Link href="/login" className="text-[#5e8b7e] hover:text-[#4a7266] font-semibold transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  );
}

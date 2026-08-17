'use client';

import { useState, useRef, FormEvent, Suspense } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVerifyOtpMutation, useResendOtpMutation } from '@/redux/api/authApi';
import { toast } from 'sonner';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      // Focus last filled input
      const nextIndex = Math.min(index + pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email not found in URL. Please go back to signup.');
      return;
    }
    
    const code = otp.join('');
    if (code.length < 6) {
      toast.error('Please enter the full 6-digit code');
      return;
    }

    try {
      const res = await verifyOtp({ email, otp: code }).unwrap();
      if (res.success || res.message === 'OTP verified successfully' || res.data) {
        toast.success('Email verified successfully! Please sign in.');
        router.push('/login');
      } else {
        toast.error(res.message || 'Invalid verification code');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to verify code');
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Email not found in URL.');
      return;
    }
    try {
      const res = await resendOtp({ email }).unwrap();
      if (res.success || res.message) {
        toast.success('Verification code resent successfully!');
      } else {
        toast.error(res.message || 'Failed to resend code');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to resend code');
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-10 text-center w-full">
        <h2 className="text-3xl font-bold text-white tracking-tight">Verify Email</h2>
        <p className="text-sm text-zinc-400 mt-2">
          We've sent a 6-digit verification code to <span className="text-white font-medium">{email || 'your email'}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-1.5 ml-1 text-center">Verification Code</label>
          <div className="flex justify-center gap-2 sm:gap-3 mt-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={6}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold bg-zinc-800/60 border border-zinc-700/50 rounded text-white focus:outline-none focus:ring-1 focus:ring-[#5e8b7e] transition-all"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isVerifying}
          className="w-full bg-[#5e8b7e] hover:bg-[#4a7266] text-white font-semibold py-3.5 px-4 rounded transition-all text-sm flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isVerifying ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
          ) : (
            <>Verify Code <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-zinc-400">
        Didn't receive the code?{' '}
        <button 
          type="button" 
          onClick={handleResend}
          disabled={isResending}
          className="text-[#5e8b7e] hover:text-[#4a7266] font-semibold transition-colors disabled:opacity-50"
        >
          {isResending ? 'Resending...' : 'Resend'}
        </button>
      </div>
    </div>
  );
}

export function VerifyOtpForm() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#5e8b7e]" /></div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}

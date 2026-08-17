'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from './logo.png';
import { useAdminLoginMutation } from '@/redux/api/authApi';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [adminLogin] = useAdminLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const res = await adminLogin({ email, password }).unwrap();
      
      const token = res.data?.accessToken || res.accessToken;

      if (token) {
        const channel = new BroadcastChannel('auth_channel');
        channel.postMessage('auth_sync');
        channel.close();
      }

      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full font-sans overflow-hidden">
      {/* Full Screen Background Video / Image */}
      <div 
        className="absolute inset-0 z-0 bg-gray-900 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)' }}
      >
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 flex min-h-screen">
        
        {/* Left Side (Text overlays) */}
        <div className="hidden lg:flex flex-1 flex-col justify-between p-12">
           <div></div>
           <div className="mb-12 max-w-2xl">
             <h1 className="text-[4rem] leading-[1.1] font-extrabold text-white mb-6 drop-shadow-xl">
               Orchestrate your <br/> 
               <span className="text-[#84a99d]">real estate empire.</span>
             </h1>
             <p className="text-white/90 text-xl font-medium drop-shadow-md leading-relaxed">
               Access the command center to manage properties, monitor market analytics, and scale your portfolio effortlessly.
             </p>
           </div>
           <div className="text-white/80 text-sm font-medium drop-shadow">
             &copy; 2026 Farook Properties Inc.
           </div>
        </div>

        {/* Right Side: Dark Login Panel */}
        <div className="w-full lg:w-[500px] bg-[#0b0d12] flex flex-col justify-center px-8 sm:px-14 py-12 shadow-[-10px_0_40px_rgba(0,0,0,0.5)] relative z-20">
          
          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <a href={process.env.NEXT_PUBLIC_MAIN_FRONTEND_LINK || "http://localhost:3000"} className="hover:opacity-80 transition-opacity">
              <Image 
                src={logo} 
                alt="Farook Logo" 
                className="h-16 w-auto object-contain drop-shadow-sm cursor-pointer" 
                priority
              />
            </a>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Welcome back</h2>
            <p className="text-zinc-400 text-sm text-center">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {errorMsg && (
              <div className="p-3 rounded bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                {errorMsg}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-zinc-700/50 bg-zinc-800/60 text-white focus:ring-2 focus:ring-[#5e8b7e] focus:border-[#5e8b7e] transition-all shadow-sm placeholder:text-zinc-500 outline-none text-sm font-medium"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-[#5e8b7e] hover:text-[#4a7266] transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-zinc-700/50 bg-zinc-800/60 text-white focus:ring-2 focus:ring-[#5e8b7e] focus:border-[#5e8b7e] transition-all shadow-sm placeholder:text-zinc-500 outline-none text-sm font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

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
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

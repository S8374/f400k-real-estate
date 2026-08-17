import Image from 'next/image';
import { ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0b0d12] font-sans w-full overflow-hidden">
      
      {/* Left Side: Hero Image & Branding (Hidden on mobile) */}
      <div className="relative hidden lg:flex flex-col justify-between flex-1 h-screen p-12 bg-[#0b0d12]">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0b0d12]">
          <iframe
            src="https://www.youtube.com/embed/xEIUojnetsc?autoplay=1&mute=1&loop=1&playlist=xEIUojnetsc&controls=0&showinfo=0&autohide=1&modestbranding=1"
            className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] min-w-full min-h-full max-w-none -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />
          {/* Centered Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/30 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12]/95 via-[#0b0d12]/20 to-transparent z-10" />
        </div>

        {/* Content (Z-10 to stay above background) */}
        <div className="relative z-20 flex-1 flex flex-col justify-center items-center text-center px-8">
          <div className="max-w-3xl flex flex-col items-center">
            {/* Logo */}
            <Link href="/" className="relative w-56 h-28 md:w-64 md:h-32 mb-8 block hover:opacity-80 transition-opacity">
              <Image
                src="/logo/logo.png"
                alt="SakRuya Logo"
                fill
                className="object-contain drop-shadow-md cursor-pointer"
                priority
              />
            </Link>
            
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <p className="text-green-400 font-semibold text-xs uppercase tracking-[0.25em]">
                Premium Real Estate
              </p>
            </div>

            <h1 className="text-5xl xl:text-[64px] font-serif font-medium text-white leading-tight tracking-wide drop-shadow-lg">
              The Future of Saudi <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 font-bold italic">
                Investment
              </span>{" "}
              Starts Here
            </h1>
            
            <p className="text-zinc-200 mt-8 max-w-2xl text-xl leading-relaxed font-light drop-shadow">
              Access exclusive <span className="font-medium text-white">Vision 2030</span> mega-projects through a trusted, REGA-verified platform built for discerning investors and licensed professionals.
            </p>
            
            {/* Badges */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 w-full">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3.5 rounded border border-white/20 shadow-xl">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-white font-medium text-sm tracking-wide">256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3.5 rounded border border-white/20 shadow-xl">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-white font-medium text-sm tracking-wide">REGA Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="relative z-20 flex items-center justify-between text-sm text-white/50 mt-auto w-full px-8">
          <p>© {new Date().getFullYear()} Real Estate Investment Platform Inc.</p>
          <div className="flex gap-6">
            <Link href="/terms-condition" className="hover:text-white transition-colors">Terms & Condition</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form Container */}
      <div className="w-full lg:w-[500px] h-screen overflow-y-auto bg-[#0b0d12] shadow-[-10px_0_40px_rgba(0,0,0,0.5)] relative z-20 flex flex-col">
        {/* Back to Home (Desktop) */}
        <div className="hidden lg:flex w-full justify-end p-8 pb-0">
          <Link href="/" className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="flex-1 w-full flex flex-col items-center justify-center p-6 sm:p-12 py-12">
          {/* Mobile Logo (Hidden on Desktop) */}
          <div className="lg:hidden mb-8 w-full flex justify-center">
            <Link href="/" className="relative h-24 w-52 block">
              <Image
                src="/logo/logo.png"
                alt="SakRuya Logo"
                fill
                className="object-contain"
                priority
              />
            </Link>
          </div>

          <div className="w-full max-w-[440px]">
            {children}
          </div>
        </div>
      </div>
      
    </div>
  );
}

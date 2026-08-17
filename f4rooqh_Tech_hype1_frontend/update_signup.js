const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'components', 'auth', 'SignupForm.tsx');
let content = `
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ArrowRight, Building2, Eye, EyeClosed, FileText, Fingerprint, Lock, Mail, User, Globe, Briefcase, ChevronDown, ShieldCheck } from 'lucide-react';
import { useRegisterMutation } from '@/redux/api/authApi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function SignupForm() {
  const [isAgent, setIsAgent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const [registerUser, { isLoading }] = useRegisterMutation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      if (!data.termsAndCondition) {
        toast.error('You must agree to the Terms of Service');
        return;
      }

      const payload: any = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: isAgent ? 'AGENT' : 'BUYER',
        termsAndCondition: data.termsAndCondition === true || data.termsAndCondition === 'on' || data.termsAndCondition === 'true',
      };

      if (isAgent) {
        payload.licenseNumber = data.licenseNumber ? Number(data.licenseNumber) : undefined;
        payload.ragaId = data.ragaId ? Number(data.ragaId) : undefined;
        payload.agencyName = data.agencyName;
      } else {
        payload.nationality = data.nationality;
        payload.investmentField = data.investmentField;
      }

      const res = await registerUser(payload).unwrap();
      if (res.success || res.id) {
        toast.success('Registration successful! Please sign in.');
        router.push('/login');
      } else {
        toast.error(res.message || 'Registration failed');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to register account');
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header */}
      <div className="mb-8 text-center w-full">
        <h2 className="text-3xl font-bold text-white tracking-tight">Create an account</h2>
        <p className="text-sm text-zinc-400 mt-2">
          Join the command center and start scaling your application.
        </p>
      </div>

      {/* Account Type Toggle */}
      <div className="flex bg-zinc-800/60 rounded-md p-1 border border-zinc-700/50 mb-6 w-full">
        <button
          onClick={() => setIsAgent(false)}
          className={\`flex-1 py-2 text-[10px] uppercase font-bold tracking-wider rounded transition-all \${
            !isAgent ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'
          }\`}
          type="button"
        >
          Investor / Buyer
        </button>
        <button
          onClick={() => setIsAgent(true)}
          className={\`flex-1 py-2 text-[10px] uppercase font-bold tracking-wider rounded transition-all \${
            isAgent ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'
          }\`}
          type="button"
        >
          Licensed Agent
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
        {/* Full Name */}
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-1.5 ml-1">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-zinc-500" />
            </div>
            <input
              type="text"
              {...register('fullName', { required: true })}
              placeholder="John Doe"
              className="block w-full pl-10 pr-4 py-3 bg-zinc-800/60 border border-zinc-700/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5e8b7e] transition-all text-sm"
            />
          </div>
        </div>

        {/* Conditional Investor Fields with Smooth Animation */}
        <div 
          className={\`overflow-hidden transition-all duration-300 ease-in-out \${
            !isAgent ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
          }\`}
        >
          <div className="space-y-4 p-4 bg-zinc-900/30 rounded-md">
            {/* Nationality */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-1.5 ml-1">Nationality/Residency</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Globe className="h-4 w-4 text-zinc-500" />
                </div>
                <select 
                  {...register('nationality')}
                  defaultValue=""
                  className="block w-full pl-10 pr-10 py-3 bg-zinc-800/60 border border-zinc-700/50 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#5e8b7e] transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select your Nationality</option>
                  <option value="saudi">Saudi Citizen</option>
                  <option value="resident">Resident</option>
                  <option value="international">International Investor</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-zinc-500" />
                </div>
              </div>
            </div>

            {/* Investment Interest */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-1.5 ml-1">Investment Interest</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 text-zinc-500" />
                </div>
                <select 
                  {...register('investmentField')}
                  defaultValue=""
                  className="block w-full pl-10 pr-10 py-3 bg-zinc-800/60 border border-zinc-700/50 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#5e8b7e] transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select investment type</option>
                  <option value="commercial">Commercial</option>
                  <option value="residential">Residential</option>
                  <option value="mixed">Mixed-Use Projects</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-zinc-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conditional Agent Fields with Smooth Animation */}
        <div 
          className={\`overflow-hidden transition-all duration-300 ease-in-out \${
            isAgent ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          }\`}
        >
          <div className="space-y-4 p-4 bg-zinc-900/30 rounded-md">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-1.5 ml-1">License Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FileText className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  type="number"
                  {...register('licenseNumber')}
                  placeholder="FAL License Number"
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-800/60 border border-zinc-700/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5e8b7e] transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-1.5 ml-1">REGA ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Fingerprint className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  type="number"
                  {...register('ragaId')}
                  placeholder="REGA ID"
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-800/60 border border-zinc-700/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5e8b7e] transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-1.5 ml-1">Agency Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Building2 className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  type="text"
                  {...register('agencyName')}
                  placeholder="Real Estate Firm"
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-800/60 border border-zinc-700/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5e8b7e] transition-all text-sm"
                />
              </div>
            </div>
          </div>
        </div>

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
              placeholder="admin@dromarr.com"
              className="block w-full pl-10 pr-4 py-3 bg-zinc-800/60 border border-zinc-700/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5e8b7e] transition-all text-sm"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-1.5 ml-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-zinc-500" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              {...register('password', { required: true, minLength: 8 })}
              placeholder="Create a password"
              className="block w-full pl-10 pr-12 py-3 bg-zinc-800/60 border border-zinc-700/50 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5e8b7e] transition-all text-sm"
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

        {/* Terms */}
        <div className="pt-2">
          <label className="flex items-start cursor-pointer group">
            <input
              type="checkbox"
              {...register('termsAndCondition', { required: true })}
              className="mt-1 w-4 h-4 rounded-sm text-[#5e8b7e] bg-zinc-800/60 border border-zinc-700/50 focus:ring-[#5e8b7e]"
            />
            <span className="ml-2.5 text-sm text-zinc-400 leading-tight">
              I agree to the <a href="#" className="text-[#5e8b7e] hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-[#5e8b7e] hover:underline font-medium">Privacy Policy</a>
            </span>
          </label>
        </div>

        {/* Security Info Box */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-md p-4 flex gap-3 mt-4">
          <div className="mt-0.5">
            <ShieldCheck className="h-5 w-5 text-[#5e8b7e]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-100 mb-1.5">Your data is protected with:</p>
            <ul className="text-[11px] text-zinc-400 space-y-1 list-disc ml-3.5">
              <li>256-bit SSL Encryption</li>
              <li>REGA Authority Verification</li>
            </ul>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#5e8b7e] hover:bg-[#4a7266] text-white font-semibold py-3.5 px-4 rounded-md transition-all text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : 'Create account'} <ArrowRight className="w-4 h-4" />
        </button>

        {/* Switch to Login */}
        <div className="text-center mt-6">
          <span className="text-sm text-zinc-400">Already have an account? </span>
          <Link href="/login" className="text-sm font-semibold text-[#5e8b7e] hover:text-[#4a7266] transition-colors">
            Sign in here
          </Link>
        </div>
      </form>
    </div>
  );
}
`;

fs.writeFileSync(targetFile, content);
console.log('SignupForm updated');

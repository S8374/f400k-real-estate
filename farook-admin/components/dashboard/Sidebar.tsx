'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  FileText, 
  Banknote, 
  IdCard, 
  Building2, 
  Map,
  LogOut,
  Mail
} from 'lucide-react';
import { useLogoutMutation } from '@/redux/api/authApi';
import logo from '@/app/logo.png'; 

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'User Management', href: '/dashboard/user-management', icon: Users },
  { name: 'Agent Verification', href: '/dashboard/agent-verification', icon: ShieldCheck },
  { name: 'Property Verification', href: '/dashboard/property-verification', icon: FileText },
  { name: 'Verify Payment', href: '/dashboard/verify-payment', icon: Banknote },
  { name: 'KYC Verification', href: '/dashboard/kyc-verification', icon: IdCard },
  { name: 'Developers', href: '/dashboard/developers', icon: Building2 },
  { name: 'Zone Management', href: '/dashboard/zones', icon: Map },
  { name: 'Subscribers', href: '/dashboard/subscribers', icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      const channel = new BroadcastChannel('auth_channel');
      channel.postMessage('auth_sync');
      channel.close();
      router.push('/');
    } catch (error) {
      console.error('Failed to logout', error);
      const channel = new BroadcastChannel('auth_channel');
      channel.postMessage('auth_sync');
      channel.close();
      router.push('/');
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#1A1A1A] rounded shadow-lg overflow-hidden transition-all duration-300 border border-white/5">
      {/* Logo Container */}
      <div className="flex h-24 shrink-0 items-center justify-center px-6 pt-4 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
          <Image src={logo} alt="Farook Logo" className="h-12 w-auto object-contain" priority />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2 px-6 py-6 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === item.href
              : pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 rounded px-4 py-3 text-sm font-medium transition-all duration-300 ease-out ${
                isActive
                  ? 'bg-[#00B37E]/10 text-[#00B37E]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-colors duration-300 ${
                  isActive ? 'text-[#00B37E]' : 'text-gray-500 group-hover:text-white'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 border-t border-gray-900">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded px-4 py-3 text-sm font-medium text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-all duration-300 ease-out"
        >
          <LogOut className="h-5 w-5 shrink-0 text-gray-500 group-hover:text-red-400 transition-colors duration-300" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );
}

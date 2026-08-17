'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { X } from 'lucide-react';
import { Toaster } from 'sonner';
import { useAppDispatch } from '@/redux/hooks';
import { baseApi } from '@/redux/baseApi';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const channel = new BroadcastChannel('auth_channel');
    channel.onmessage = (event) => {
      if (event.data === 'auth_sync') {
        dispatch(baseApi.util.invalidateTags(['User', 'users', 'Agent']));
        router.refresh();
      }
    };
    return () => channel.close();
  }, [dispatch, router]);

  return (
    <div className="h-screen w-full bg-[#111111] flex overflow-hidden p-4 sm:p-6 lg:p-8 gap-6 font-sans text-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity lg:hidden rounded"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-y-4 left-4 z-50 w-[280px] transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'
        }`}
      >
        <div className="absolute -right-14 top-4">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded bg-[#1A1A1A] shadow-lg text-gray-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-[280px] shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden rounded bg-[#141414] shadow-2xl border border-white/5">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-6">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

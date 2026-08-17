'use client';

import { Menu, Search, Bell } from 'lucide-react';
import { useGetMeQuery } from '@/redux/api/authApi';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ setSidebarOpen }: HeaderProps) {
  const { data: userData } = useGetMeQuery({});
  const currentUser = userData?.data?.data || userData?.data;

  return (
    <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-white/5 bg-[#141414]/90 px-4 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8 transition-all duration-300">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-400 lg:hidden hover:text-[#00B37E] rounded transition-colors"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-white/10 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-white placeholder:text-gray-500 focus:ring-0 sm:text-sm bg-transparent outline-none"
            placeholder="Search properties, users, or settings..."
            type="search"
            name="search"
          />
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-[#00B37E] transition-colors rounded">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/10" aria-hidden="true" />

          {/* Profile dropdown Placeholder */}
          <div className="flex items-center gap-x-4 px-2 py-1.5 rounded hover:bg-white/5 transition-colors cursor-pointer">
            <div className="h-9 w-9 rounded bg-[#00B37E]/20 flex items-center justify-center text-[#00B37E] font-bold text-sm border border-[#00B37E]/20">
              {currentUser?.fullName?.[0]?.toUpperCase() || 'A'}
            </div>
            <span className="hidden lg:flex lg:items-center">
              <span className="text-sm font-semibold leading-6 text-gray-300" aria-hidden="true">
                {currentUser?.fullName || 'Admin User'}
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

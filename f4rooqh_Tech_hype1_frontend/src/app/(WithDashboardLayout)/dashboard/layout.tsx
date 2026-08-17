"use client";
import { ReactNode, useRef, useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  User,
  IdCard,
  ShieldCheck,
  Heart,
  Banknote,
  MessageSquare,
  FileText,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "sonner";
import Image from "next/image";
import UserProfileDropdown from "@/components/shared/UserProfileDropdown";
import { useGetMeQuery } from "@/redux/api/authApi";
import DashboardLayoutSkeleton from "@/components/modules/Skeleton/DashboardLayoutSkeleton";
import PrivateRoute from "@/routes/PrivateRoute";
import { useAppDispatch } from "@/redux/hooks";
import { baseApi } from "@/redux/api/baseApi";
// changed
const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  const { data: userData, isLoading } = useGetMeQuery({});
  const user = userData?.data?.data || userData?.data;

  useEffect(() => {
    const channel = new BroadcastChannel('auth_channel');
    channel.onmessage = (event) => {
      if (event.data === 'auth_sync') {
        dispatch(baseApi.util.invalidateTags(['users']));
        router.refresh();
      }
    };
    return () => channel.close();
  }, [dispatch, router]);

  /* ---------------- Logout ---------------- */
  const handleLogout = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Log out!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("accessToken");
        const channel = new BroadcastChannel('auth_channel');
        channel.postMessage('auth_sync');
        channel.close();
        router.push("/login");
        toast.success("Logged out successfully");
      }
    });
  };

  /* ---------------- Menu Items ---------------- */
  const menuItems =
    user?.role === "AGENT"
      ? [
        { icon: Home, text: "Dashboard", path: "/dashboard" },
        {
          icon: FileText,
          text: "My Properties",
          path: "/dashboard/my-properties",
        },
        { icon: MessageSquare, text: "Messages", path: "/dashboard/message" },
        {
          icon: User,
          text: "Profile & Settings",
          path: "/dashboard/profile-settings",
        },
        { icon: Banknote, text: "Payments", path: "/dashboard/payments" },
      ]
      : [
        {
          icon: User,
          text: "Profile & Settings",
          path: "/dashboard/profile-settings",
        },
        { icon: MessageSquare, text: "Messages", path: "/dashboard/message" },
        { icon: Heart, text: "Save", path: "/dashboard/save" },
        { icon: Banknote, text: "Payments", path: "/dashboard/payments" },
      ];

  /* ---------------- Sidebar Width ---------------- */
  const sidebarWidth = collapsed ? "w-20" : "w-64";
  const contentPadding = collapsed ? "lg:pl-20" : "lg:pl-64";
  const headerLeft = collapsed ? "lg:left-20" : "lg:left-64";
  if (isLoading) {
    return <DashboardLayoutSkeleton />;
  }
  return (
    <PrivateRoute>
      <div className="h-screen w-full bg-[#111111] flex overflow-hidden p-2 sm:p-4 lg:p-6 gap-4 lg:gap-6 font-sans text-white relative">
        {/* ================= Mobile Overlay ================= */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity lg:hidden rounded"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ================= Sidebar (Mobile & Desktop) ================= */}
        <aside
          className={`fixed inset-y-4 left-4 z-50 flex flex-col bg-[#1A1A1A] rounded shadow-lg overflow-hidden border border-white/5
          transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${sidebarWidth}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-[120%]"}
          lg:relative lg:inset-0 lg:translate-x-0 h-auto lg:h-full lg:shrink-0`}
        >
          {/* Mobile Close Button (floating right) */}
          <div className="absolute -right-14 top-4 lg:hidden">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded bg-[#1A1A1A] shadow-lg text-gray-400 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Header/Logo */}
          <div className="flex h-24 shrink-0 items-center justify-center px-6 pt-4 border-b border-white/5 relative">
            <Link
              href="/"
              className="flex items-center justify-center w-full h-full hover:opacity-80 transition-opacity"
            >
              <div className={`relative flex items-center justify-center transition-all duration-300 ${collapsed ? "w-[40px] h-[40px]" : "w-[240px] h-[90px]"}`}>
                <Image 
                  src="/logo/logo.png" 
                  alt="logo" 
                  fill
                  className="object-contain scale-125"
                  priority
                />
              </div>
            </Link>

            {/* Collapse Button */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center z-10 hidden lg:flex">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 transition shadow-md z-10"
              >
                {collapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {menuItems.map((item, index) => {
              const isActive =
                item.path === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.path);

              return (
                <Link
                  key={index}
                  href={item.path}
                  className={`group flex items-center ${collapsed ? "justify-center" : "gap-3 px-4"} py-3 rounded transition-all duration-300 ease-out text-sm font-medium whitespace-nowrap
                  ${isActive
                      ? "bg-[#00B37E]/10 text-[#00B37E]"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <item.icon className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isActive ? "text-[#00B37E]" : "text-gray-500 group-hover:text-white"}`} />
                  {!collapsed && <span className="truncate">{item.text}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* ================= Main Content Area ================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden rounded bg-[#141414] shadow-2xl border border-white/5 relative">
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center justify-between gap-x-4 border-b border-white/5 bg-[#141414]/90 px-4 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8 transition-all duration-300">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded text-gray-400 hover:text-[#00B37E] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Right Side */}
            <div className="ml-auto flex items-center gap-x-4 lg:gap-x-6">
              {!user ? (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    className="border border-red-500 text-red-400 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-500 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div ref={dropdownRef} className="flex items-center gap-x-4 px-2 py-1.5 rounded hover:bg-white/5 transition-colors cursor-pointer">
                  <UserProfileDropdown user={user} />
                </div>
              )}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto overflow-x-auto pt-6">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-12 min-h-screen min-w-[768px] lg:min-w-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default DashboardLayout;
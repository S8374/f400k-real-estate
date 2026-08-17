"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { MdKeyboardArrowDown } from "react-icons/md";
import { toast } from "sonner";
import { useLogoutMutation } from "@/redux/api/authApi";
import { useSocket } from "@/provider/SocketProvider";

interface UserProfileDropdownProps {
  user: any;
  className?: string;
}

export default function UserProfileDropdown({
  user,
  className,
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const { socket } = useSocket();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      // Emit quick logout to socket server
      if (socket) {
        socket.emit("logout");
      }

      const res = await logout({}).unwrap();
      if (res.success) {
        toast.success(res.message);
        setIsOpen(false);
        router.refresh();
        router.push("/login");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group flex items-center gap-2.5 pr-3 pl-1.5 py-1.5 rounded shadow-sm",
          "bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-all duration-300",
          "cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500/50",
          isOpen && "bg-zinc-800 border-white/10 shadow-md ring-1 ring-emerald-500/20"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative flex items-center justify-center">
          <Avatar
            size={32}
            icon={<UserOutlined />}
            className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-inner flex items-center justify-center rounded"
          />
          {/* Online status dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-zinc-900 rounded-full" />
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
            {user?.fullName?.split(" ")[0] || "User"}
          </span>
          <MdKeyboardArrowDown
            className={cn(
              "w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-300",
              isOpen && "rotate-180 text-emerald-400"
            )}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute right-0 mt-2 w-56",
              "bg-zinc-900",
              "border border-white/10 rounded shadow-xl",
              "overflow-hidden z-50 ring-1 ring-black/5"
            )}
          >
            {/* User Info Header */}
            <div className="px-4 py-3 bg-zinc-800/50 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-base flex items-center justify-center rounded"
                />
                <div className="overflow-hidden">
                  <h4 className="font-semibold text-sm text-white truncate">
                    {user?.fullName || "Unnamed User"}
                  </h4>
                  <p className="text-[10px] font-medium text-emerald-400 mt-0.5 truncate">
                    {user?.role || "USER"}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-1.5">
              {user?.role !== "ADMIN" && (
                <button
                  onClick={() => {
                    user?.role === "AGENT" ? router.push("/dashboard") : router.push("/dashboard/profile-settings");
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded",
                    "text-sm text-zinc-300 hover:text-white hover:bg-zinc-800",
                    "transition-colors duration-200 cursor-pointer"
                  )}
                >
                  <DashboardOutlined className="w-4 h-4 text-zinc-400" />
                  <span className="font-medium">Dashboard</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                aria-busy={isLoggingOut}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded mt-0.5",
                  "text-sm text-zinc-300 hover:text-red-400 hover:bg-red-500/10",
                  "transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                <LogoutOutlined className="w-4 h-4 text-zinc-400" />
                <span className="font-medium">
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

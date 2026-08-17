const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'components', 'shared', 'UserProfileDropdown.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

// Replace the return block to redesign the UI
const newReturn = `  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group flex items-center gap-3 pr-4 pl-1.5 py-1.5 rounded-full shadow-sm",
          "bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-all duration-300",
          "cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500/50",
          isOpen && "bg-zinc-800 border-white/10 shadow-md ring-1 ring-emerald-500/20"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative flex items-center justify-center">
          <Avatar
            size={36}
            icon={<UserOutlined />}
            className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-inner flex items-center justify-center"
          />
          {/* Online status dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-900 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
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
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute right-0 mt-3 w-72 sm:w-80",
              "bg-zinc-900/98 backdrop-blur-2xl",
              "border border-white/10 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)]",
              "overflow-hidden z-50 ring-1 ring-black/5"
            )}
          >
            {/* User Info Header (Premium Gradient) */}
            <div className="px-5 pt-6 pb-5 bg-gradient-to-b from-emerald-950/20 to-transparent border-b border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <Avatar
                    size={56}
                    icon={<UserOutlined />}
                    className="bg-gradient-to-br from-emerald-500 to-emerald-700 ring-4 ring-zinc-900 shadow-xl text-lg flex items-center justify-center"
                  />
                  <div className="absolute bottom-0 right-0 bg-zinc-900 p-1 rounded-full">
                    <span className="block w-3.5 h-3.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white leading-tight">
                    {user?.fullName || "Unnamed User"}
                  </h4>
                  <p className="text-[10px] font-bold tracking-wider text-emerald-400 mt-1.5 uppercase bg-emerald-950/50 inline-block px-2.5 py-0.5 rounded-full border border-emerald-900/50">
                    {user?.role || "USER"}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={() => {
                  user?.role === "AGENT" || user?.role === "ADMIN" ? router.push("/dashboard") : router.push("/dashboard/profile-settings");
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
                  "text-zinc-300 hover:text-white hover:bg-zinc-800/80",
                  "transition-all duration-200 cursor-pointer group"
                )}
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-800/80 flex items-center justify-center border border-white/5 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-colors">
                  <DashboardOutlined className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">Dashboard</span>
              </button>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                aria-busy={isLoggingOut}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl mt-1",
                  "text-zinc-300 hover:text-red-400 hover:bg-red-500/10",
                  "transition-all duration-200 cursor-pointer group disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-800/80 flex items-center justify-center border border-white/5 group-hover:bg-red-500/20 group-hover:border-red-500/30 transition-colors">
                  <LogoutOutlined className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );`;

content = content.replace(/  return \([\s\S]*\}\);\n\}/, newReturn + '\n}');

fs.writeFileSync(targetFile, content);
console.log('UserProfileDropdown updated');

import { useEffect, useRef, useState } from "react";
import {
  FiChevronDown,
  FiCloudRain,
  FiCpu,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiSun,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";
import SearchBox from "./SearchBox.jsx";

function TopNavbar({ theme, onToggleTheme, onOpenSidebar }) {
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = (user?.name || "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-100 bg-slate-50/85 px-4 py-4 backdrop-blur-xl dark:border-emerald-900/40 dark:bg-[#07110d]/85 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-100 bg-white text-slate-600 shadow-sm dark:border-emerald-900/50 dark:bg-slate-900 dark:text-slate-200 lg:hidden"
          >
            <FiMenu />
          </button>

          <SearchBox />
        </div>

        <div className="flex items-center gap-3">
          {/* Universal AI Field Pulse Widget */}
          <div className="hidden items-center gap-3 rounded-2xl border border-emerald-100 bg-white/80 px-4 py-2 shadow-sm backdrop-blur dark:border-emerald-900/50 dark:bg-slate-900/80 md:flex">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
              <FiCpu className="text-lg text-emerald-700 dark:text-emerald-200" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">94% AI Pulse</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                Active
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 rounded-2xl border border-emerald-100 bg-white/80 px-4 py-2 shadow-sm backdrop-blur dark:border-emerald-900/50 dark:bg-slate-900/80 sm:flex">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
              <FiCloudRain />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">31 C</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Light rain likely
              </p>
            </div>
          </div>

          <button
            onClick={onToggleTheme}
            className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-100 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:shadow-lg dark:border-emerald-900/50 dark:bg-slate-900 dark:text-emerald-200"
          >
            {isDark ? <FiSun /> : <FiMoon />}
          </button>

          <NotificationDropdown />

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((current) => !current)}
              className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white/80 px-3 py-2 shadow-sm backdrop-blur hover:-translate-y-0.5 hover:shadow-lg dark:border-emerald-900/50 dark:bg-slate-900/80"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-700 to-teal-500 text-sm font-bold text-white">
                {initials}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.role || "Team Member"}
                </p>
              </div>
              <FiChevronDown
                className={`hidden text-slate-400 sm:block ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl shadow-emerald-950/12 dark:border-emerald-900/50 dark:bg-slate-950"
                role="menu"
              >
                <div className="border-b border-emerald-100 px-4 py-4 dark:border-emerald-900/50">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-700 text-sm font-black text-white">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                        {user?.name || "User"}
                      </p>
                      <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {user?.email || "Signed in"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <FiUser className="text-emerald-700 dark:text-emerald-300" />
                    {user?.region || "Assigned region"}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/30"
                    role="menuitem"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;

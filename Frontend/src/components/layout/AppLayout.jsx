import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import TopNavbar from "./TopNavbar.jsx";

function getStoredBoolean(key, fallback) {
  const stored = localStorage.getItem(key);
  return stored === null ? fallback : stored === "true";
}

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    getStoredBoolean("km-sidebar-collapsed", false),
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("km-theme") || "light",
  );

  useEffect(() => {
    localStorage.setItem("km-sidebar-collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("km-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#07110d] dark:text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.12),transparent_30%)]" />

      <div className="relative flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
        />

        <div className="min-w-0 flex-1">
          <TopNavbar
            theme={theme}
            onToggleTheme={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
            onOpenSidebar={() => setMobileSidebarOpen(true)}
          />
          <main className="px-4 py-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;

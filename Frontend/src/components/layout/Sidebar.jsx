import { NavLink } from "react-router-dom";
import {
  FiActivity,
  FiAlertTriangle,
  FiArchive,
  FiBarChart2,
  FiChevronLeft,
  FiChevronRight,
  FiCpu,
  FiHome,
  FiMap,
  FiSettings,
  FiTruck,
  FiUsers,
  FiX,
} from "react-icons/fi";
import BrandLogo from "./BrandLogo.jsx";

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: FiHome },
  { label: "Analytics", path: "/analytics", icon: FiBarChart2 },
  { label: "Recommendations", path: "/recommendations", icon: FiActivity },
  { label: "Alerts", path: "/alerts", icon: FiAlertTriangle },
  { label: "Field Visits", path: "/field-visits", icon: FiTruck },
  { label: "Farmers", path: "/farmers", icon: FiUsers },
  { label: "Inventory", path: "/inventory", icon: FiArchive },
  { label: "Maps", path: "/maps", icon: FiMap },
  { label: "AI Assistant", path: "/ai-assistant", icon: FiCpu },
  { label: "Settings", path: "/settings", icon: FiSettings },
];

function SidebarContent({ collapsed, onCloseMobile, onToggleCollapse }) {
  return (
    <aside
      className={`relative flex h-full flex-col border-r border-emerald-100 bg-white/90 px-4 py-6 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl dark:border-emerald-900/40 dark:bg-slate-950/88 ${
        collapsed ? "w-24" : "w-72"
      }`}
    >
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        <BrandLogo collapsed={collapsed} />

        <button
          onClick={onCloseMobile}
          className="grid h-10 w-10 place-items-center rounded-2xl border border-emerald-100 bg-white text-slate-600 shadow-sm dark:border-emerald-900/50 dark:bg-slate-900 dark:text-slate-200 lg:hidden"
        >
          <FiX />
        </button>
      </div>

      <button
        onClick={onToggleCollapse}
        className="absolute -right-4 top-24 hidden h-9 w-9 place-items-center rounded-full border border-emerald-100 bg-white text-emerald-700 shadow-lg dark:border-emerald-900/50 dark:bg-slate-900 lg:grid"
      >
        {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </button>

      <nav className="mt-8 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group flex items-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  collapsed ? "justify-center" : "gap-3"
                } ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-lg shadow-emerald-700/25"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-300 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-200"
                }`
              }
            >
              <Icon className="shrink-0 text-lg transition group-hover:scale-110" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="mt-auto pt-6 text-center text-2xs font-semibold text-slate-400 dark:text-slate-500">
          <p>© 2026 KrishiMitra AI v4.8</p>
        </div>
      )}
    </aside>
  );
}

function Sidebar({ collapsed, mobileOpen, onCloseMobile, onToggleCollapse }) {
  return (
    <>
      <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
        <SidebarContent
          collapsed={collapsed}
          onCloseMobile={onCloseMobile}
          onToggleCollapse={onToggleCollapse}
        />
      </div>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onCloseMobile}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          collapsed={false}
          onCloseMobile={onCloseMobile}
          onToggleCollapse={onToggleCollapse}
        />
      </div>
    </>
  );
}

export default Sidebar;

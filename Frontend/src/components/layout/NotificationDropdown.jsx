import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiBell } from "react-icons/fi";
import { notifications } from "../../data/appData.js";

const toneClass = {
  rose: "bg-rose-500",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  lime: "bg-lime-500",
};

function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="relative grid h-12 w-12 place-items-center rounded-2xl border border-emerald-100 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:shadow-lg dark:border-emerald-900/50 dark:bg-slate-900 dark:text-slate-200"
      >
        <FiBell />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-950">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-14 z-40 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl shadow-emerald-950/15 dark:border-emerald-900/60 dark:bg-slate-950"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
              <div>
                <p className="text-sm font-bold text-slate-950 dark:text-white">
                  Notifications
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {unreadCount} unread operational signals
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
                Live
              </span>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-2xl p-3 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                >
                  <div className="flex gap-3">
                    <span
                      className={`mt-1 h-2.5 w-2.5 rounded-full ${
                        toneClass[notification.tone]
                      } ${notification.unread ? "animate-pulse" : ""}`}
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-950 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationDropdown;

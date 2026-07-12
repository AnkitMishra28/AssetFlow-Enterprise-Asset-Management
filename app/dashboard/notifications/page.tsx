"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Bell,
  Sun,
  Moon,
  CheckCheck,
  UserCheck,
  Wrench,
  CalendarClock,
  ArrowRightLeft,
  Clock,
  ShieldAlert,
  BellOff,
} from "lucide-react";
import Sidebar, { LiquidPanel } from "../Sidebar";

type Category = "alerts" | "approvals" | "bookings";
type Filter = "All" | "Alerts" | "Approvals" | "Bookings";

type Tone = "sky" | "emerald" | "rose" | "amber" | "red";

// Full literal class strings so Tailwind's JIT can detect them.
const TONES: Record<Tone, { dot: string; chip: string }> = {
  sky: { dot: "bg-sky-500", chip: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" },
  emerald: { dot: "bg-emerald-500", chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  rose: { dot: "bg-rose-500", chip: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
  amber: { dot: "bg-amber-500", chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  red: { dot: "bg-red-500", chip: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" },
};

interface NotificationItem {
  id: number;
  text: string;
  time: string;
  category: Category;
  tone: Tone;
  icon: React.ElementType;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, text: "Laptop AF-0014 assigned to Priya Shah", time: "2m ago", category: "alerts", tone: "sky", icon: UserCheck, read: false },
  { id: 2, text: "Maintenance request AF-0055 approved", time: "18m ago", category: "approvals", tone: "emerald", icon: Wrench, read: false },
  { id: 3, text: "Booking confirmed : Room B2 : 2:00 to 3:00 PM", time: "1h ago", category: "bookings", tone: "sky", icon: CalendarClock, read: false },
  { id: 4, text: "Transfer approved : AF-0033 to facilities dept", time: "3h ago", category: "approvals", tone: "rose", icon: ArrowRightLeft, read: true },
  { id: 5, text: "Overdue return : AF-0021 was due 3 days ago", time: "1d ago", category: "alerts", tone: "amber", icon: Clock, read: true },
  { id: 6, text: "Audit discrepancy flagged : AF-0088 damaged", time: "2d ago", category: "alerts", tone: "red", icon: ShieldAlert, read: true },
];

const FILTERS: Filter[] = ["All", "Alerts", "Approvals", "Bookings"];

export default function NotificationsScreen() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const counts = useMemo(() => {
    return {
      All: notifications.length,
      Alerts: notifications.filter((n) => n.category === "alerts").length,
      Approvals: notifications.filter((n) => n.category === "approvals").length,
      Bookings: notifications.filter((n) => n.category === "bookings").length,
    } as Record<Filter, number>;
  }, [notifications]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const visible = useMemo(() => {
    if (activeFilter === "All") return notifications;
    return notifications.filter((n) => n.category === activeFilter.toLowerCase());
  }, [activeFilter, notifications]);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const toggleRead = (id: number) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  return (
    <div className="min-h-screen flex bg-[#f0f4f8] dark:bg-[#09090b] text-slate-800 dark:text-zinc-100 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar activeItem="Notifications" />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                <span className="relative">
                  <Bell className="w-6 h-6 text-emerald-500" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#f0f4f8] dark:ring-[#09090b]" />
                  )}
                </span>
                Notifications
              </h1>
              <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
                  : "You're all caught up."}
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="glass-panel p-2.5 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-zinc-800/80 transition-colors"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}
              <button
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="glass-panel px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-zinc-100 hover:bg-black/5 dark:hover:bg-zinc-800/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCheck className="w-4 h-4 text-emerald-500" />
                Mark all as read
              </button>
            </div>
          </header>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : "bg-white/60 dark:bg-zinc-900/50 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-800/60 hover:text-slate-800 dark:hover:text-zinc-200 hover:border-slate-300 dark:hover:border-zinc-700"
                  }`}
                >
                  {filter}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] ${
                      isActive
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                        : "bg-slate-200/70 dark:bg-zinc-800/70 text-slate-500 dark:text-zinc-400"
                    }`}
                  >
                    {counts[filter]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Notification List */}
          <LiquidPanel className="rounded-2xl p-1.5">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 px-6">
                <BellOff className="w-10 h-10 text-slate-300 dark:text-zinc-700 mb-3" />
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">No notifications here</p>
                <p className="text-xs text-slate-400 dark:text-zinc-600 mt-1">Nothing in this category right now.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200/70 dark:divide-zinc-800/50">
                <AnimatePresence initial={false}>
                  {visible.map((n, idx) => {
                    const tone = TONES[n.tone];
                    const Icon = n.icon;
                    return (
                      <motion.button
                        key={n.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, delay: idx * 0.03 }}
                        onClick={() => toggleRead(n.id)}
                        className="w-full text-left flex items-center gap-4 px-4 py-4 first:rounded-t-xl last:rounded-b-xl hover:bg-black/[0.03] dark:hover:bg-zinc-800/30 transition-colors group"
                      >
                        {/* Icon chip */}
                        <div className={`w-9 h-9 shrink-0 rounded-lg border flex items-center justify-center ${tone.chip}`}>
                          <Icon className="w-4 h-4" strokeWidth={2} />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${n.read ? "bg-transparent" : tone.dot}`} />
                          <p
                            className={`text-sm truncate ${
                              n.read
                                ? "text-slate-500 dark:text-zinc-400"
                                : "text-slate-800 dark:text-zinc-100 font-medium"
                            }`}
                          >
                            {n.text}
                          </p>
                        </div>

                        {/* Time */}
                        <span className="text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap ml-2 shrink-0">
                          {n.time}
                        </span>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </LiquidPanel>

          <p className="text-center text-xs text-slate-400 dark:text-zinc-600">
            Tap a notification to toggle read / unread.
          </p>

        </div>
      </main>
    </div>
  );
}

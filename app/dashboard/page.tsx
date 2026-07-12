"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { 
  Plus,
  CalendarPlus,
  AlertCircle,
  Sun,
  Moon,
  Wrench
} from "lucide-react";
import Sidebar, { LiquidPanel } from "./Sidebar";

const METRICS = [
  { label: "Available", value: "128", trend: "+4" },
  { label: "Allocated", value: "76", trend: "+12" },
  { label: "Under Maintenance", value: "4", trend: "-2" },
  { label: "Active Bookings", value: "9", trend: "+3" },
  { label: "Pending Transfers", value: "3", trend: "0" },
  { label: "Upcoming Returns", value: "12", trend: "+1" },
];

const RECENT_ACTIVITY = [
  { id: 1, text: "Laptop AF-0114 - allocated to Priya Shah - IT Dept", time: "10m ago" },
  { id: 2, text: "Room B2 - booking confirmed - 2:00 to 3:00 PM", time: "1h ago" },
  { id: 3, text: "Projector AF-0062 - maintenance resolved", time: "2h ago" },
];

export default function DashboardScreen() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#f0f4f8] dark:bg-[#09090b] text-slate-800 dark:text-zinc-100 transition-colors duration-300">
      
      {/* Sidebar */}
      <Sidebar activeItem="Dashboard" />

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Today&apos;s Overview</h1>
              <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">Here is what&apos;s happening with your assets today.</p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {mounted && (
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="glass-panel p-2 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-zinc-800/80 transition-colors mr-2"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}
              
              <button className="glass-panel px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-black/5 dark:hover:bg-zinc-800/80 transition-colors text-slate-700 dark:text-zinc-100">
                <CalendarPlus className="w-4 h-4 text-slate-400 dark:text-zinc-300" />
                Book Resource
              </button>
              <button className="glass-panel px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-black/5 dark:hover:bg-zinc-800/80 transition-colors text-slate-700 dark:text-zinc-100">
                <Wrench className="w-4 h-4 text-slate-400 dark:text-zinc-300" />
                Raise Request
              </button>
              <button className="glass-button px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 bg-slate-900 text-white dark:bg-emerald-600 border-transparent shadow-lg shadow-black/10">
                <Plus className="w-4 h-4" />
                Register Asset
              </button>
            </div>
          </header>

          {/* Overdue Alerts */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-600 dark:text-red-400">Action Required: Overdue Returns</h3>
              <p className="text-sm text-red-500/90 dark:text-red-400/80 mt-1">3 assets are overdue for return. They have been flagged for follow-up.</p>
            </div>
          </motion.div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {METRICS.map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <LiquidPanel className="p-5 rounded-xl hover:border-slate-300 dark:hover:border-zinc-700/50 transition-colors cursor-default h-full">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{metric.label}</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">{metric.value}</h2>
                      <span className={`text-xs font-medium ${metric.trend.startsWith('+') ? 'text-emerald-500 dark:text-emerald-400' : metric.trend === '0' ? 'text-slate-400 dark:text-zinc-500' : 'text-red-500 dark:text-red-400'}`}>
                        {metric.trend !== '0' ? metric.trend : '-'}
                      </span>
                    </div>
                  </LiquidPanel>
                </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <section>
            <h2 className="text-lg font-medium text-slate-800 dark:text-white mb-4">Recent Activity</h2>
            <LiquidPanel className="rounded-xl p-1">
              <div className="divide-y divide-slate-200 dark:divide-zinc-800/50">
                {RECENT_ACTIVITY.map((activity) => (
                  <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-black/5 dark:hover:bg-zinc-800/30 transition-colors first:rounded-t-lg last:rounded-b-lg">
                    <p className="text-sm text-slate-700 dark:text-zinc-300">{activity.text}</p>
                    <span className="text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap ml-4">{activity.time}</span>
                  </div>
                ))}
              </div>
            </LiquidPanel>
          </section>

        </div>
      </main>
    </div>
  );
}

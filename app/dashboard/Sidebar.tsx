"use client";

import { useEffect, useRef } from "react";
import { 
  LayoutDashboard, 
  Settings, 
  Box, 
  ArrowRightLeft, 
  CalendarClock, 
  Wrench, 
  ShieldCheck, 
  BarChart3, 
  Bell
} from "lucide-react";
import liquidGlass from "@/lib/liquidGlass";

interface LiquidPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Wrapper for elements using liquidGlass to easily compose it
export function LiquidPanel({ children, className, ...props }: LiquidPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    const glass = liquidGlass(ref.current, { 
      scale: -112,
      chroma: 6,
      border: 0.07,
      mapBlur: 12,
      blur: 8,
      saturate: 1.5
    });
    return () => glass.destroy();
  }, []);

  return <div ref={ref} className={`glass-panel bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 ${className || ""}`} {...props}>{children}</div>;
}

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Settings, label: "Organization Setup", href: "/dashboard/organization-setup" },
  { icon: Box, label: "Assets", href: "#" },
  { icon: ArrowRightLeft, label: "Allocation & Transfer", href: "#" },
  { icon: CalendarClock, label: "Resource Booking", href: "#" },
  { icon: Wrench, label: "Maintenance", href: "#" },
  { icon: ShieldCheck, label: "Audit", href: "#" },
  { icon: BarChart3, label: "Reports", href: "#" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
];

interface SidebarProps {
  activeItem: string;
}

export default function Sidebar({ activeItem }: SidebarProps) {
  return (
    <LiquidPanel className="w-64 border-r border-slate-200 dark:border-zinc-800/50 flex flex-col p-6 hidden md:flex !rounded-none !border-y-0 !border-l-0 shrink-0">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Box className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">AssetFlow</span>
      </div>

      <nav className="flex-1 space-y-1">
        {SIDEBAR_ITEMS.map((item, idx) => {
          const isActive = item.label === activeItem;
          return (
            <a
              key={idx}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20" 
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-zinc-800/50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* User profile snippet */}
      <div className="pt-6 border-t border-slate-200 dark:border-zinc-800/50 mt-auto flex items-center gap-3 cursor-pointer">
        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 flex items-center justify-center text-sm font-medium text-slate-700 dark:text-white">
          JD
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">Jane Doe</p>
          <p className="text-xs text-slate-500 dark:text-zinc-500 truncate">Employee</p>
        </div>
      </div>
    </LiquidPanel>
  );
}

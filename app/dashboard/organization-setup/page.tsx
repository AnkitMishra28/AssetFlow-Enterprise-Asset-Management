"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { 
  Plus, 
  Info, 
  Sun, 
  Moon, 
  Building2, 
  Tag, 
  Users, 
  Briefcase 
} from "lucide-react";
import Sidebar, { LiquidPanel } from "../Sidebar";

// Mock data representing the departments
const DEPARTMENTS_DATA = [
  { id: 1, name: "Operations", head: "Marcus Vance", headInitials: "MV", parent: "None", status: "Active" },
  { id: 2, name: "Engineering", head: "Alex Rivera", headInitials: "AR", parent: "Operations", status: "Active" },
  { id: 3, name: "Marketing", head: "Sarah Chen", headInitials: "SC", parent: "Operations", status: "Active" },
  { id: 4, name: "Finance", head: "David Kim", headInitials: "DK", parent: "Operations", status: "Active" },
  { id: 5, name: "Human Resources", head: "Emily Zhao", headInitials: "EZ", parent: "Operations", status: "Inactive" },
];

export default function OrganizationSetupScreen() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"Departments" | "Categories" | "Employee">("Departments");

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#f0f4f8] dark:bg-[#09090b] text-slate-800 dark:text-zinc-100 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar activeItem="Organization Setup" />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-emerald-500" />
                Organization Setup
              </h1>
              <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
                Configure your company structure, asset categories, and corporate directory.
              </p>
            </div>
            
            {/* Quick Actions (Theme toggler) */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {mounted && (
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="glass-panel p-2.5 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-zinc-800/80 transition-colors"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}
            </div>
          </header>

          {/* Controls Bar (Tabs + Add Button) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800/60 pb-4">
            {/* Tabs */}
            <div className="flex bg-slate-200/50 dark:bg-zinc-900/60 p-1 rounded-xl w-fit">
              <button
                onClick={() => setActiveTab("Departments")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "Departments"
                    ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-black/5 dark:border-white/5"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Departments
              </button>
              <button
                onClick={() => setActiveTab("Categories")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "Categories"
                    ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-black/5 dark:border-white/5"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                }`}
              >
                <Tag className="w-4 h-4" />
                Categories
              </button>
              <button
                onClick={() => setActiveTab("Employee")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "Employee"
                    ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-black/5 dark:border-white/5"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                }`}
              >
                <Users className="w-4 h-4" />
                Employee
              </button>
            </div>

            {/* Add Button */}
            <button className="glass-button px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-black/10 self-start sm:self-auto">
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Placeholder Table */}
          <LiquidPanel className="rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-950/20">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      Department
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      Head
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      Parent Dept
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/40">
                  {DEPARTMENTS_DATA.map((dept) => (
                    <tr 
                      key={dept.id} 
                      className="hover:bg-slate-100/30 dark:hover:bg-zinc-800/20 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-zinc-200">
                        {dept.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-zinc-300">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {dept.headInitials}
                          </div>
                          <span>{dept.head}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-zinc-400">
                        {dept.parent === "None" ? (
                          <span className="text-slate-400 dark:text-zinc-600 italic">None</span>
                        ) : (
                          dept.parent
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          dept.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-slate-500/10 text-slate-500 dark:text-zinc-400 border-slate-500/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            dept.status === "Active" ? "bg-emerald-500" : "bg-slate-400 dark:bg-zinc-500"
                          }`} />
                          {dept.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LiquidPanel>

          {/* Informational Callout */}
          <div className="flex items-start sm:items-center gap-3 p-4 bg-blue-50/60 dark:bg-blue-950/10 border border-blue-100/60 dark:border-blue-900/20 rounded-xl text-blue-700 dark:text-blue-300">
            <Info className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0 text-blue-500 dark:text-blue-400" />
            <p className="text-sm font-medium">
              Editing a department here also drives the picklist in Screen 4 & 5.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

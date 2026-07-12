"use client";

import { motion } from "framer-motion";
import { 
  Plus,
  CalendarPlus,
  AlertCircle,
  Wrench,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import Sidebar from "./Sidebar";

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
  return (
    <div className="min-h-screen flex bg-[#ffffff] text-slate-800">
      
      {/* Sidebar */}
      <Sidebar activeItem="Dashboard" />

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-10 overflow-y-auto bg-slate-50/50">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Today's Overview</h1>
              <p className="text-slate-500 text-sm mt-1">Here is what's happening with your assets today.</p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all card-shadow flex items-center gap-2">
                <CalendarPlus className="w-4 h-4 text-slate-400" />
                Book Resource
              </button>
              <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all card-shadow flex items-center gap-2">
                <Wrench className="w-4 h-4 text-slate-400" />
                Raise Request
              </button>
              <button className="bg-odoo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-odoo-700 transition-all shadow-md shadow-odoo-600/20 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Register Asset
              </button>
            </div>
          </header>

          {/* Overdue Alerts */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 card-shadow"
          >
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">Action Required: Overdue Returns</h3>
              <p className="text-sm text-red-600/90 mt-1">3 assets are overdue for return. They have been flagged for follow-up.</p>
            </div>
          </motion.div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {METRICS.map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white border border-slate-200 rounded-2xl p-6 card-shadow hover:card-shadow-lg hover:-translate-y-0.5 transition-all cursor-default"
                >
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{metric.label}</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{metric.value}</h2>
                    <div className={`flex items-center gap-1 text-sm font-medium ${metric.trend.startsWith('+') ? 'text-odoo-600' : metric.trend === '0' ? 'text-slate-400' : 'text-red-600'}`}>
                      {metric.trend !== '0' && (metric.trend.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />)}
                      {metric.trend !== '0' ? metric.trend : '-'}
                    </div>
                  </div>
                </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5 tracking-tight">Recent Activity</h2>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden card-shadow">
              <div className="divide-y divide-slate-100">
                {RECENT_ACTIVITY.map((activity) => (
                  <div key={activity.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-odoo-500"></div>
                      <p className="text-sm font-medium text-slate-700">{activity.text}</p>
                    </div>
                    <span className="text-sm text-slate-400 font-medium whitespace-nowrap ml-4">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

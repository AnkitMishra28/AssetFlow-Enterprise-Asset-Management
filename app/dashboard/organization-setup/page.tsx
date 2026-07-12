"use client";

import { useState } from "react";
import { 
  Plus, 
  Info, 
  Building2, 
  Tag, 
  Users, 
  Briefcase 
} from "lucide-react";
import Sidebar from "../Sidebar";

// Mock data representing the departments
const DEPARTMENTS_DATA = [
  { id: 1, name: "Operations", head: "Marcus Vance", headInitials: "MV", parent: "None", status: "Active" },
  { id: 2, name: "Engineering", head: "Alex Rivera", headInitials: "AR", parent: "Operations", status: "Active" },
  { id: 3, name: "Marketing", head: "Sarah Chen", headInitials: "SC", parent: "Operations", status: "Active" },
  { id: 4, name: "Finance", head: "David Kim", headInitials: "DK", parent: "Operations", status: "Active" },
  { id: 5, name: "Human Resources", head: "Emily Zhao", headInitials: "EZ", parent: "Operations", status: "Inactive" },
];

export default function OrganizationSetupScreen() {
  const [activeTab, setActiveTab] = useState<"Departments" | "Categories" | "Employee">("Departments");

  return (
    <div className="min-h-screen flex bg-[#ffffff] text-slate-800">
      {/* Sidebar */}
      <Sidebar activeItem="Organization Setup" />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto bg-slate-50/50">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                </div>
                Organization Setup
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                Configure your company structure, asset categories, and corporate directory.
              </p>
            </div>
          </header>

          {/* Controls Bar (Tabs + Add Button) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit border border-slate-200">
              <button
                onClick={() => setActiveTab("Departments")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "Departments"
                    ? "bg-white text-emerald-600 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Departments
              </button>
              <button
                onClick={() => setActiveTab("Categories")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "Categories"
                    ? "bg-white text-emerald-600 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                }`}
              >
                <Tag className="w-4 h-4" />
                Categories
              </button>
              <button
                onClick={() => setActiveTab("Employee")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "Employee"
                    ? "bg-white text-emerald-600 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                }`}
              >
                <Users className="w-4 h-4" />
                Employee
              </button>
            </div>

            {/* Add Button */}
            <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 self-start sm:self-auto">
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden card-shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Department
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Head
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Parent Dept
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {DEPARTMENTS_DATA.map((dept) => (
                    <tr 
                      key={dept.id} 
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        {dept.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                            {dept.headInitials}
                          </div>
                          <span className="font-medium">{dept.head}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500">
                        {dept.parent === "None" ? (
                          <span className="text-slate-400 italic">None</span>
                        ) : (
                          dept.parent
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          dept.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            dept.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                          }`} />
                          {dept.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Informational Callout */}
          <div className="flex items-start sm:items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 card-shadow">
            <Info className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0 text-blue-600" />
            <p className="text-sm font-semibold">
              Editing a department here also drives the picklist in Screen 4 & 5.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

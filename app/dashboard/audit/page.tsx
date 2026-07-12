"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Plus, 
  Calendar, 
  MapPin, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  X,
  Lock,
  History,
  Info,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";
import Sidebar from "../Sidebar";

interface HistoryEntry {
  type: "Registration" | "Allocation" | "Maintenance" | "Audit" | "StatusChange";
  date: string;
  details: string;
  actor: string;
}

interface Asset {
  tag: string;
  name: string;
  category: string;
  serialNumber: string;
  acquisitionDate: string;
  acquisitionCost: number;
  condition: "New" | "Good" | "Fair" | "Poor";
  location: string;
  status: "Available" | "Allocated" | "Reserved" | "Under Maintenance" | "Lost" | "Retired" | "Disposed";
  isSharedBookable: boolean;
  history: HistoryEntry[];
  allocatedTo?: string;
  allocatedToDept?: string;
  expectedReturnDate?: string;
}

interface AuditCycle {
  id: string;
  name: string;
  scopeDept: string;
  startDate: string;
  endDate: string;
  auditors: string[];
  status: "Active" | "Closed";
  results: { [assetTag: string]: "Verified" | "Missing" | "Damaged" };
}

const DEFAULT_AUDITS: AuditCycle[] = [
  {
    id: "aud-q2",
    name: "Q2 IT Equipment Audit",
    scopeDept: "Engineering",
    startDate: "2026-04-01",
    endDate: "2026-04-10",
    auditors: ["A. Rao", "S. Iqbal"],
    status: "Closed",
    results: {
      "AF-0012": "Verified",
      "AF-0114": "Verified",
      "AF-0021": "Verified"
    }
  }
];

export default function AuditScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [audits, setAudits] = useState<AuditCycle[]>([]);
  const [activeCycle, setActiveCycle] = useState<AuditCycle | null>(null);
  
  // Create Cycle Modal Form state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [cycleName, setCycleName] = useState("");
  const [cycleDept, setCycleDept] = useState("Engineering");
  const [cycleStart, setCycleStart] = useState("2026-07-01");
  const [cycleEnd, setCycleEnd] = useState("2026-07-15");
  const [cycleAuditors, setCycleAuditors] = useState("A. Rao, S. Iqbal");

  // Load and save localStorage
  useEffect(() => {
    // Assets
    const storedAssets = localStorage.getItem("assetflow_assets");
    if (storedAssets) {
      try {
        setAssets(JSON.parse(storedAssets));
      } catch (e) {}
    }
    
    // Audits
    const storedAudits = localStorage.getItem("assetflow_audits");
    if (storedAudits) {
      try {
        const parsed = JSON.parse(storedAudits) as AuditCycle[];
        setAudits(parsed);
        const active = parsed.find(a => a.status === "Active");
        if (active) setActiveCycle(active);
      } catch (e) {
        setAudits(DEFAULT_AUDITS);
      }
    } else {
      setAudits(DEFAULT_AUDITS);
      localStorage.setItem("assetflow_audits", JSON.stringify(DEFAULT_AUDITS));
    }
  }, []);

  const saveAssets = (updated: Asset[]) => {
    setAssets(updated);
    localStorage.setItem("assetflow_assets", JSON.stringify(updated));
  };

  const saveAudits = (updated: AuditCycle[]) => {
    setAudits(updated);
    localStorage.setItem("assetflow_audits", JSON.stringify(updated));
  };

  // Get scoped assets for the active audit
  const scopedAssets = useMemo(() => {
    if (!activeCycle) return [];
    
    // Filter assets by the selected department (allocated assets or location matches)
    return assets.filter(asset => {
      if (activeCycle.scopeDept === "All") return true;
      
      // Matches the allocation department OR matches location hint
      const matchAllocDept = asset.allocatedToDept === activeCycle.scopeDept;
      const matchLocHint = asset.location.toLowerCase().includes(activeCycle.scopeDept.toLowerCase());
      
      // Also match generic items if "Engineering" (match laptops etc.)
      const isElecEngineering = activeCycle.scopeDept === "Engineering" && asset.category === "Electronics";
      
      return matchAllocDept || matchLocHint || isElecEngineering;
    });
  }, [assets, activeCycle]);

  // Handle Mark Asset status in active audit
  const handleMarkAsset = (tag: string, status: "Verified" | "Missing" | "Damaged") => {
    if (!activeCycle) return;

    const updatedCycle: AuditCycle = {
      ...activeCycle,
      results: {
        ...activeCycle.results,
        [tag]: status
      }
    };

    setActiveCycle(updatedCycle);
    
    // Update audits list
    const updatedAudits = audits.map(a => a.id === activeCycle.id ? updatedCycle : a);
    saveAudits(updatedAudits);
  };

  // Initialize a new audit cycle
  const handleCreateCycle = (e: React.FormEvent) => {
    e.preventDefault();

    const newCycle: AuditCycle = {
      id: `aud-${Date.now()}`,
      name: cycleName || `Audit Cycle - ${cycleDept}`,
      scopeDept: cycleDept,
      startDate: cycleStart,
      endDate: cycleEnd,
      auditors: cycleAuditors.split(",").map(s => s.trim()),
      status: "Active",
      results: {}
    };

    setActiveCycle(newCycle);
    const updatedAudits = [newCycle, ...audits];
    saveAudits(updatedAudits);
    setIsCreateModalOpen(false);

    // Reset Form
    setCycleName("");
    setCycleDept("Engineering");
    setCycleStart("2026-07-01");
    setCycleEnd("2026-07-15");
    setCycleAuditors("A. Rao, S. Iqbal");
  };

  // Close / Lock the audit cycle and apply status transitions to assets
  const handleCloseAuditCycle = () => {
    if (!activeCycle) return;

    // Apply updates to assets based on the audit results
    const updatedAssets = assets.map(asset => {
      const auditResult = activeCycle.results[asset.tag];
      if (!auditResult) return asset;

      let newStatus = asset.status;
      let newCondition = asset.condition;
      let detailsText = "";

      if (auditResult === "Missing") {
        newStatus = "Lost";
        detailsText = "Flipped to Lost state: confirmed missing during Audit Cycle";
      } else if (auditResult === "Damaged") {
        newStatus = "Under Maintenance";
        newCondition = "Poor";
        detailsText = "Flipped to Under Maintenance: marked damaged during Audit Cycle";
      } else if (auditResult === "Verified") {
        detailsText = "Verified location and status during Audit Cycle";
      }

      const historyEntry: HistoryEntry = {
        type: "Audit",
        date: new Date().toISOString().split("T")[0],
        details: `${detailsText} (${activeCycle.name})`,
        actor: activeCycle.auditors.join(", ")
      };

      return {
        ...asset,
        status: newStatus,
        condition: newCondition,
        history: [historyEntry, ...asset.history]
      };
    });

    saveAssets(updatedAssets);

    // Lock and update Audit Cycle status
    const closedCycle: AuditCycle = {
      ...activeCycle,
      status: "Closed"
    };

    const updatedAudits = audits.map(a => a.id === activeCycle.id ? closedCycle : a);
    saveAudits(updatedAudits);
    setActiveCycle(null);
  };

  // Stats for the active cycle
  const activeStats = useMemo(() => {
    if (!activeCycle) return { verified: 0, missing: 0, damaged: 0, pending: 0 };
    
    let verified = 0;
    let missing = 0;
    let damaged = 0;
    let pending = 0;

    scopedAssets.forEach(asset => {
      const res = activeCycle.results[asset.tag];
      if (res === "Verified") verified++;
      else if (res === "Missing") missing++;
      else if (res === "Damaged") damaged++;
      else pending++;
    });

    return { verified, missing, damaged, pending };
  }, [activeCycle, scopedAssets]);

  return (
    <div className="min-h-screen flex bg-[#ffffff] text-slate-800 font-sans">
      <Sidebar activeItem="Audit" />

      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto bg-slate-55/50">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                Structured Asset Audit
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                Conduct periodic verification reviews. Run auditor checklists, compile discrepancies, and lock statuses.
              </p>
            </div>

            {!activeCycle && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Start Audit Cycle
              </button>
            )}
          </header>

          {/* ACTIVE AUDIT DASHBOARD */}
          {activeCycle ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Active Cycle Metadata Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 card-shadow grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div className="md:col-span-2 space-y-2">
                  <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                    Active Audit Cycle
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900">{activeCycle.name}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Dept: {activeCycle.scopeDept}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {activeCycle.startDate} – {activeCycle.endDate}</span>
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> Auditors: {activeCycle.auditors.join(", ")}</span>
                  </div>
                </div>

                {/* Audit checklist progress ring or card summary */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-center text-xs font-bold text-slate-600">
                  <div className="space-y-1">
                    <p className="text-slate-450 uppercase text-[9px]">Verified: <span className="text-emerald-600">{activeStats.verified}</span></p>
                    <p className="text-slate-455 uppercase text-[9px]">Missing: <span className="text-red-650">{activeStats.missing}</span></p>
                    <p className="text-slate-456 uppercase text-[9px]">Damaged: <span className="text-amber-600">{activeStats.damaged}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-450 text-[10px]">Unchecked</p>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{activeStats.pending}</h3>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    onClick={handleCloseAuditCycle}
                    disabled={activeStats.pending > 0}
                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    Close Audit Cycle
                  </button>
                  {activeStats.pending > 0 && (
                    <span className="block text-[10px] text-slate-400 font-semibold mt-1.5 text-center">
                      Must verify all items to close
                    </span>
                  )}
                </div>
              </div>

              {/* Auto-generated discrepancy report banner if items are missing/damaged */}
              {(activeStats.missing > 0 || activeStats.damaged > 0) && (
                <div className="bg-amber-50 border border-amber-250 rounded-2xl p-4 text-amber-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-850">
                      {activeStats.missing + activeStats.damaged} Assets Flagged — Discrepancy Report Generated
                    </h4>
                    <p className="text-2xs font-semibold mt-0.5 leading-relaxed text-amber-705">
                      Auto-updates will execute when cycle closes: Missing items transition to 'Lost' state; Damaged items trigger 'Under Maintenance' diagnostics.
                    </p>
                  </div>
                </div>
              )}

              {/* Checklist Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden card-shadow">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-4 px-6">Asset Info</th>
                        <th className="py-4 px-6">Expected Location</th>
                        <th className="py-4 px-6">Current Holder</th>
                        <th className="py-4 px-6 text-center">Auditor Verification Checklist</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {scopedAssets.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-slate-400 font-semibold text-sm">
                            No assets configured in the scope of this audit cycle.
                          </td>
                        </tr>
                      ) : (
                        scopedAssets.map(asset => {
                          const result = activeCycle.results[asset.tag];
                          return (
                            <tr key={asset.tag} className="hover:bg-slate-50/20 transition-colors">
                              {/* Asset Info */}
                              <td className="py-4 px-6">
                                <div className="text-sm font-bold text-slate-900">{asset.name}</div>
                                <div className="text-xs font-semibold text-slate-400 mt-0.5 flex items-center gap-1.5">
                                  <span className="font-extrabold text-slate-500">{asset.tag}</span>
                                  <span>·</span>
                                  <span>SN: {asset.serialNumber}</span>
                                </div>
                              </td>

                              {/* Expected Location */}
                              <td className="py-4 px-6 text-sm text-slate-600 font-semibold">
                                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-450" /> {asset.location}</span>
                              </td>

                              {/* Current Holder */}
                              <td className="py-4 px-6 text-sm text-slate-650 font-semibold">
                                {asset.allocatedTo ? (
                                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> {asset.allocatedTo}</span>
                                ) : (
                                  <span className="text-slate-400 font-semibold italic">In Storage</span>
                                )}
                              </td>

                              {/* Verification Actions */}
                              <td className="py-4 px-6">
                                <div className="flex justify-center items-center gap-2">
                                  <button
                                    onClick={() => handleMarkAsset(asset.tag, "Verified")}
                                    className={`px-3 py-1.5 rounded-lg text-2xs font-extrabold transition-all cursor-pointer border ${
                                      result === "Verified"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/10"
                                        : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                                    }`}
                                  >
                                    Verified
                                  </button>
                                  <button
                                    onClick={() => handleMarkAsset(asset.tag, "Missing")}
                                    className={`px-3 py-1.5 rounded-lg text-2xs font-extrabold transition-all cursor-pointer border ${
                                      result === "Missing"
                                        ? "bg-red-50 text-red-700 border-red-300 ring-2 ring-red-500/10"
                                        : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                                    }`}
                                  >
                                    Missing
                                  </button>
                                  <button
                                    onClick={() => handleMarkAsset(asset.tag, "Damaged")}
                                    className={`px-3 py-1.5 rounded-lg text-2xs font-extrabold transition-all cursor-pointer border ${
                                      result === "Damaged"
                                        ? "bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-500/10"
                                        : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                                    }`}
                                  >
                                    Damaged
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            /* NO ACTIVE CYCLE - SHOW HISTORY & GUIDANCE */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* History Column (Left 2 Cols) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 card-shadow">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 mb-4">
                    <History className="w-4 h-4 text-emerald-650" />
                    Audit Cycle History Logs
                  </h3>

                  <div className="divide-y divide-slate-100">
                    {audits.map(audit => (
                      <div key={audit.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900">{audit.name}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-450 font-bold uppercase">
                            <span>Dept: {audit.scopeDept}</span>
                            <span>·</span>
                            <span>Dates: {audit.startDate} – {audit.endDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right text-[10px] text-slate-500 font-bold">
                            Audited by: {audit.auditors.join(", ")}
                          </div>
                          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                            {audit.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Instructions Card (Right 1 Col) */}
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 card-shadow space-y-3 text-blue-900">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Auditing Rules
                  </h4>
                  <ul className="text-xs font-medium space-y-2 list-disc list-inside leading-relaxed text-blue-950">
                    <li>Start a cycle by selecting a scoping department.</li>
                    <li>Auditors must verify every physical asset in the checklist.</li>
                    <li>Flagged assets dynamically register discrepancies.</li>
                    <li>Closing the cycle locks records and executes lifecycle corrections.</li>
                  </ul>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Start Cycle Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden z-50 relative font-sans"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Initiate New Audit Cycle
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCycle}>
                <div className="p-6 space-y-4">
                  
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Audit Cycle Name</label>
                    <input
                      type="text"
                      required
                      value={cycleName}
                      onChange={(e) => setCycleName(e.target.value)}
                      placeholder="e.g. Q3 IT Assets Audit"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white text-slate-900 font-semibold"
                    />
                  </div>

                  {/* Scoping Dept */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Scoping Scope (Department/Area)</label>
                    <select
                      value={cycleDept}
                      onChange={(e) => setCycleDept(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 text-slate-900 font-semibold"
                    >
                      <option value="Engineering">Engineering Department</option>
                      <option value="Logistics">Logistics Department</option>
                      <option value="Procurement">Procurement Department</option>
                      <option value="Sales">Sales Department</option>
                      <option value="All">All Assets</option>
                    </select>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Start Date
                      </label>
                      <input
                        type="date"
                        required
                        value={cycleStart}
                        onChange={(e) => setCycleStart(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 text-slate-900 font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> End Date
                      </label>
                      <input
                        type="date"
                        required
                        value={cycleEnd}
                        onChange={(e) => setCycleEnd(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 text-slate-900 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Auditors */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Assigned Auditors</label>
                    <input
                      type="text"
                      required
                      value={cycleAuditors}
                      onChange={(e) => setCycleAuditors(e.target.value)}
                      placeholder="e.g. A. Rao, S. Iqbal"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white text-slate-900 font-semibold"
                    />
                    <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">
                      Separate names with commas.
                    </span>
                  </div>

                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-650 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
                  >
                    Start Cycle
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

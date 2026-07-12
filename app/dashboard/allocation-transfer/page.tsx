"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRightLeft, 
  Plus, 
  UserPlus, 
  UserCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ArrowRight,
  User,
  Info,
  MapPin,
  ClipboardList,
  RefreshCw
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
  allocatedTo?: string; // Employee name
  allocatedToDept?: string; // Department name
  expectedReturnDate?: string; // YYYY-MM-DD
}

interface TransferRequest {
  id: string;
  assetTag: string;
  assetName: string;
  fromEmployee: string;
  toEmployee: string;
  toDept: string;
  status: "Pending" | "Approved" | "Rejected";
  requestDate: string;
}

const DEFAULT_TRANSFERS: TransferRequest[] = [
  {
    id: "tr-1",
    assetTag: "AF-0114",
    assetName: "MacBook Pro M3",
    fromEmployee: "Priya Shah",
    toEmployee: "Raj Verma",
    toDept: "Engineering",
    status: "Pending",
    requestDate: "2026-07-11"
  }
];

export default function AllocationTransferScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  
  // Allocate Form State
  const [selectedAssetTag, setSelectedAssetTag] = useState("");
  const [assigneeName, setAssigneeName] = useState("");
  const [assigneeDept, setAssigneeDept] = useState("Engineering");
  const [returnDate, setReturnDate] = useState("");
  const [allocationConflictError, setAllocationConflictError] = useState<string | null>(null);
  const [conflictingAsset, setConflictingAsset] = useState<Asset | null>(null);

  // Return Form State
  const [returnAssetTag, setReturnAssetTag] = useState("");
  const [returnCondition, setRegCondition] = useState<"New" | "Good" | "Fair" | "Poor" >("Good");
  const [returnNotes, setReturnNotes] = useState("");

  // Load and save localStorage
  useEffect(() => {
    // Assets
    const storedAssets = localStorage.getItem("assetflow_assets");
    if (storedAssets) {
      try {
        setAssets(JSON.parse(storedAssets));
      } catch (e) {
        // use defaults
      }
    }
    // Transfers
    const storedTransfers = localStorage.getItem("assetflow_transfers");
    if (storedTransfers) {
      try {
        setTransfers(JSON.parse(storedTransfers));
      } catch (e) {
        setTransfers(DEFAULT_TRANSFERS);
      }
    } else {
      setTransfers(DEFAULT_TRANSFERS);
      localStorage.setItem("assetflow_transfers", JSON.stringify(DEFAULT_TRANSFERS));
    }
  }, []);

  const saveAssets = (updated: Asset[]) => {
    setAssets(updated);
    localStorage.setItem("assetflow_assets", JSON.stringify(updated));
  };

  const saveTransfers = (updated: TransferRequest[]) => {
    setTransfers(updated);
    localStorage.setItem("assetflow_transfers", JSON.stringify(updated));
  };

  // Check if an allocation is overdue
  const isOverdue = (asset: Asset) => {
    if (asset.status !== "Allocated" || !asset.expectedReturnDate) return false;
    const due = new Date(asset.expectedReturnDate);
    const today = new Date("2026-07-12"); // Fixed mock today date based on timestamp
    return due < today;
  };

  // Filter lists
  const availableAssets = useMemo(() => assets.filter(a => a.status === "Available"), [assets]);
  const allocatedAssets = useMemo(() => assets.filter(a => a.status === "Allocated"), [assets]);
  
  const overdueAllocations = useMemo(() => {
    return assets.filter(a => a.status === "Allocated" && isOverdue(a));
  }, [assets]);

  // Handle Allocation Submit
  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    setAllocationConflictError(null);
    setConflictingAsset(null);

    const asset = assets.find(a => a.tag === selectedAssetTag);
    if (!asset) return;

    // Check conflict: Cannot allocate if not Available
    if (asset.status !== "Available") {
      setConflictingAsset(asset);
      const holder = asset.allocatedTo ? `currently held by ${asset.allocatedTo}` : `currently status is ${asset.status}`;
      setAllocationConflictError(`Conflict detected: Asset ${asset.tag} (${asset.name}) is ${holder}. Double-allocation is blocked.`);
      return;
    }

    // Perform Allocation
    const updated = assets.map(a => {
      if (a.tag === selectedAssetTag) {
        const historyEntry: HistoryEntry = {
          type: "Allocation",
          date: new Date().toISOString().split("T")[0],
          details: `Allocated to ${assigneeName} (${assigneeDept}). Return expected: ${returnDate || "None"}`,
          actor: "Jane Doe (Asset Manager)"
        };
        return {
          ...a,
          status: "Allocated" as const,
          allocatedTo: assigneeName,
          allocatedToDept: assigneeDept,
          expectedReturnDate: returnDate || undefined,
          history: [historyEntry, ...a.history]
        };
      }
      return a;
    });

    saveAssets(updated);
    setIsAllocateModalOpen(false);
    // Reset Form
    setSelectedAssetTag("");
    setAssigneeName("");
    setAssigneeDept("Engineering");
    setReturnDate("");
  };

  // Trigger Transfer Request from Conflict
  const handleRequestTransfer = () => {
    if (!conflictingAsset) return;
    
    const newTransfer: TransferRequest = {
      id: `tr-${Date.now()}`,
      assetTag: conflictingAsset.tag,
      assetName: conflictingAsset.name,
      fromEmployee: conflictingAsset.allocatedTo || "Unknown",
      toEmployee: assigneeName || "Raj Verma",
      toDept: assigneeDept || "Engineering",
      status: "Pending",
      requestDate: new Date().toISOString().split("T")[0]
    };

    saveTransfers([newTransfer, ...transfers]);
    setIsAllocateModalOpen(false);
    setAllocationConflictError(null);
    setConflictingAsset(null);
  };

  // Approve Transfer
  const handleApproveTransfer = (transfer: TransferRequest) => {
    // 1. Update Asset Allocation
    const updatedAssets = assets.map(a => {
      if (a.tag === transfer.assetTag) {
        const historyEntry: HistoryEntry = {
          type: "Allocation",
          date: new Date().toISOString().split("T")[0],
          details: `Transfer approved. Re-allocated from ${transfer.fromEmployee} to ${transfer.toEmployee} (${transfer.toDept})`,
          actor: "Jane Doe (Asset Manager)"
        };
        return {
          ...a,
          status: "Allocated" as const,
          allocatedTo: transfer.toEmployee,
          allocatedToDept: transfer.toDept,
          history: [historyEntry, ...a.history]
        };
      }
      return a;
    });
    saveAssets(updatedAssets);

    // 2. Update Transfer Request status
    const updatedTransfers = transfers.map(t => {
      if (t.id === transfer.id) {
        return { ...t, status: "Approved" as const };
      }
      return t;
    });
    saveTransfers(updatedTransfers);
  };

  // Reject Transfer
  const handleRejectTransfer = (id: string) => {
    const updated = transfers.map(t => {
      if (t.id === id) {
        return { ...t, status: "Rejected" as const };
      }
      return t;
    });
    saveTransfers(updated);
  };

  // Return Check-in Submit
  const handleReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnAssetTag) return;

    const updated = assets.map(a => {
      if (a.tag === returnAssetTag) {
        const historyEntry: HistoryEntry = {
          type: "StatusChange",
          date: new Date().toISOString().split("T")[0],
          details: `Returned by ${a.allocatedTo}. Checked-in condition: ${returnCondition}. Notes: ${returnNotes || "None"}`,
          actor: "Jane Doe (Asset Manager)"
        };
        return {
          ...a,
          status: "Available" as const,
          condition: returnCondition,
          allocatedTo: undefined,
          allocatedToDept: undefined,
          expectedReturnDate: undefined,
          history: [historyEntry, ...a.history]
        };
      }
      return a;
    });

    saveAssets(updated);
    setIsReturnModalOpen(false);
    setReturnAssetTag("");
    setReturnNotes("");
  };

  return (
    <div className="min-h-screen flex bg-[#ffffff] text-slate-800 font-sans">
      <Sidebar activeItem="Allocation &amp; Transfer" />

      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto bg-slate-55/50">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
                </div>
                Asset Allocation &amp; Transfer
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                Allocate company resources, resolve double-booking conflicts via the transfer request pipeline, and check back items in.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setReturnAssetTag("");
                  setIsReturnModalOpen(true);
                }}
                className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all card-shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                Check-in Return
              </button>
              <button
                onClick={() => {
                  setSelectedAssetTag("");
                  setAllocationConflictError(null);
                  setConflictingAsset(null);
                  setIsAllocateModalOpen(true);
                }}
                className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Allocate Asset
              </button>
            </div>
          </header>

          {/* Overdue Returns Alert Panel */}
          {overdueAllocations.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-5 card-shadow flex items-start gap-4"
            >
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-sm font-extrabold text-red-800">Action Required: Overdue Returns Flagged</h3>
                  <p className="text-xs text-red-750/90 leading-relaxed mt-1">
                    The following assets are currently past their expected return date. Follow up with employees to check-in or request extensions.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {overdueAllocations.map(asset => (
                    <div key={asset.tag} className="bg-white border border-red-100 p-3 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-red-950">{asset.tag}</span>
                        <p className="font-bold text-slate-700 mt-0.5">{asset.name}</p>
                        <p className="text-[10px] text-slate-450 mt-1 flex items-center gap-1 font-semibold">
                          <User className="w-3 h-3 text-slate-400" /> By: {asset.allocatedTo}
                        </p>
                      </div>
                      <span className="text-[10px] font-extrabold text-red-700 bg-red-50 border border-red-150 rounded px-2 py-0.5">
                        Due: {asset.expectedReturnDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Grid: Left column (Active Allocations) & Right column (Transfer Requests) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. Active Allocations List (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 card-shadow">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 mb-4">
                  <ClipboardList className="w-4 h-4 text-emerald-600" />
                  Active Allocations Directory
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-4">Asset Tag</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Allocated To</th>
                        <th className="py-3 px-4">Dept</th>
                        <th className="py-3 px-4">Expected Return</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                      {allocatedAssets.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                            No assets currently allocated.
                          </td>
                        </tr>
                      ) : (
                        allocatedAssets.map(asset => {
                          const isAssetOverdue = isOverdue(asset);
                          return (
                            <tr key={asset.tag} className="hover:bg-slate-50/30 transition-colors">
                              <td className="py-3.5 px-4 font-bold text-slate-900">{asset.tag}</td>
                              <td className="py-3.5 px-4 text-slate-650">{asset.name}</td>
                              <td className="py-3.5 px-4 text-slate-800 flex items-center gap-1.5 mt-0.5">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                {asset.allocatedTo}
                              </td>
                              <td className="py-3.5 px-4 text-slate-500">{asset.allocatedToDept}</td>
                              <td className="py-3.5 px-4">
                                {asset.expectedReturnDate ? (
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isAssetOverdue 
                                      ? "bg-red-50 text-red-700 border border-red-100 animate-pulse" 
                                      : "bg-slate-100 text-slate-650"
                                  }`}>
                                    <Calendar className="w-3 h-3" />
                                    {asset.expectedReturnDate}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-medium">Indefinite</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => {
                                    setReturnAssetTag(asset.tag);
                                    setIsReturnModalOpen(true);
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:underline text-[11px] font-bold cursor-pointer"
                                >
                                  Check-in
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 2. Transfer Request Panel (1 Col) */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 card-shadow space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-emerald-650" />
                    Transfer Requests
                  </h3>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-2xs font-extrabold border border-slate-200">
                    {transfers.filter(t => t.status === "Pending").length} Pending
                  </span>
                </div>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {transfers.length === 0 ? (
                    <p className="text-xs font-semibold text-slate-400 text-center py-8">No transfer requests filed yet.</p>
                  ) : (
                    transfers.map(tr => {
                      const isPending = tr.status === "Pending";
                      return (
                        <div 
                          key={tr.id} 
                          className={`p-4 rounded-xl border text-xs flex flex-col gap-2.5 transition-all ${
                            isPending 
                              ? "bg-slate-50/50 border-slate-200/80" 
                              : tr.status === "Approved" 
                              ? "bg-emerald-50/20 border-emerald-100 text-emerald-950" 
                              : "bg-slate-100 border-slate-200 text-slate-500 opacity-60"
                          }`}
                        >
                          {/* Asset Header */}
                          <div className="flex justify-between items-start gap-1">
                            <div>
                              <span className="font-extrabold text-slate-950">{tr.assetTag}</span>
                              <h4 className="font-bold text-slate-500 text-2xs mt-0.5">{tr.assetName}</h4>
                            </div>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                              isPending
                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                : tr.status === "Approved"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : "bg-slate-200 text-slate-700 border-slate-300"
                            }`}>
                              {tr.status}
                            </span>
                          </div>

                          {/* Flow Arrow */}
                          <div className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded-lg text-2xs font-extrabold text-slate-700 shadow-2xs">
                            <div className="min-w-0">
                              <p className="text-slate-400 uppercase text-[8px] tracking-wider font-extrabold">From Holder</p>
                              <p className="truncate mt-0.5">{tr.fromEmployee}</p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                            <div className="min-w-0 text-right">
                              <p className="text-slate-400 uppercase text-[8px] tracking-wider font-extrabold">Target Assignee</p>
                              <p className="truncate mt-0.5">{tr.toEmployee} ({tr.toDept})</p>
                            </div>
                          </div>

                          {/* Actions */}
                          {isPending && (
                            <div className="flex items-center gap-2 pt-1 border-t border-slate-150/60">
                              <button
                                onClick={() => handleApproveTransfer(tr)}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1 rounded-lg font-bold text-2xs shadow-sm transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectTransfer(tr.id)}
                                className="px-2.5 py-1 text-slate-500 hover:bg-slate-200/50 rounded-lg font-bold border border-slate-250 text-2xs transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* 1. Allocate Asset Modal */}
      <AnimatePresence>
        {isAllocateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAllocateModalOpen(false)}
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
                  <UserPlus className="w-5 h-5 text-emerald-650" />
                  Allocate Company Asset
                </h3>
                <button onClick={() => setIsAllocateModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAllocate}>
                <div className="p-6 space-y-4">
                  
                  {/* Select Asset */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Select Available Asset</label>
                    <select
                      value={selectedAssetTag}
                      onChange={(e) => {
                        setSelectedAssetTag(e.target.value);
                        setAllocationConflictError(null);
                        setConflictingAsset(null);
                      }}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white text-slate-900 font-semibold"
                    >
                      <option value="">-- Choose an Asset --</option>
                      {assets.map(asset => (
                        <option key={asset.tag} value={asset.tag}>
                          {asset.tag} - {asset.name} ({asset.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Conflict alert inside modal */}
                  {allocationConflictError && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-3 text-red-900">
                      <div className="flex items-start gap-2 text-xs font-bold leading-relaxed">
                        <AlertTriangle className="w-4 h-4 text-red-655 shrink-0 mt-0.5" />
                        <p>{allocationConflictError}</p>
                      </div>
                      
                      {conflictingAsset?.status === "Allocated" && (
                        <button
                          type="button"
                          onClick={handleRequestTransfer}
                          className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          Initiate Transfer Request instead
                        </button>
                      )}
                    </div>
                  )}

                  {/* Assignee Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Employee Name</label>
                    <input
                      type="text"
                      required
                      value={assigneeName}
                      onChange={(e) => setAssigneeName(e.target.value)}
                      placeholder="e.g. Raj Verma or Siddharth Sen"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white text-slate-900 font-semibold"
                    />
                  </div>

                  {/* Department & Expected Return Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Department</label>
                      <select
                        value={assigneeDept}
                        onChange={(e) => setAssigneeDept(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 text-slate-900 font-semibold"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Procurement">Procurement</option>
                        <option value="Logistics">Logistics</option>
                        <option value="Sales">Sales</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Expected Return
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 text-slate-900 font-semibold"
                      />
                    </div>
                  </div>

                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAllocateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
                  >
                    Allocate
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Check-in Return Modal */}
      <AnimatePresence>
        {isReturnModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReturnModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full overflow-hidden z-50 relative font-sans"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  Check-in Returned Asset
                </h3>
                <button onClick={() => setIsReturnModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleReturn}>
                <div className="p-6 space-y-4">
                  {/* Select Asset */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Asset to Return</label>
                    <select
                      value={returnAssetTag}
                      onChange={(e) => setReturnAssetTag(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white text-slate-900 font-semibold"
                    >
                      <option value="">-- Choose an Allocated Asset --</option>
                      {allocatedAssets.map(asset => (
                        <option key={asset.tag} value={asset.tag}>
                          {asset.tag} - {asset.name} (held by {asset.allocatedTo})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Return Condition */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Check-in Condition</label>
                    <select
                      value={returnCondition}
                      onChange={(e) => setRegCondition(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 text-slate-900 font-semibold"
                    >
                      <option value="New">New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>

                  {/* Return Notes */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Check-in Notes</label>
                    <textarea
                      value={returnNotes}
                      onChange={(e) => setReturnNotes(e.target.value)}
                      placeholder="e.g. Returned with original charger. Minor scratches on case."
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white resize-none font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsReturnModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-650 hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    Check-in Return
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

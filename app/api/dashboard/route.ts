import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Asset from "../../../models/Asset";
import Department from "../../../models/Department";
import Employee from "../../../models/Employee";
import TransferRequest from "../../../models/TransferRequest";
import Allocation from "../../../models/Allocation";

export async function GET() {
  try {
    await dbConnect();

    const [
      totalAssets,
      availableAssets,
      allocatedAssets,
      reservedAssets,
      maintenanceAssets,
      lostAssets,
      disposedAssets,
      departmentsCount,
      employeesCount,
      pendingTransfers,
      overdueAllocations
    ] = await Promise.all([
      Asset.countDocuments({}),
      Asset.countDocuments({ status: "Available" }),
      Asset.countDocuments({ status: "Allocated" }),
      Asset.countDocuments({ status: "Reserved" }),
      Asset.countDocuments({ status: "Under Maintenance" }),
      Asset.countDocuments({ status: "Lost" }),
      Asset.countDocuments({ status: "Disposed" }),
      Department.countDocuments({ status: "Active" }),
      Employee.countDocuments({ status: "Active" }),
      TransferRequest.countDocuments({ status: "Pending" }),
      Allocation.countDocuments({ status: "Overdue" })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalAssets,
        availableAssets,
        allocatedAssets,
        reservedAssets,
        maintenanceAssets,
        lostAssets,
        disposedAssets,
        departmentsCount,
        employeesCount,
        pendingTransfers,
        overdueAllocations
      }
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to fetch dashboard metrics"
    }, { status: 500 });
  }
}

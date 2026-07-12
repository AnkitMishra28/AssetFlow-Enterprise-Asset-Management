import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../../../lib/mongodb";
import Allocation from "../../../../models/Allocation";
import Employee from "../../../../models/Employee";
import Department from "../../../../models/Department";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const employee = searchParams.get("employee");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const query: Record<string, unknown> = {};

    if (department) {
      if (mongoose.Types.ObjectId.isValid(department)) {
        query.department = department;
      } else {
        const deptDoc = await Department.findOne({ name: { $regex: new RegExp(`^${department}$`, "i") } });
        if (deptDoc) {
          query.department = deptDoc._id;
        } else {
          return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }
      }
    }

    if (employee) {
      if (mongoose.Types.ObjectId.isValid(employee)) {
        query.employee = employee;
      } else {
        const empDoc = await Employee.findOne({ name: { $regex: new RegExp(`^${employee}$`, "i") } });
        if (empDoc) {
          query.employee = empDoc._id;
        } else {
          return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }
      }
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      const dateRange: Record<string, unknown> = {};
      if (startDate) {
        dateRange.$gte = new Date(startDate);
      }
      if (endDate) {
        dateRange.$lte = new Date(endDate);
      }
      query.allocatedDate = dateRange;
    }

    const allocations = await Allocation.find(query as unknown as Parameters<typeof Allocation.find>[0])
      .populate("asset")
      .populate("employee")
      .populate("department");

    return NextResponse.json({
      success: true,
      data: allocations
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to retrieve allocations report"
    }, { status: 500 });
  }
}

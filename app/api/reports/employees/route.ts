import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../../../lib/mongodb";
import Employee from "../../../../models/Employee";
import Department from "../../../../models/Department";
import Allocation from "../../../../models/Allocation";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const employeeId = searchParams.get("employee");
    const status = searchParams.get("status");

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

    if (employeeId) {
      if (mongoose.Types.ObjectId.isValid(employeeId)) {
        query._id = employeeId;
      } else {
        query.name = { $regex: new RegExp(employeeId, "i") };
      }
    }

    if (status) {
      query.status = status;
    }

    const employees = await Employee.find(query as unknown as Parameters<typeof Employee.find>[0]).populate("department");
    
    const reportData = [];
    for (const emp of employees) {
      const activeAllocations = await Allocation.find({
        employee: emp._id,
        status: "Active"
      }).populate("asset");
      
      reportData.push({
        employee: emp,
        activeAllocations: activeAllocations
      });
    }

    return NextResponse.json({
      success: true,
      data: reportData
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to retrieve employee reports"
    }, { status: 500 });
  }
}

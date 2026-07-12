import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Allocation from "../../../models/Allocation";
import Asset, { IAsset } from "../../../models/Asset";
import Employee from "../../../models/Employee";
import Department from "../../../models/Department";
import { createNotification } from "../../../lib/notifications";

export async function GET() {
  try {
    await dbConnect();

    // Auto-update overdue statuses on fetch
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeAllocations = await Allocation.find({ status: "Active" }).populate("asset");
    for (const alloc of activeAllocations) {
      if (alloc.expectedReturnDate && new Date(alloc.expectedReturnDate) < today) {
        alloc.status = "Overdue";
        await alloc.save();

        const assetDoc = alloc.asset as unknown as IAsset;
        const tag = assetDoc?.assetTag || alloc.asset.toString();

        await createNotification(
          "Overdue Allocation",
          "Overdue Asset Return",
          `Allocation for asset ${tag} is overdue. Expected return date was ${new Date(alloc.expectedReturnDate).toISOString().split("T")[0]}`
        );
      }
    }

    // Return non-inactive allocations
    const allocations = await Allocation.find({ status: { $ne: "Inactive" } })
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
      message: err.message || "Failed to retrieve allocations"
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Validation
    if (!body.asset) {
      return NextResponse.json({ success: false, message: "Asset is required." }, { status: 400 });
    }
    if (!body.employee) {
      return NextResponse.json({ success: false, message: "Employee is required." }, { status: 400 });
    }
    if (!body.department) {
      return NextResponse.json({ success: false, message: "Department is required." }, { status: 400 });
    }

    if (body.expectedReturnDate) {
      const returnD = new Date(body.expectedReturnDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      returnD.setHours(0, 0, 0, 0);
      if (returnD < today) {
        return NextResponse.json({ success: false, message: "Expected Return Date cannot be before today." }, { status: 400 });
      }
    }

    // Verify Asset exists and is Available
    const assetDoc = await Asset.findById(body.asset);
    if (!assetDoc) {
      return NextResponse.json({ success: false, message: "Asset not found." }, { status: 404 });
    }
    if (assetDoc.status !== "Available") {
      if (assetDoc.status === "Allocated") {
        return NextResponse.json({ success: false, message: "Asset is already allocated." }, { status: 409 });
      }
      return NextResponse.json({ success: false, message: `Asset is not available for allocation. Current status: ${assetDoc.status}` }, { status: 400 });
    }

    // Verify Employee exists
    const empDoc = await Employee.findById(body.employee);
    if (!empDoc) {
      return NextResponse.json({ success: false, message: "Employee not found." }, { status: 404 });
    }

    // Verify Department exists
    const deptDoc = await Department.findById(body.department);
    if (!deptDoc) {
      return NextResponse.json({ success: false, message: "Department not found." }, { status: 404 });
    }

    // Create Allocation
    const newAllocation = new Allocation({
      asset: body.asset,
      employee: body.employee,
      department: body.department,
      allocatedDate: body.allocatedDate ? new Date(body.allocatedDate) : new Date(),
      expectedReturnDate: body.expectedReturnDate ? new Date(body.expectedReturnDate) : undefined,
      status: "Active"
    });
    await newAllocation.save();

    // Transition Asset
    assetDoc.status = "Allocated";
    const historyEntry = {
      type: "Allocation" as const,
      date: new Date(),
      details: `Allocated to ${empDoc.name} (${deptDoc.name}). Return expected: ${body.expectedReturnDate ? new Date(body.expectedReturnDate).toISOString().split("T")[0] : "None"}`,
      actor: body.performedBy || "Jane Doe (Asset Manager)"
    };
    assetDoc.history.unshift(historyEntry);
    await assetDoc.save();

    // Log notification
    await createNotification(
      "Asset Allocated",
      "Asset Allocated",
      `Asset ${assetDoc.assetTag} (${assetDoc.name}) has been allocated to ${empDoc.name}.`
    );

    return NextResponse.json({
      success: true,
      data: newAllocation
    }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { name?: string; message?: string; errors?: Record<string, unknown> };
    if (err.name === "ValidationError") {
      return NextResponse.json({
        success: false,
        message: "Validation Error",
        errors: err.errors
      }, { status: 400 });
    }
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to create allocation"
    }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import TransferRequest from "../../../models/TransferRequest";
import Asset from "../../../models/Asset";
import Employee from "../../../models/Employee";

export async function GET() {
  try {
    await dbConnect();
    const transfers = await TransferRequest.find({})
      .populate("asset")
      .populate("fromEmployee")
      .populate("toEmployee")
      .populate("requestedBy");

    return NextResponse.json({
      success: true,
      data: transfers
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to retrieve transfer requests"
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
    if (!body.fromEmployee) {
      return NextResponse.json({ success: false, message: "Current holder (fromEmployee) is required." }, { status: 400 });
    }
    if (!body.toEmployee) {
      return NextResponse.json({ success: false, message: "Target employee (toEmployee) is required." }, { status: 400 });
    }
    if (!body.requestedBy) {
      return NextResponse.json({ success: false, message: "Requester (requestedBy) is required." }, { status: 400 });
    }

    if (body.fromEmployee.toString() === body.toEmployee.toString()) {
      return NextResponse.json({ success: false, message: "Target employee cannot be the same as the current holder." }, { status: 400 });
    }
    if (body.requestedBy.toString() === body.toEmployee.toString()) {
      // Just check validation helper
      // Requester != Recipient
    }

    // Verify Asset
    const assetDoc = await Asset.findById(body.asset);
    if (!assetDoc) {
      return NextResponse.json({ success: false, message: "Asset not found." }, { status: 404 });
    }

    // Verify Employees
    const fromEmp = await Employee.findById(body.fromEmployee);
    if (!fromEmp) {
      return NextResponse.json({ success: false, message: "Current holder employee not found." }, { status: 404 });
    }
    const toEmp = await Employee.findById(body.toEmployee);
    if (!toEmp) {
      return NextResponse.json({ success: false, message: "Target employee not found." }, { status: 404 });
    }
    const reqEmp = await Employee.findById(body.requestedBy);
    if (!reqEmp) {
      return NextResponse.json({ success: false, message: "Requester employee not found." }, { status: 404 });
    }

    const newTransfer = new TransferRequest({
      asset: body.asset,
      fromEmployee: body.fromEmployee,
      toEmployee: body.toEmployee,
      requestedBy: body.requestedBy,
      reason: body.reason || "",
      status: "Pending"
    });

    await newTransfer.save();
    return NextResponse.json({
      success: true,
      data: newTransfer
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
      message: err.message || "Failed to create transfer request"
    }, { status: 500 });
  }
}

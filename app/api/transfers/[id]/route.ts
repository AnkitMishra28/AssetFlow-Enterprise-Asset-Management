import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import TransferRequest from "../../../../models/TransferRequest";
import Allocation from "../../../../models/Allocation";
import Asset from "../../../../models/Asset";
import Employee from "../../../../models/Employee";
import { createNotification } from "../../../../lib/notifications";

interface Params {
  id: string;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const transfer = await TransferRequest.findById(id);
    if (!transfer) {
      return NextResponse.json({ success: false, message: "Transfer request not found" }, { status: 404 });
    }

    if (transfer.status !== "Pending") {
      return NextResponse.json({ success: false, message: "Transfer request has already been processed." }, { status: 400 });
    }

    const { status, performedBy } = body;
    if (status !== "Approved" && status !== "Rejected") {
      return NextResponse.json({ success: false, message: "Invalid status. Must be 'Approved' or 'Rejected'." }, { status: 400 });
    }

    if (status === "Approved") {
      // 1. Close previous active allocation
      const activeAlloc = await Allocation.findOne({
        asset: transfer.asset,
        employee: transfer.fromEmployee,
        status: "Active"
      });
      if (activeAlloc) {
        activeAlloc.status = "Returned";
        activeAlloc.returnedDate = new Date();
        activeAlloc.conditionOnReturn = "Good";
        await activeAlloc.save();
      }

      // 2. Fetch target recipient details
      const targetEmp = await Employee.findById(transfer.toEmployee);
      if (!targetEmp) {
        return NextResponse.json({ success: false, message: "Recipient employee not found." }, { status: 400 });
      }

      // 3. Create new allocation
      const newAlloc = new Allocation({
        asset: transfer.asset,
        employee: transfer.toEmployee,
        department: targetEmp.department,
        allocatedDate: new Date(),
        status: "Active"
      });
      await newAlloc.save();

      // 4. Update Asset History & state
      const assetDoc = await Asset.findById(transfer.asset);
      if (assetDoc) {
        assetDoc.status = "Allocated";
        const historyEntry = {
          type: "Allocation" as const,
          date: new Date(),
          details: `Transfer approved. Re-allocated from holder ID ${transfer.fromEmployee} to ${targetEmp.name}`,
          actor: performedBy || "Jane Doe (Asset Manager)"
        };
        assetDoc.history.unshift(historyEntry);
        await assetDoc.save();

        // 5. Create notifications
        await createNotification(
          "Transfer Approved",
          "Transfer Approved",
          `Transfer request for asset ${assetDoc.assetTag} (${assetDoc.name}) has been approved.`
        );
      }
    } else if (status === "Rejected") {
      // Create notifications
      const assetDoc = await Asset.findById(transfer.asset);
      if (assetDoc) {
        await createNotification(
          "Transfer Rejected",
          "Transfer Rejected",
          `Transfer request for asset ${assetDoc.assetTag} (${assetDoc.name}) has been rejected.`
        );
      }
    }

    transfer.status = status;
    await transfer.save();

    return NextResponse.json({
      success: true,
      data: transfer
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to process transfer request"
    }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const deletedTransfer = await TransferRequest.findByIdAndDelete(id);
    if (!deletedTransfer) {
      return NextResponse.json({ success: false, message: "Transfer request not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: deletedTransfer
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to delete transfer request"
    }, { status: 500 });
  }
}

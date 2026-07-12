import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Allocation from "../../../../models/Allocation";
import Asset from "../../../../models/Asset";
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

    const allocation = await Allocation.findById(id);
    if (!allocation) {
      return NextResponse.json({ success: false, message: "Allocation not found" }, { status: 404 });
    }

    if (body.status === "Returned") {
      if (allocation.status === "Returned") {
        return NextResponse.json({ success: false, message: "Asset is already returned." }, { status: 400 });
      }

      const condition = body.conditionOnReturn || "Good";
      const returnDate = body.returnedDate ? new Date(body.returnedDate) : new Date();

      // Update Allocation
      allocation.status = "Returned";
      allocation.conditionOnReturn = condition;
      allocation.returnedDate = returnDate;
      await allocation.save();

      // Update Asset
      const assetDoc = await Asset.findById(allocation.asset);
      if (assetDoc) {
        assetDoc.status = "Available";
        assetDoc.condition = condition;

        const historyEntry = {
          type: "StatusChange" as const,
          date: new Date(),
          details: `Returned from allocation. Checked-in condition: ${condition}. Notes: ${body.remarks || "None"}`,
          actor: body.performedBy || "Jane Doe (Asset Manager)"
        };
        assetDoc.history.unshift(historyEntry);
        await assetDoc.save();

        // Create Notification
        await createNotification(
          "Asset Returned",
          "Asset Returned",
          `Asset ${assetDoc.assetTag} (${assetDoc.name}) has been checked in under condition: ${condition}.`
        );
      }
    } else {
      // General update
      if (body.expectedReturnDate !== undefined) {
        allocation.expectedReturnDate = body.expectedReturnDate ? new Date(body.expectedReturnDate) : undefined;
      }
      if (body.status !== undefined) {
        allocation.status = body.status;
      }
      await allocation.save();
    }

    return NextResponse.json({
      success: true,
      data: allocation
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to update allocation"
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

    // Soft delete only
    const deletedAllocation = await Allocation.findByIdAndUpdate(
      id,
      { status: "Inactive" },
      { new: true }
    );

    if (!deletedAllocation) {
      return NextResponse.json({ success: false, message: "Allocation not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: deletedAllocation
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to delete allocation"
    }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Asset from "../../../../models/Asset";
import Category from "../../../../models/Category";

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

    const oldAsset = await Asset.findById(id);
    if (!oldAsset) {
      return NextResponse.json({ success: false, message: "Asset not found" }, { status: 404 });
    }

    // Validations (only if provided in request body)
    if (body.name !== undefined && !body.name.trim()) {
      return NextResponse.json({ success: false, message: "Asset Name is required." }, { status: 400 });
    }
    if (body.serialNumber !== undefined && !body.serialNumber.trim()) {
      return NextResponse.json({ success: false, message: "Serial Number is required." }, { status: 400 });
    }
    if (body.acquisitionCost !== undefined) {
      const costNum = Number(body.acquisitionCost);
      if (isNaN(costNum) || costNum <= 0) {
        return NextResponse.json({ success: false, message: "Acquisition Cost must be a positive number." }, { status: 400 });
      }
    }
    if (body.acquisitionDate !== undefined) {
      const dateVal = new Date(body.acquisitionDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateVal.setHours(0, 0, 0, 0);
      if (dateVal > today) {
        return NextResponse.json({ success: false, message: "Acquisition Date cannot be in the future." }, { status: 400 });
      }
    }
    if (body.location !== undefined && !body.location.trim()) {
      return NextResponse.json({ success: false, message: "Location is required." }, { status: 400 });
    }

    if (body.category !== undefined) {
      const categoryExists = await Category.findById(body.category);
      if (!categoryExists) {
        return NextResponse.json({ success: false, message: "Category does not exist." }, { status: 400 });
      }
    }

    // Capture remarks & details
    const actorName = body.performedBy || "Jane Doe (Asset Manager)";
    const remarks = body.remarks || "Updated asset details";
    
    // Determine history action type
    let historyType: "Registration" | "Allocation" | "Maintenance" | "Audit" | "StatusChange" = "StatusChange";
    if (body.status && body.status !== oldAsset.status) {
      if (body.status === "Allocated") {
        historyType = "Allocation";
      } else if (body.status === "Under Maintenance") {
        historyType = "Maintenance";
      } else {
        historyType = "StatusChange";
      }
    }

    const historyEntry = {
      type: historyType,
      date: new Date(),
      details: remarks,
      actor: actorName
    };

    // Construct update fields
    const updateFields: Record<string, unknown> = {
      name: body.name !== undefined ? body.name.trim() : oldAsset.name,
      category: body.category !== undefined ? body.category : oldAsset.category,
      serialNumber: body.serialNumber !== undefined ? body.serialNumber.trim() : oldAsset.serialNumber,
      acquisitionDate: body.acquisitionDate !== undefined ? body.acquisitionDate : oldAsset.acquisitionDate,
      acquisitionCost: body.acquisitionCost !== undefined ? Number(body.acquisitionCost) : oldAsset.acquisitionCost,
      condition: body.condition !== undefined ? body.condition : oldAsset.condition,
      location: body.location !== undefined ? body.location.trim() : oldAsset.location,
      status: body.status !== undefined ? body.status : oldAsset.status,
      sharedBookable: body.sharedBookable !== undefined ? body.sharedBookable : oldAsset.sharedBookable,
    };

    const updatedAsset = await Asset.findByIdAndUpdate(
      id,
      {
        $set: updateFields,
        $push: { history: { $each: [historyEntry], $position: 0 } }
      },
      { new: true, runValidators: true }
    ).populate("category");

    return NextResponse.json({ success: true, data: updatedAsset }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { code?: number; name?: string; message?: string; errors?: Record<string, unknown> };
    if (err.code === 11000) {
      return NextResponse.json({ success: false, message: "Serial Number must be unique." }, { status: 409 });
    }
    if (err.name === "ValidationError") {
      return NextResponse.json({ success: false, message: "Validation Error", errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: err.message || "Failed to update asset" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    // Soft delete: update status to Retired
    const deletedAsset = await Asset.findByIdAndUpdate(
      id,
      { status: "Retired" },
      { new: true }
    );

    if (!deletedAsset) {
      return NextResponse.json({ success: false, message: "Asset not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedAsset }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ success: false, message: err.message || "Failed to delete asset" }, { status: 500 });
  }
}

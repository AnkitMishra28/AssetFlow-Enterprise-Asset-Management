import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../../lib/mongodb";
import Asset from "../../../models/Asset";
import Category from "../../../models/Category";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const location = searchParams.get("location");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = {};

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const catDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, "i") } });
        if (catDoc) {
          query.category = catDoc._id;
        } else {
          return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }
      }
    }

    if (status) {
      query.status = status;
    }

    if (location) {
      query.location = { $regex: new RegExp(location, "i") };
    }

    if (search) {
      query.$or = [
        { assetTag: { $regex: new RegExp(search, "i") } },
        { name: { $regex: new RegExp(search, "i") } },
        { serialNumber: { $regex: new RegExp(search, "i") } },
        { location: { $regex: new RegExp(search, "i") } }
      ];
    }

    const assets = await Asset.find(query as unknown as Parameters<typeof Asset.find>[0]).populate("category");
    return NextResponse.json({
      success: true,
      data: assets
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to retrieve assets"
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Validations
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, message: "Asset Name is required." }, { status: 400 });
    }
    if (!body.category) {
      return NextResponse.json({ success: false, message: "Category is required." }, { status: 400 });
    }
    if (!body.serialNumber || !body.serialNumber.trim()) {
      return NextResponse.json({ success: false, message: "Serial Number is required." }, { status: 400 });
    }
    if (!body.acquisitionDate) {
      return NextResponse.json({ success: false, message: "Acquisition Date is required." }, { status: 400 });
    }
    if (body.acquisitionCost === undefined || body.acquisitionCost === null) {
      return NextResponse.json({ success: false, message: "Acquisition Cost is required." }, { status: 400 });
    }

    const costNum = Number(body.acquisitionCost);
    if (isNaN(costNum) || costNum <= 0) {
      return NextResponse.json({ success: false, message: "Acquisition Cost must be a positive number." }, { status: 400 });
    }

    const dateVal = new Date(body.acquisitionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateVal.setHours(0, 0, 0, 0);
    if (dateVal > today) {
      return NextResponse.json({ success: false, message: "Acquisition Date cannot be in the future." }, { status: 400 });
    }

    if (!body.location || !body.location.trim()) {
      return NextResponse.json({ success: false, message: "Location is required." }, { status: 400 });
    }

    // Verify Category exists
    const categoryExists = await Category.findById(body.category);
    if (!categoryExists) {
      return NextResponse.json({ success: false, message: "Category does not exist." }, { status: 400 });
    }

    // Generate sequential tag
    const lastAsset = await Asset.findOne({}, { assetTag: 1 }).sort({ assetTag: -1 }).exec();
    let nextNum = 1;
    if (lastAsset && lastAsset.assetTag) {
      const match = lastAsset.assetTag.match(/^AF-(\d+)$/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    const newTag = `AF-${String(nextNum).padStart(4, "0")}`;

    // History Entry
    const initialHistory = [
      {
        type: "Registration" as const,
        date: new Date(),
        details: body.remarks || `Registered asset under tag ${newTag}`,
        actor: body.performedBy || "Jane Doe (Asset Manager)"
      }
    ];

    const newAsset = new Asset({
      assetTag: newTag,
      name: body.name.trim(),
      category: body.category,
      serialNumber: body.serialNumber.trim(),
      acquisitionDate: body.acquisitionDate,
      acquisitionCost: costNum,
      condition: body.condition || "Good",
      location: body.location.trim(),
      status: body.status || "Available",
      sharedBookable: body.sharedBookable || false,
      history: initialHistory
    });

    await newAsset.save();
    return NextResponse.json({ success: true, data: newAsset }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { code?: number; name?: string; message?: string; errors?: Record<string, unknown> };
    if (err.code === 11000) {
      return NextResponse.json({ success: false, message: "Serial Number must be unique." }, { status: 409 });
    }
    if (err.name === "ValidationError") {
      return NextResponse.json({ success: false, message: "Validation Error", errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: err.message || "Failed to register asset" }, { status: 500 });
  }
}

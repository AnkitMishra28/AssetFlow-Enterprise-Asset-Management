import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../../../lib/mongodb";
import Asset from "../../../../models/Asset";
import Category from "../../../../models/Category";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const location = searchParams.get("location");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

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

    if (startDate || endDate) {
      const dateRange: Record<string, unknown> = {};
      if (startDate) {
        dateRange.$gte = new Date(startDate);
      }
      if (endDate) {
        dateRange.$lte = new Date(endDate);
      }
      query.acquisitionDate = dateRange;
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
      message: err.message || "Failed to retrieve asset report"
    }, { status: 500 });
  }
}

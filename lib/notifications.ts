import Notification from "../models/Notification";

export async function createNotification(
  type: "Asset Allocated" | "Asset Returned" | "Transfer Approved" | "Transfer Rejected" | "Overdue Allocation" | "Maintenance Due",
  title: string,
  message: string
) {
  try {
    const notif = new Notification({
      type,
      title,
      message,
    });
    await notif.save();
    return notif;
  } catch (error) {
    console.error("Failed to create notification document:", error);
  }
}

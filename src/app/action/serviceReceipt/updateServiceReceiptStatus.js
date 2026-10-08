"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateServiceReceiptStatus(receiptId, status, value) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (!session || session.expiresAt < new Date()) {
    cookieStore.delete("session");
    redirect("/login");
  }

  if (!receiptId) {
    return {
      success: false,
      error: "ID nota tidak ditemukan",
    };
  }

  if (status !== "processStatus" && status !== "pickupStatus") {
    return {
      success: false,
      error: "Status tidak valid",
    };
  }

  if (typeof value !== "boolean") {
    return {
      success: false,
      error: "Nilai status tidak valid",
    };
  }

  const receipt = await prisma.serviceReceipt.findUnique({
    where: {
      id: receiptId,
    },
    select: {
      id: true,
      processStatus: true,
      pickupStatus: true,
      warrantyDays: true,
      createdAt: true,
    },
  });

  if (!receipt) {
    return {
      success: false,
      error: "Nota tidak ditemukan",
    };
  }

  const newProcessStatus =
    status === "processStatus" ? value : receipt.processStatus;

  const newPickupStatus =
    status === "pickupStatus" ? value : receipt.pickupStatus;

  let warrantyUntil = null;

  if (newProcessStatus && newPickupStatus) {
    warrantyUntil = new Date(receipt.createdAt);

    warrantyUntil.setDate(warrantyUntil.getDate() + receipt.warrantyDays);
  }

  await prisma.serviceReceipt.update({
    where: {
      id: receiptId,
    },
    data: {
      [status]: value,
      warrantyUntil,
    },
  });

  revalidatePath("/receipt");

  return {
    success: true,
  };
}

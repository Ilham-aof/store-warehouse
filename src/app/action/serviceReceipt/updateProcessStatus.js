"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateProcessStatus(receiptId, processStatus, value) {
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

  if (processStatus !== "processStatus" && processStatus !== "pickupStatus") {
    return {
      success: false,
      error: "Proses status tidak valid",
    };
  }

  if (typeof value !== "boolean") {
    return {
      success: false,
      error: "Nilai status tidak valid",
    };
  }
  try {
    const receipt = await prisma.serviceReceipt.findUnique({
      where: {
        id: receiptId,
      },
      select: {
        id: true,
        processStatus: true,
        pickupStatus: true,
      },
    });

    if (!receipt) {
      return {
        success: false,
        error: "Nota tidak ditemukan",
      };
    }

    await prisma.serviceReceipt.update({
      where: {
        id: receiptId,
      },
      data: {
        [processStatus]: value,
      },
    });

    revalidatePath("/receipt");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "Gagal memperbarui nota",
    };
  }
}

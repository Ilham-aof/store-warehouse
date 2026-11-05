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
  try {
    const receipt = await prisma.serviceReceipt.findUnique({
      where: {
        id: receiptId,
      },
      select: {
        id: true,
        processStatus: true,
        pickupStatus: true,
        createdAt: true,
        serviceItems: {
          select: {
            id: true,
            warrantyDays: true,
          },
        },
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

    await prisma.$transaction(async (tx) => {
      await tx.serviceReceipt.update({
        where: {
          id: receiptId,
        },
        data: {
          [status]: value,
        },
      });

      if (newProcessStatus && newPickupStatus) {
        const pickupDate = new Date();
        pickupDate.setHours(0, 0, 0, 0);

        await Promise.all(
          receipt.serviceItems.map((item) => {
            let warrantyUntil = null;

            if (item.warrantyDays > 0) {
              warrantyUntil = new Date(pickupDate);
              warrantyUntil.setDate(
                warrantyUntil.getDate() + item.warrantyDays,
              );
            }

            return tx.serviceItem.update({
              where: {
                id: item.id,
              },
              data: {
                warrantyUntil,
              },
            });
          }),
        );
      } else {
        await tx.serviceItem.updateMany({
          where: {
            receiptId,
          },
          data: {
            warrantyUntil: null,
          },
        });
      }
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

"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateServiceReceiptStatus(receiptId, newStatus) {
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

  if (!["Sukses", "Cancel"].includes(newStatus)) {
    return {
      success: false,
      error: "Status nota tidak valid",
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
        receiptStatus: true,
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

    if (receipt.receiptStatus !== "Diproses") {
      return {
        success: false,
        error: "Status nota sudah diubah sebelumnya",
      };
    }

    if (
      newStatus === "Sukses" &&
      (!receipt.processStatus || !receipt.pickupStatus)
    ) {
      return {
        success: false,
        error: "Servis harus selesai dan barang harus sudah diambil",
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.serviceReceipt.update({
        where: {
          id: receiptId,
        },
        data: {
          receiptStatus: newStatus,
        },
      });

      if (newStatus === "Sukses") {
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
    revalidatePath("/service");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Gagal memperbarui nota",
    };
  }
}

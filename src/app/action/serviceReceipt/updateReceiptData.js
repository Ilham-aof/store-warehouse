"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateReceiptData(prevState, formData) {
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

  const receiptId = formData.get("receiptId");
  const outletId = formData.get("outletId");
  const customerName = formData.get("customerName");
  const customerPhone = formData.get("customerPhone");
  const device = formData.get("device");
  const deviceInclusions = formData.getAll("deviceInclusions");
  const discount = Number(formData.get("discount"));
  const inclusionLabels = {
    handphone: "Handphone",
    simcard: "SIM Card",
    charger: "Charger",
    battery: "Battery",
    memory: "Memory",
    softcase: "Soft Case",
  };

  if (!receiptId) {
    return {
      success: false,
      error: "Nota tidak ditemukan",
    };
  }

  if (!outletId) {
    return {
      success: false,
      error: "Cabang tidak ditemukan",
    };
  }
  if (!customerName?.trim()) {
    return {
      success: false,
      error: "Nama customer wajib diisi",
    };
  }

  if (!customerPhone?.trim()) {
    return {
      success: false,
      error: "Nomor customer wajib diisi",
    };
  }

  if (!device?.trim()) {
    return {
      success: false,
      error: "Device wajib diisi",
    };
  }

  if (deviceInclusions.length === 0) {
    return {
      success: false,
      error: "Pilih minimal satu kelengkapan HP",
    };
  } else if (
    deviceInclusions.some(
      (item) =>
        typeof item !== "string" ||
        !Object.prototype.hasOwnProperty.call(inclusionLabels, item),
    )
  ) {
    return {
      success: false,
      error: "Data kelengkapan tidak valid",
    };
  }

  if (!Number.isInteger(discount) || discount < 0) {
    return {
      success: false,
      error: "discount tidak valid",
    };
  }

  const inclusionNames = deviceInclusions.map((item) => inclusionLabels[item]);

  try {
    const receipt = await prisma.serviceReceipt.findUnique({
      where: {
        id: receiptId,
      },
      select: {
        id: true,
        createdAt: true,
        processStatus: true,
        pickupStatus: true,
        serviceItems: {
          select: {
            price: true,
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

    const totalService = receipt.serviceItems.reduce(
      (total, item) => total + item.price,
      0,
    );

    if (discount > totalService) {
      return {
        success: false,
        error: "Potongan tidak boleh melebihi total biaya servis",
      };
    }

    await prisma.serviceReceipt.update({
      where: {
        id: receiptId,
      },
      data: {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        device: device.trim(),
        deviceInclusions: inclusionNames,
        discount,
      },
    });
  } catch (error) {
    return {
      success: false,
      error: "Gagal memperbarui data nota",
    };
  }

  revalidatePath("/order");
  return {
    success: true,
    error: {},
  };
}

import { prisma } from "@/lib/prisma";

export async function getDataServiceReceipt(outletId) {
  if (!outletId) {
    return [];
  }

  return await prisma.serviceReceipt.findMany({
    where: {
      outletId,
      NOT: {
        processStatus: true,
        pickupStatus: true,
      },
    },
    select: {
      id: true,
      invoiceNumber: true,
      customerName: true,
      customerPhone: true,
      device: true,
      warrantyDays: true,
      warrantyUntil: true,
      processStatus: true,
      pickupStatus: true,
      outletId: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

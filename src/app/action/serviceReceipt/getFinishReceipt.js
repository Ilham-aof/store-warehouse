import { prisma } from "@/lib/prisma";

export async function getFinishReceipt(outletId) {
  if (!outletId) {
    return [];
  }

  return await prisma.serviceReceipt.findMany({
    where: {
      outletId,
      processStatus: true,
      pickupStatus: true,
    },
    include: {
      outlet: true,
      serviceItems: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

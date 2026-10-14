import { prisma } from "@/lib/prisma";

export async function getFinishReceipt(
  outletId,
  search,
  timeFilter,
  warrantyFilter,
  pageNumber,
  pageSize,
) {
  if (!outletId) {
    return {
      receipts: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }

  const keyword = (search ?? "").trim();
  const safePage = Math.max(1, Number(pageNumber) || 1);
  const safePageSize = Math.max(1, Number(pageSize) || 20);

  const now = new Date();
  let startDate = null;

  if (timeFilter === "today") {
    startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
  } else if (timeFilter === "week") {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);
  } else if (timeFilter === "month") {
    startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 1);
    startDate.setHours(0, 0, 0, 0);
  }

  const where = {
    outletId,
    processStatus: true,
    pickupStatus: true,

    ...(keyword.length >= 2 && {
      customerName: {
        contains: keyword,
        mode: "insensitive",
      },
    }),

    ...(startDate && {
      createdAt: {
        gte: startDate,
        lte: now,
      },
    }),

    ...(warrantyFilter === "active" && {
      warrantyDays: { gt: 0 },
      warrantyUntil: {
        gte: now,
      },
    }),

    ...(warrantyFilter === "expired" && {
      warrantyDays: { gt: 0 },
      warrantyUntil: {
        lt: now,
      },
    }),

    ...(warrantyFilter === "noWarranty" && {
      warrantyDays: 0,
    }),
  };

  const totalItems = await prisma.serviceReceipt.count({
    where,
  });

  const totalPages = Math.ceil(totalItems / safePageSize);
  const currentPage = totalPages === 0 ? 1 : Math.min(safePage, totalPages);
  const receipts = await prisma.serviceReceipt.findMany({
    where,
    include: {
      outlet: true,
      serviceItems: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * safePageSize,
    take: safePageSize,
  });

  return {
    receipts,
    totalItems,
    totalPages,
    currentPage,
  };
}

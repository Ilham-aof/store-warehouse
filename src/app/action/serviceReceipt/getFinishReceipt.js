import { prisma } from "@/lib/prisma";

export async function getFinishReceipt(
  outletId,
  search,
  receiptStatusFilter,
  timeFilter,
  warrantyFilter,
  pageNumber,
  pageSize,
  customStartDate,
  customEndDate,
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

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  let startDate = null;
  let endDate = now;

  const receiptStatusCondition =
    receiptStatusFilter === "sukses"
      ? { receiptStatus: "Sukses" }
      : receiptStatusFilter === "cancel"
        ? { receiptStatus: "Cancel" }
        : {
            receiptStatus: {
              in: ["Sukses", "Cancel"],
            },
          };

  if (timeFilter === "today") {
    startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
  } else if (timeFilter === "week") {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);
  } else if (timeFilter === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (timeFilter === "custom" && customStartDate && customEndDate) {
    startDate = new Date(customStartDate);
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date(customEndDate);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(0, 0, 0, 0);
  }

  const where = {
    outletId,
    ...receiptStatusCondition,

    ...(keyword.length > 0 && {
      OR: [
        {
          invoiceNumber: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          customerName: {
            contains: keyword,
            mode: "insensitive",
          },
        },
      ],
    }),

    ...(startDate && {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    }),

    ...(warrantyFilter === "active" && {
      serviceItems: {
        some: {
          warrantyDays: { gt: 0 },
          warrantyUntil: {
            gte: startOfToday,
          },
        },
      },
    }),

    ...(warrantyFilter === "expired" && {
      serviceItems: {
        some: {
          warrantyDays: { gt: 0 },
          warrantyUntil: {
            lt: startOfToday,
          },
        },
      },
    }),

    ...(warrantyFilter === "noWarranty" && {
      serviceItems: {
        some: {
          warrantyDays: 0,
        },
      },
    }),
  };

  try {
    const totalItems = await prisma.serviceReceipt.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / safePageSize);
    const currentPage = totalPages === 0 ? 1 : Math.min(safePage, totalPages);
    const receipts = await prisma.serviceReceipt.findMany({
      where,
      include: {
        outlet: true,
        user: true,
        serviceItems: true,
      },
      orderBy: {
        updatedAt: "desc",
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
  } catch (error) {
    return {
      receipts: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      success: false,
      error: "Gagal mengambil data nota",
    };
  }
}

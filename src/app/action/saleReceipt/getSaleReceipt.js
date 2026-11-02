import { prisma } from "@/lib/prisma";

export async function getDataSaleReceipt(
  outletId,
  search,
  timeFilter,
  page,
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

  const keyword = search.trim();
  const safePage = Math.max(1, Number(page) || 1);
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
    ...(keyword.length > 0 && {
      invoiceNumber: {
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
  };
  try {
    const [receipts, totalItems] = await Promise.all([
      prisma.saleReceipt.findMany({
        where,
        select: {
          id: true,
          invoiceNumber: true,
          userId: true,
          totalAmount: true,
          outletId: true,
          createdAt: true,
          user: {
            select: {
              name: true,
            },
          },
          saleItems: {
            select: {
              id: true,
              productName: true,
              productQuantity: true,
              subtotal: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (safePage - 1) * safePageSize,
        take: safePageSize,
      }),

      prisma.saleReceipt.count({
        where,
      }),
    ]);

    return {
      receipts,
      totalItems,
      totalPages: Math.ceil(totalItems / safePageSize),
      currentPage: safePage,
    };
  } catch (error) {
    return {
      success: false,
      error: "Gagal mengambil data nota",
    };
  }
}

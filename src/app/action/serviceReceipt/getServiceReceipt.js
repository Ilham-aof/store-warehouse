import { prisma } from "@/lib/prisma";

export async function getDataServiceReceipt(outletId, search, page, pageSize) {
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

  const where = {
    outletId,
    NOT: {
      processStatus: true,
      pickupStatus: true,
    },
    ...(keyword.length > 0 && {
      customerName: {
        contains: keyword,
        mode: "insensitive",
      },
    }),
  };
  try {
    const [receipts, totalItems] = await Promise.all([
      prisma.serviceReceipt.findMany({
        where,
        select: {
          id: true,
          invoiceNumber: true,
          customerName: true,
          customerPhone: true,
          device: true,
          deviceInclusions: true,
          warrantyDays: true,
          warrantyUntil: true,
          discount: true,
          processStatus: true,
          pickupStatus: true,
          outletId: true,
          createdAt: true,
          user: {
            select: {
              name: true,
            },
          },
          serviceItems: {
            select: {
              price: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (safePage - 1) * safePageSize,
        take: safePageSize,
      }),

      prisma.serviceReceipt.count({
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

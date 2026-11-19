"use server";

import { prisma } from "@/lib/prisma";

export async function getTotalSaleReceipt(outletId, timeFilter) {
  const now = new Date();

  let startDate;
  let endDate;

  if (timeFilter === "7days") {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(0, 0, 0, 0);
  } else if (timeFilter === "thisMonth") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  } else if (timeFilter === "thisYear") {
    startDate = new Date(now.getFullYear(), 0, 1);
    endDate = new Date(now.getFullYear() + 1, 0, 1);
  }

  try {
    const [totalSale, chartDataSale] = await Promise.all([
      prisma.saleReceipt.count({
        where: {
          ...(outletId && { outletId }),
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      }),

      prisma.saleReceipt.findMany({
        where: {
          ...(outletId && { outletId }),
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
        select: {
          createdAt: true,
        },
      }),
    ]);

    return {
      totalSale,
      chartDataSale,
    };
  } catch (error) {
    console.error("Gagal mengambil nota penjualan:", error);

    return {
      totalSale: 0,
      chartDataSale: [],
    };
  }
}

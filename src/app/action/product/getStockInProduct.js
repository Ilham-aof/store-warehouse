"use server";

import { prisma } from "@/lib/prisma";

export async function getStockInProduct(outletId, timeFilter) {
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
    const data = await prisma.stockIn.findMany({
      where: {
        product: {
          outletId,
        },
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        quantity: true,
        createdAt: true,
      },
    });

    const groupedData = {};

    data.forEach((item) => {
      const date = item.createdAt.toLocaleDateString("en-CA", {
        timeZone: "Asia/Jakarta",
      });

      if (!groupedData[date]) {
        groupedData[date] = 0;
      }

      groupedData[date] += item.quantity;
    });

    return Object.entries(groupedData).map(([date, total]) => ({
      date,
      total,
    }));
  } catch (error) {
    return [];
  }
}

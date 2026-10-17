import { prisma } from "@/lib/prisma";

export async function getProductHistory(outletId, timeFilter, page, pageSize) {
  if (!outletId) {
    return { history: [], totalItems: 0, totalPages: 0, currentPage: 1 };
  }

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
    product: { outletId },
    ...(startDate && {
      createdAt: { gte: startDate },
    }),
  };
  const [stockIns, stockOuts] = await Promise.all([
    prisma.stockIn.findMany({
      where,
      select: {
        id: true,
        quantity: true,
        createdAt: true,
        product: {
          select: {
            name: true,
            category: true,
            brand: true,
            outletId: true,
          },
        },
        user: { select: { name: true } },
      },
    }),
    prisma.stockOut.findMany({
      where,
      select: {
        id: true,
        quantity: true,
        createdAt: true,
        product: {
          select: {
            name: true,
            category: true,
            brand: true,
            outletId: true,
          },
        },
        user: { select: { name: true } },
      },
    }),
  ]);

  const history = [
    ...stockIns.map((item) => ({
      id: item.id,
      productName: item.product.name,
      productCategory: item.product.category,
      productBrand: item.product.brand,
      outletId: item.product.outletId,
      activity: "Masuk",
      quantity: item.quantity,
      userName: item.user.name,
      createdAt: item.createdAt,
    })),
    ...stockOuts.map((item) => ({
      id: item.id,
      productName: item.product.name,
      productCategory: item.product.category,
      productBrand: item.product.brand,
      outletId: item.product.outletId,
      activity: "Keluar",
      quantity: item.quantity,
      userName: item.user.name,
      createdAt: item.createdAt,
    })),
  ];

  history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalItems = history.length;
  const totalPages = Math.ceil(totalItems / safePageSize);
  const currentPage = Math.min(safePage, Math.max(1, totalPages));
  const startIndex = (currentPage - 1) * safePageSize;

  return {
    history: history.slice(startIndex, startIndex + safePageSize),
    totalItems,
    totalPages,
    currentPage,
  };
}

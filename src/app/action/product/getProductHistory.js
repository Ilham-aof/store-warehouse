import { prisma } from "@/lib/prisma";

export async function getProductHistory(
  outletId,
  timeFilter,
  activityFilter,
  page,
  pageSize,
  customStartDate,
  customEndDate,
) {
  if (!outletId) {
    return { history: [], totalItems: 0, totalPages: 0, currentPage: 1 };
  }

  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Number(pageSize) || 20);

  const now = new Date();

  let startDate = null;
  let endDate = now;

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
    product: { outletId },
    ...(startDate && {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    }),
  };
  const [stockIns, stockOuts] = await Promise.all([
    activityFilter !== "keluar"
      ? prisma.stockIn.findMany({
          where,
          select: {
            id: true,
            quantity: true,
            type: true,
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
            sourceOutlet: {
              select: { name: true },
            },
          },
        })
      : Promise.resolve([]),

    activityFilter !== "masuk"
      ? prisma.stockOut.findMany({
          where,
          select: {
            id: true,
            quantity: true,
            type: true,
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
            destinationOutlet: {
              select: { name: true },
            },
          },
        })
      : Promise.resolve([]),
  ]);

  const history = [
    ...stockIns.map((item) => ({
      id: item.id,
      productName: item.product.name,
      productCategory: item.product.category,
      productBrand: item.product.brand,
      outletId: item.product.outletId,
      activity: "Masuk",
      type: item.type,
      getFrom: item.sourceOutlet?.name
        ? `Dari: ${item.sourceOutlet.name}`
        : "-",
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
      type: item.type,
      sendTo: item.destinationOutlet?.name
        ? `Ke: ${item.destinationOutlet.name}`
        : "-",
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

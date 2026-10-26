import { prisma } from "@/lib/prisma";

export async function getDataProduct(outletId, search, page, pageSize) {
  if (!outletId) {
    return {
      products: [],
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
    ...(keyword.length > 0 && {
      OR: [
        {
          name: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          barcode: {
            contains: keyword,
          },
        },
      ],
    }),
  };

  const [products, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        barcode: true,
        category: true,
        brand: true,
        quantity: true,
        price: true,
        outletId: true,
        outlet: {
          select: {
            name: true,
          },
        },
        stockIns: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (safePage - 1) * safePageSize,
      take: safePageSize,
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    products,
    totalItems,
    totalPages: Math.ceil(totalItems / safePageSize),
    currentPage: safePage,
  };
}

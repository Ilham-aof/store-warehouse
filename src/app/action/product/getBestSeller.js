"use server";

import { prisma } from "@/lib/prisma";

export async function getBestSeller(outletId) {
  if (!outletId) {
    return [];
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const bestSellers = await prisma.stockOut.groupBy({
    by: ["productId"],
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
      product: {
        outletId,
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  const productIds = bestSellers.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      id: true,
      name: true,
      quantity: true,
    },
  });

  return bestSellers.map((item) => {
    const product = products.find((product) => product.id === item.productId);

    return {
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      soldQuantity: item._sum.quantity,
    };
  });
}

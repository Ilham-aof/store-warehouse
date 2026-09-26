import { prisma } from "@/lib/prisma";

export async function getProductHistory(outletId) {
  const [stockIns, stockOuts] = await Promise.all([
    prisma.stockIn.findMany({
      where: {
        product: {
          outletId,
        },
      },
      select: {
        id: true,
        quantity: true,
        createdAt: true,
        product: {
          select: {
            name: true,
            type: true,
            brand: true,
            outletId: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    }),

    prisma.stockOut.findMany({
      where: {
        product: {
          outletId,
        },
      },
      select: {
        id: true,
        quantity: true,
        createdAt: true,
        product: {
          select: {
            name: true,
            type: true,
            brand: true,
            outletId: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const history = [
    ...stockIns.map((stockIn) => ({
      id: stockIn.id,
      productName: stockIn.product.name,
      productType: stockIn.product.type,
      productBrand: stockIn.product.brand,
      outletId: stockIn.product.outletId,
      activity: "Masuk",
      quantity: stockIn.quantity,
      userName: stockIn.user.name,
      createdAt: stockIn.createdAt,
    })),

    ...stockOuts.map((stockOut) => ({
      id: stockOut.id,
      productName: stockOut.product.name,
      productType: stockOut.product.type,
      productBrand: stockOut.product.brand,
      outletId: stockOut.product.outletId,
      activity: "Keluar",
      quantity: stockOut.quantity,
      userName: stockOut.user.name,
      createdAt: stockOut.createdAt,
    })),
  ];

  history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return history;
}

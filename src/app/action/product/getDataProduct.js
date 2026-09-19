import { prisma } from "@/lib/prisma";

export async function getDataProduct() {
  return await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      brand: true,
      quantity: true,
      price: true,
      productIn: true,
    },
    orderBy: {
      productIn: "desc",
    },
  });
}

import { prisma } from "@/lib/prisma";

export async function getOutlet() {
  return await prisma.outlet.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      address: true,
      phone: true,
    },
    orderBy: {
      name: "desc",
    },
  });
}

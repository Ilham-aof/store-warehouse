import { prisma } from "@/lib/prisma";

export async function getOutlet() {
  return await prisma.outlet.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "desc",
    },
  });
}

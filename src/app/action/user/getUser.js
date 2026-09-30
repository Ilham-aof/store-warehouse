import { prisma } from "@/lib/prisma";

export async function getUser() {
  return await prisma.user.findMany({
    where: {
      role: "Staff",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
    orderBy: {
      name: "desc",
    },
  });
}

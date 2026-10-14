import { prisma } from "@/lib/prisma";

export async function getUser(pageNumber, pageSize) {
  const safePage = Math.max(1, Number(pageNumber) || 1);
  const safePageSize = Math.max(1, Number(pageSize) || 10);

  const where = {
    role: "Staff",
  };

  const totalItems = await prisma.user.count({
    where,
  });

  const totalPages = Math.ceil(totalItems / safePageSize);

  const currentPage = totalPages === 0 ? 1 : Math.min(safePage, totalPages);

  const users = await prisma.user.findMany({
    where,
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
    skip: (currentPage - 1) * safePageSize,
    take: safePageSize,
  });

  return {
    users,
    totalItems,
    totalPages,
    currentPage,
  };
}

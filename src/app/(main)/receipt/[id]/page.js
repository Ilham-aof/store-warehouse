import { getCurrentUser } from "@/app/action/user/getCurrentUser";
import React from "react";

export default async function page({ params }) {
  const { id } = await params;
  const user = await getCurrentUser();

  const receipt = await prisma.serviceReceipt.findUnique({
    where: {
      id,
    },
    include: {
      outlet: true,
      serviceItems: true,
    },
  });

  if (!receipt) {
    notFound();
  }

  return (
    <div>
      <div>print page</div>
    </div>
  );
}

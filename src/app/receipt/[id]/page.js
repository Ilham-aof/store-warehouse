import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/action/user/getCurrentUser";
import { PrintServiceReceipt } from "@/component/receipt-page/printServiceReceipt";
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
    <main className="w-full flex flex-col items-center overflow-auto bg-gray-200 p-6 space-y-6">
      <h1 className="text-2xl font-bold">Preview Nota Servis</h1>

      <PrintServiceReceipt receipt={receipt} user={user} />
    </main>
  );
}

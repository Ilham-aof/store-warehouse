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
    <main className="w-screen h-screen flex flex-col items-center overflow-hidden bg-gray-200 p-6">
      <div className="rounded-2xl shadow-[4px_4px_4px,inset_0_0_6px_rgba(0,0,0,0.2)] shadow-slate-400 h-full w-1/2 min-h-0 flex flex-col space-y-5 bg-white p-5">
        <h1 className="text-2xl text-center font-bold shrink-0">
          Preview Nota Servis
        </h1>

        <PrintServiceReceipt receipt={receipt} user={user} />
      </div>
    </main>
  );
}

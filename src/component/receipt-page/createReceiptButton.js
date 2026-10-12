"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export function CreateReceiptButton({ selectedOutletId }) {
  const router = useRouter();

  return (
    <Button
      onClick={() =>
        router.push(`/order/create-receipt?outletId=${selectedOutletId}`)
      }
    >
      <Plus />
      Buat Nota
    </Button>
  );
}

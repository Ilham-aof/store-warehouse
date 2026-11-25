"use client";

import { useActionState } from "react";
import { Button, toast } from "@heroui/react";
import { logoutAction } from "@/app/action/auth/logout";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const [state, action, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await logoutAction(prevState, formData);

      if (result.success) {
        toast.success("Berhasil logout");
        router.push("/login");
      } else if (result.error) {
        toast.danger("Gagal logout", {
          description: result.error,
        });
      } else {
        toast.danger("Terjadi Kesalahan pada server, coba lagi nanti");
      }

      return result;
    },
    {
      success: false,
      error: null,
    },
  );

  return (
    <>
      <form action={action}>
        <Button
          type="submit"
          isDisabled={isPending}
          isIconOnly
          className="border-2 border-yellow-100 bg-slate-800 text-yellow-100 hover:bg-danger hover:border-danger hover:text-white "
        >
          <LogOut />
        </Button>
      </form>
    </>
  );
}

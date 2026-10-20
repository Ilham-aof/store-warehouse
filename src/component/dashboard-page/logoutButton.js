"use client";

import { useActionState } from "react";
import { Button } from "@heroui/react";
import { logoutAction } from "@/app/action/auth/logout";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [state, action, isPending] = useActionState(logoutAction, null);

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
          {isPending ? "" : ""}
        </Button>
      </form>
    </>
  );
}

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
          variant="danger"
          isIconOnly
        >
          <LogOut />
          {isPending ? "" : ""}
        </Button>
      </form>
    </>
  );
}

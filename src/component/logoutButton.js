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
        <div className="min-h-6">
          {state?.error && (
            <p className="mt-2 text-sm text-red-500">{state.error}</p>
          )}
        </div>
        <Button type="submit" isDisabled={isPending} variant="danger">
          <LogOut />
          {isPending ? "Logging out..." : "Logout"}
        </Button>
      </form>
    </>
  );
}

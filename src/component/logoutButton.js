"use client";

import { useActionState } from "react";
import { Button } from "@heroui/react";
import { logoutAction } from "@/app/action/auth/logout";

export function LogoutButton() {
  const [state, action, isPending] = useActionState(logoutAction, null);

  return (
    <main>
      <form action={action}>
        <Button type="submit" isDisabled={isPending}>
          {isPending ? "Logging out..." : "Logout"}
        </Button>
        <div className="min-h-6">
          {state?.error && (
            <p className="mt-2 text-sm text-red-500">{state.error}</p>
          )}
        </div>
      </form>
    </main>
  );
}

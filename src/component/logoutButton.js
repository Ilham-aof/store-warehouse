"use client";
import { Button } from "@heroui/react";
import { logoutAction } from "@/app/action/auth/logout";

export function LogoutButton() {
  return (
    <main>
      <Button onClick={logoutAction}>Logout</Button>
    </main>
  );
}

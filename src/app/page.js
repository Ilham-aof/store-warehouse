"use client";
import Image from "next/image";
import { Button } from "@heroui/react";
import { logoutAction } from "@/app/action/auth/logout";

export default function Home() {
  return (
    <main>
      <div>
        <Button onClick={logoutAction}>Logout</Button>
      </div>
    </main>
  );
}

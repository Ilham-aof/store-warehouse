"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;
  try {
    if (sessionId) {
      await prisma.session.delete({
        where: {
          id: sessionId,
        },
      });
    }
    cookieStore.delete("session");
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: "Gagal melakukan logout.",
    };
  }
  redirect("/login");
}

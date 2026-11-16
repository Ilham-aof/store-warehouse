"use server";
import { prisma } from "@/lib/prisma";
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

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: "Gagal melakukan logout.",
    };
  }
}

"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteUserAction(prevState, formData) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });

  if (!session || session.expiresAt < new Date()) {
    cookieStore.delete("session");
    redirect("/login");
  }

  if (session.user.role !== "Admin") {
    return {
      success: false,
      error: "Kamu tidak memiliki akses.",
    };
  }

  const userId = formData.get("userId");

  if (!userId) {
    return {
      success: false,
      error: "User tidak ditemukan.",
    };
  }

  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    return {
      success: false,
      error: "Terjadi kesalahan pada server. Coba lagi nanti.",
    };
  }

  revalidatePath("/admin");
  return {
    success: true,
    error: null,
  };
}
